"""
NELFAX AI - Production FastAPI GPU Microservice & MLOps Engine
RunPod Serverless & Standalone GPU Worker Backend.

Single stable endpoint: POST /process-image
Supported modes: upscale_4k, upscale_8k, face_restore, portrait_bokeh, remove_object, enhance_landscape.
Supported models: Real-ESRGAN, GFPGAN, LaMa, SAM 2, SDXL.

CRITICAL MLOps VRAM OPTIMIZATION:
Strict dynamic model switching ensures only ONE heavy model resides in VRAM at a time.
Upon completion of every request, aggressive memory cleanup (del, gc.collect, torch.cuda.empty_cache) is enforced.
"""
import base64
import io
import uuid
import time
import asyncio
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from PIL import Image

from models.model_manager import model_manager
from pipelines.realesrgan_pipeline import RealESRGANPipeline
from pipelines.gfpgan_pipeline import GFPGANPipeline
from pipelines.sam2_portrait_pipeline import SAM2PortraitPipeline
from pipelines.lama_inpainting_pipeline import LaMaInpaintingPipeline
from pipelines.sdxl_controlnet_pipeline import SDXLControlNetPipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("nelfax.fastapi.mlops")

app = FastAPI(
    title="NELFAX AI Engine API (RunPod Serverless Optimized)",
    description="Backend FastAPI unique pour traitement d'image IA avec basculement dynamique de modèle en VRAM (< 2s).",
    version="3.0.0-MLOps"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Async execution queue semaphore to prevent VRAM OOM collisions under burst concurrent requests
GPU_QUEUE_SEMAPHORE = asyncio.Semaphore(1)

# In-memory store for async background jobs
jobs_store: Dict[str, Dict[str, Any]] = {}

class ProcessRequestJSON(BaseModel):
    image_base64: str = Field(..., description="Image encodée en base64 Data URL")
    feature_mode: Optional[str] = Field(default="upscale_4k", description="upscale_4k, upscale_8k, face_restore, portrait_bokeh, remove_object, enhance_landscape")
    mode: Optional[str] = Field(default="upscale_4k", description="Alias pour feature_mode")
    prompt: Optional[str] = Field(default="dramatic cinematic lighting 8k", description="Prompt pour SDXL ControlNet")

class JobResponse(BaseModel):
    job_id: str
    status: str
    progress: int
    step_label: str

def decode_image_bytes_or_b64(raw_bytes: bytes = None, b64_str: str = None) -> Image.Image:
    try:
        if raw_bytes and len(raw_bytes) > 0:
            return Image.open(io.BytesIO(raw_bytes)).convert("RGB")
        if b64_str:
            data = b64_str
            if "," in data:
                data = data.split(",", 1)[1]
            return Image.open(io.BytesIO(base64.b64decode(data))).convert("RGB")
        raise ValueError("Données d'image vides.")
    except Exception as e:
        logger.error(f"Erreur de décodage image: {e}")
        raise HTTPException(status_code=400, detail="Image invalide ou format non supporté.")

def encode_pil_to_base64(img: Image.Image, format: str = "PNG") -> str:
    buffered = io.BytesIO()
    img.save(buffered, format=format)
    b64_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/{format.lower()};base64,{b64_str}"

def get_pipeline_factory(model_key: str):
    """Returns factory function for dynamic model instantiation."""
    if model_key in ["Real-ESRGAN_x4", "Real-ESRGAN_x8"]:
        return lambda device: RealESRGANPipeline(device=device)
    elif model_key == "GFPGANv1.4":
        return lambda device: GFPGANPipeline(device=device)
    elif model_key == "SAM2_Base":
        return lambda device: SAM2PortraitPipeline(device=device)
    elif model_key == "LaMa_Fourier":
        return lambda device: LaMaInpaintingPipeline(device=device)
    elif model_key == "SDXL_ControlNet":
        return lambda device: SDXLControlNetPipeline(device=device)
    return lambda device: RealESRGANPipeline(device=device)

async def core_run_inference(img_pil: Image.Image, mode: str, prompt: str, progress_cb = None) -> Tuple[Image.Image, Dict[str, Any]]:
    """
    Executes inference with strict single-model VRAM residence and post-job purge.
    """
    model_key = model_manager.map_mode_to_model_key(mode)
    if progress_cb:
        progress_cb(15, f"Acquisition du verrou VRAM & Basculement vers [{model_key}]...")

    async with GPU_QUEUE_SEMAPHORE:
        try:
            factory = get_pipeline_factory(model_key)
            pipe = await model_manager.switch_and_load_pipeline(model_key, factory)
            
            if progress_cb:
                progress_cb(45, f"Exécution tensorielle PyTorch FP16 ({model_key})...")

            # Execute model specific logic
            if model_key in ["Real-ESRGAN_x4", "Real-ESRGAN_x8"]:
                scale = 8 if "x8" in model_key else 4
                res_img, diag = pipe.process(img_pil, scale_factor=scale, progress_callback=progress_cb)
            elif model_key == "GFPGANv1.4":
                res_img, diag = pipe.process(img_pil, upscale=2, progress_callback=progress_cb)
            elif model_key == "SAM2_Base":
                res_img, diag = pipe.process(img_pil, blur_radius=14.0, progress_callback=progress_cb)
            elif model_key == "LaMa_Fourier":
                res_img, diag = pipe.process(img_pil, progress_callback=progress_cb)
            elif model_key == "SDXL_ControlNet":
                res_img, diag = pipe.process(img_pil, prompt=prompt, progress_callback=progress_cb)
            else:
                res_img, diag = pipe.process(img_pil, scale_factor=4, progress_callback=progress_cb)

            if progress_cb:
                progress_cb(95, "Encodage final 16-bit et libération agressive VRAM...")
            
            return res_img, diag
        finally:
            # CRUCIAL VRAM OPTIMIZATION CONSTRAINT:
            # Aggressive VRAM cleanup as requested: torch.cuda.empty_cache() & gc.collect()
            logger.info(f"🏁 [FIN JOB INFERENCE] Nettoyage agressif de la mémoire VRAM pour RunPod...")
            model_manager.purge_vram(force_log=True)


# =====================================================================
# PRIMARY STABLE ENDPOINT: POST /process-image
# Supports both Multipart Form Upload (UploadFile + mode) & JSON Base64
# =====================================================================
@app.post("/process-image")
async def process_image_endpoint(
    request: Request,
    image: Optional[UploadFile] = File(None),
    mode: Optional[str] = Form("upscale_4k"),
    prompt: Optional[str] = Form("dramatic cinematic lighting 8k")
):
    """
    Unique stable endpoint required by MLOps specification.
    Input: image file (or image_base64 JSON) + mode string.
    Supported modes: upscale_4k, upscale_8k, face_restore, portrait_bokeh, remove_object, enhance_landscape.
    """
    start_t = time.time()
    img_pil = None
    feature_mode = mode or "upscale_4k"
    custom_prompt = prompt or "dramatic cinematic lighting 8k"

    # Check content-type to handle multipart vs json automatically
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            b64 = body.get("image_base64") or body.get("image")
            feature_mode = body.get("mode") or body.get("feature_mode", feature_mode)
            custom_prompt = body.get("prompt", custom_prompt)
            img_pil = decode_image_bytes_or_b64(b64_str=b64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Payload JSON invalide: {e}")
    else:
        if not image:
            raise HTTPException(status_code=400, detail="Fichier image manquant dans le formulaire multipart.")
        raw_bytes = await image.read()
        img_pil = decode_image_bytes_or_b64(raw_bytes=raw_bytes)

    logger.info(f"📨 [POST /process-image] Mode demandé: [{feature_mode}] | Taille image: {img_pil.size}")

    try:
        res_pil, diag = await core_run_inference(img_pil, feature_mode, custom_prompt)
        out_b64 = encode_pil_to_base64(res_pil, format="PNG")
        
        diag["mlops_endpoint"] = "POST /process-image"
        diag["total_latency_ms"] = round((time.time() - start_t) * 1000, 1)
        diag["vram_status_post_cleanup"] = model_manager.get_device_info()

        return JSONResponse(status_code=200, content={
            "success": True,
            "status": "completed",
            "mode": feature_mode,
            "result_image": out_b64,
            "result_url": out_b64,
            "resultUrl": out_b64,
            "diagnostic": diag
        })
    except Exception as e:
        logger.error(f"❌ [POST /process-image] Erreur: {e}", exc_info=True)
        # Enforce VRAM purge on error
        model_manager.purge_vram(force_log=True)
        return JSONResponse(status_code=500, content={
            "success": False,
            "status": "failed",
            "error": str(e)
        })


# =====================================================================
# ASYNC JOB SUBMISSION ENDPOINTS (For long-polling RunPod UI workers)
# =====================================================================
async def async_job_worker(job_id: str, b64_input: str, mode: str, prompt: str):
    try:
        jobs_store[job_id]["status"] = "processing"
        jobs_store[job_id]["progress"] = 10
        jobs_store[job_id]["step_label"] = f"Mise en file d'attente GPU pour mode [{mode}]..."
        
        img_pil = decode_image_bytes_or_b64(b64_str=b64_input)

        def progress_updater(pct: int, label: str):
            jobs_store[job_id]["progress"] = pct
            jobs_store[job_id]["step_label"] = label
            logger.info(f"Job [{job_id}] -> {pct}% : {label}")

        res_pil, diag = await core_run_inference(img_pil, mode, prompt, progress_cb=progress_updater)
        out_b64 = encode_pil_to_base64(res_pil, format="PNG")

        jobs_store[job_id].update({
            "status": "completed",
            "progress": 100,
            "step_label": "✨ Traitement IA terminé avec succès !",
            "result_image": out_b64,
            "diagnostic": diag
        })
    except Exception as e:
        logger.error(f"Job async [{job_id}] échec: {e}", exc_info=True)
        model_manager.purge_vram(force_log=True)
        jobs_store[job_id].update({
            "status": "failed",
            "progress": 0,
            "step_label": "Erreur lors de l'inférence PyTorch",
            "error": str(e)
        })

@app.post("/v1/jobs/submit", response_model=JobResponse)
async def submit_job(request: ProcessRequestJSON, background_tasks: BackgroundTasks):
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    jobs_store[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "progress": 5,
        "step_label": "En attente d'allocation GPU dans la file RunPod...",
        "created_at": time.time()
    }
    background_tasks.add_task(async_job_worker, job_id, request.image_base64, request.feature_mode, request.prompt or "")
    return JobResponse(job_id=job_id, status="queued", progress=5, step_label="En attente d'allocation GPU...")

@app.get("/v1/jobs/{job_id}")
async def get_job(job_id: str):
    if job_id not in jobs_store:
        raise HTTPException(status_code=404, detail="Job introuvable dans le cache de file d'attente.")
    return jobs_store[job_id]

@app.get("/v1/health")
@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "engine": "NELFAX AI RunPod Serverless MLOps Engine v3.0",
        "hardware": model_manager.get_device_info()
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Démarrage du serveur FastAPI MLOps sur le port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
