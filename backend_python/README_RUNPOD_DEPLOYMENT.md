# 🚀 Déploiement NELFAX AI sur RunPod Serverless GPU

Ce dossier contient le backend Python/FastAPI complet de **NELFAX AI**, optimisé pour l'accélération matérielle NVIDIA GPU (CUDA 12.1 + PyTorch FP16).

## Modèles d'IA intégrés
1. **Real-ESRGAN (`RealESRGAN_x4plus`, `RealESRGAN_x8plus`)** : Super-résolution 4K & 8K sans perte.
2. **GFPGAN (`v1.4 Clean`)** : Restauration et reconstruction des détails du visage, des yeux et de la peau.
3. **Segment Anything 2 (SAM 2)** : Détourage sémantique de précision et flou optique f/1.4 Bokeh.
4. **LaMa (Large Mask Inpainting)** : Suppression d'objets indésirables par convolutions de Fourier.
5. **Stable Diffusion XL + ControlNet Depth/Canny** : Remplacement de ciel et sublimation de paysages.

---

## 🛠️ Option 1 : Déploiement en Serveur Dédié / Pod RunPod (FastAPI REST)
1. Créez un **Pod RunPod** (ex: NVIDIA RTX 4090 24GB ou A5000).
2. Connectez-vous en SSH ou Terminal Jupyter.
3. Clonez le dépôt et démarrez le serveur FastAPI :
   ```bash
   cd backend_python
   pip install -r requirements.txt
   python3 main.py
   ```
4. Exposez le port `8000`. Dans l'interface Web NELFAX AI, collez votre URL publique RunPod (ex: `https://8000-xxx.proxy.runpod.net`) dans le panneau de configuration GPU !

---

## ⚡ Option 2 : Déploiement RunPod Serverless
1. Enregistrez le conteneur Docker avec `Dockerfile.runpod` sur Docker Hub ou votre registre d'images :
   ```bash
   docker build -t moncompte/nelfax-ai-runpod:v2.5 -f Dockerfile.runpod .
   docker push moncompte/nelfax-ai-runpod:v2.5
   ```
2. Sur RunPod Serverless, créez un nouveau Template avec l'image `moncompte/nelfax-ai-runpod:v2.5`.
3. Récupérez votre **Endpoint ID** et votre **API Key RunPod**.
4. Configurez-les dans l'interface NELFAX AI pour exécuter les jobs en asynchrone avec suivi en temps réel !
