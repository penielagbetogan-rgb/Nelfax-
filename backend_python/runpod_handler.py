"""
NELFAX AI - RunPod Serverless Worker Handler (MLOps VRAM Optimized)
Enables deployment on RunPod Serverless GPU instances (NVIDIA RTX 4090 / A100 / H100).

Implements strict Dynamic Model Switching and aggressive memory cleanup:
1. Only ONE model resides in VRAM at any time.
2. Upon completion, torch.cuda.empty_cache() & gc.collect() are enforced via model_manager.purge_vram().
"""
import base64
import io
import asyncio
import logging
from typing import Dict, Any
import runpod
from PIL import Image

from models.model_manager import model_manager
from pipelines.realesrgan_pipeline import RealESRGANPipeline
from pipelines.gfpgan_pipeline import GFPGANPipeline
from pipelines.sam2_portrait_pipeline import SAM2PortraitPipeline
from pipelines.lama_inpainting_pipeline import LaMaInpaintingPipeline
from pipelines.sdxl_controlnet_pipeline import SDXLControlNetPipeline

logger = logging.getLogger("nelfax.runpod.serverless_handler")

def decode_image(b64_data: str) -> Image.Image:
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    return Image.open(io.BytesIO(base64.b64decode(b64_data))).convert("RGB")

def encode_image(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

def get_pipeline_factory(model_key: str):
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

async def async_runpod_handler(job: Dict[str, Any]) -> Dict[str, Any]:
    """
    RunPod Serverless entry handler.
    Receives input payload from RunPod API gateway, performs dynamic model switching, runs PyTorch inference,
    and guarantees VRAM purge before returning.
    """
    job_input = job.get("input", {})
    image_base64 = job_input.get("image_base64") or job_input.get("image")
    feature_mode = job_input.get("feature_mode") or job_input.get("mode", "upscale_4k")
    prompt = job_input.get("prompt", "dramatic cinematic lighting 8k")

    if not image_base64:
        return {"error": "Paramètre 'image_base64' manquant dans le payload RunPod."}

    logger.info(f"⚡ [RunPod Handler] Début traitement pour mode [{feature_mode}] (Job ID: {job.get('id', 'N/A')})")

    try:
        img_pil = decode_image(image_base64)
        model_key = model_manager.map_mode_to_model_key(feature_mode)

        steps = []
        def log_step(pct: int, label: str):
            steps.append({"progress": pct, "label": label})
            logger.info(f"RunPod Worker Progress -> {pct}% : {label}")

        log_step(15, f"Basculement VRAM vers [{model_key}] en moins de 2s...")
        factory = get_pipeline_factory(model_key)
        pipe = await model_manager.switch_and_load_pipeline(model_key, factory)

        log_step(45, f"Inférence PyTorch FP16 ({model_key})...")
        if model_key in ["Real-ESRGAN_x4", "Real-ESRGAN_x8"]:
            scale = 8 if "x8" in model_key else 4
            result_pil, diag = pipe.process(img_pil, scale_factor=scale, progress_callback=log_step)
        elif model_key == "GFPGANv1.4":
            result_pil, diag = pipe.process(img_pil, upscale=2, progress_callback=log_step)
        elif model_key == "SAM2_Base":
            result_pil, diag = pipe.process(img_pil, blur_radius=14.0, progress_callback=log_step)
        elif model_key == "LaMa_Fourier":
            result_pil, diag = pipe.process(img_pil, progress_callback=log_step)
        elif model_key == "SDXL_ControlNet":
            result_pil, diag = pipe.process(img_pil, prompt=prompt, progress_callback=log_step)
        else:
            result_pil, diag = pipe.process(img_pil, scale_factor=4, progress_callback=log_step)

        output_b64 = encode_image(result_pil)
        
        return {
            "status": "COMPLETED",
            "result_image": output_b64,
            "diagnostic": diag,
            "steps": steps,
            "gpu_hardware": model_manager.get_device_info()
        }
    except Exception as e:
        logger.error(f"RunPod Serverless Worker Erreur: {e}", exc_info=True)
        return {"status": "FAILED", "error": str(e)}
    finally:
        # CRITICAL VRAM OPTIMIZATION:
        # Aggressive memory cleanup immediately when job concludes
        logger.info("🧹 [RunPod Handler] Nettoyage agressif de la mémoire (torch.cuda.empty_cache & gc.collect)...")
        model_manager.purge_vram(force_log=True)

def handler_wrapper(job: Dict[str, Any]) -> Dict[str, Any]:
    return asyncio.run(async_runpod_handler(job))

if __name__ == "__main__":
    logger.info("🚀 Démarrage du Worker RunPod Serverless NELFAX AI avec MLOps Dynamic VRAM Switching...")
    runpod.serverless.start({"handler": handler_wrapper})
