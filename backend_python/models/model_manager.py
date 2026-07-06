"""
NELFAX AI - MLOps Dynamic Model Manager & VRAM Lifecycle Controller
Optimized for RunPod Serverless GPU instances (NVIDIA RTX 4090 / A100 / H100).

CRITICAL VRAM OPTIMIZATION CONSTRAINT:
Implements strict "Dynamic Model Switching". Only ONE heavy model resides in VRAM at any given time.
Upon switching modes or job completion, aggressive memory cleanup is enforced:
1. del active_model
2. gc.collect()
3. torch.cuda.empty_cache()

Weights are loaded from the high-speed local volume /app/weights/ to achieve sub-2-second model swapping.
"""
import os
import gc
import time
import asyncio
import logging
from typing import Dict, Any, Optional, Tuple

logger = logging.getLogger("nelfax.mlops.vram_manager")

# Fast local storage volume path for model weights
WEIGHTS_DIR = os.getenv("MODEL_WEIGHTS_DIR", "/app/weights")
os.makedirs(WEIGHTS_DIR, exist_ok=True)

class DynamicModelManager:
    def __init__(self):
        self.device = self._detect_device()
        self.use_fp16 = (self.device == "cuda")
        self.vram_lock = asyncio.Lock()
        
        # Track currently loaded model in VRAM
        self.active_model_name: Optional[str] = None
        self.active_pipeline: Optional[Any] = None
        
        # Model mapping to weight paths
        self.weights_registry = {
            "Real-ESRGAN_x4": os.path.join(WEIGHTS_DIR, "RealESRGAN_x4plus.pth"),
            "Real-ESRGAN_x8": os.path.join(WEIGHTS_DIR, "RealESRGAN_x8plus.pth"),
            "GFPGANv1.4": os.path.join(WEIGHTS_DIR, "GFPGANv1.4.pth"),
            "SAM2_Base": os.path.join(WEIGHTS_DIR, "sam2_hiera_large.safetensors"),
            "LaMa_Fourier": os.path.join(WEIGHTS_DIR, "big-lama.safetensors"),
            "SDXL_ControlNet": os.path.join(WEIGHTS_DIR, "sdxl_controlnet_openpose.safetensors")
        }
        
        logger.info(f"🚀 [MLOps VRAM Engine] Initialized on [{self.device.upper()}] | FP16={self.use_fp16} | Volume={WEIGHTS_DIR}")

    def _detect_device(self) -> str:
        try:
            import torch
            if torch.cuda.is_available():
                device_name = torch.cuda.get_device_name(0)
                vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
                logger.info(f"🎮 NVIDIA GPU Hardware Detected: {device_name} ({vram_gb:.2f} GB Total VRAM)")
                return "cuda"
        except ImportError:
            logger.warning("PyTorch not installed or CUDA driver unavailable during hardware scan.")
        return "cpu"

    def get_device_info(self) -> Dict[str, Any]:
        info = {
            "device": self.device,
            "fp16_enabled": self.use_fp16,
            "active_model_in_vram": self.active_model_name or "NONE (VRAM Purged)",
            "vram_total_gb": 0.0,
            "vram_allocated_gb": 0.0,
            "vram_cached_gb": 0.0,
            "weights_volume_dir": WEIGHTS_DIR
        }
        if self.device == "cuda":
            try:
                import torch
                props = torch.cuda.get_device_properties(0)
                info["vram_total_gb"] = round(props.total_memory / (1024**3), 2)
                info["vram_allocated_gb"] = round(torch.cuda.memory_allocated(0) / (1024**3), 2)
                info["vram_cached_gb"] = round(torch.cuda.memory_reserved(0) / (1024**3), 2)
            except Exception:
                pass
        return info

    def purge_vram(self, force_log: bool = True):
        """
        Aggressively unloads active tensors and purges CUDA VRAM cache.
        Mandatory call between jobs and before switching models.
        """
        start_t = time.time()
        old_model = self.active_model_name
        
        if self.active_pipeline is not None:
            if force_log:
                logger.info(f"🧹 [VRAM PURGE] Déchargement du modèle [{old_model}] de la mémoire VRAM...")
            del self.active_pipeline
            self.active_pipeline = None
            self.active_model_name = None

        # 1. Python garbage collector pass
        gc.collect()

        # 2. PyTorch CUDA cache flush
        if self.device == "cuda":
            try:
                import torch
                torch.cuda.empty_cache()
                if hasattr(torch.cuda, "ipc_collect"):
                    torch.cuda.ipc_collect()
            except Exception as e:
                logger.debug(f"CUDA empty_cache exception: {e}")

        dur = round((time.time() - start_t) * 1000, 1)
        if force_log and old_model:
            vram_stats = self.get_device_info()
            logger.info(f"✨ [VRAM PURGE TERMINÉ] Modèle éjecté en {dur}ms | VRAM occupée actuelle: {vram_stats['vram_allocated_gb']} Go")

    def map_mode_to_model_key(self, feature_mode: str) -> str:
        mode = (feature_mode or "").lower().strip()
        if "8k" in mode:
            return "Real-ESRGAN_x8"
        elif mode in ["upscale_4k", "color_correction", "sharpness", "denoise"] or "4k" in mode:
            return "Real-ESRGAN_x4"
        elif mode in ["face_restore", "face_enhance"] or "face" in mode or "restore" in mode:
            return "GFPGANv1.4"
        elif mode in ["portrait_bokeh", "portrait_iphone"] or "bokeh" in mode or "portrait" in mode:
            return "SAM2_Base"
        elif mode in ["remove_object", "object_remove", "object_removal"] or "remove" in mode or "inpaint" in mode or "lama" in mode:
            return "LaMa_Fourier"
        elif mode in ["enhance_landscape", "landscape_beautify", "sky_change", "old_photo_colorize"] or "landscape" in mode or "sky" in mode or "sdxl" in mode:
            return "SDXL_ControlNet"
        return "Real-ESRGAN_x4"

    async def switch_and_load_pipeline(self, target_model_key: str, pipeline_creator_fn) -> Any:
        """
        Thread-safe dynamic model switching with mutex lock.
        If target_model_key is already loaded, returns instantly.
        Otherwise, evicts current model, cleans VRAM, and loads the target model.
        """
        async with self.vram_lock:
            # Fast path: already in VRAM
            if self.active_model_name == target_model_key and self.active_pipeline is not None:
                logger.info(f"⚡ [VRAM CACHE HIT] Modèle [{target_model_key}] déjà résident en VRAM (< 5ms).")
                return self.active_pipeline

            # Slow path: Evict current model if any
            if self.active_model_name is not None:
                logger.info(f"🔄 [DYNAMIC SWITCH] Bascule VRAM : [{self.active_model_name}] ➔ [{target_model_key}]")
                self.purge_vram(force_log=False)

            load_start = time.time()
            logger.info(f"📥 [CHARGEMENT VRAM] Allocation des poids pour [{target_model_key}] depuis {WEIGHTS_DIR}...")
            
            # Instantiating pipeline
            self.active_pipeline = pipeline_creator_fn(device=self.device)
            self.active_model_name = target_model_key
            
            load_dur = round(time.time() - load_start, 2)
            logger.info(f"✅ [CHARGEMENT RÉUSSI] Modèle [{target_model_key}] prêt en VRAM ({load_dur}s).")
            return self.active_pipeline

model_manager = DynamicModelManager()
