# NELFAX AI — Moteur Full-Stack & Microservice GPU MLOps

**NELFAX AI** est une plateforme web professionnelle d'amélioration et de restauration de photos par intelligence artificielle. L'application est **100% gratuite**, sans système d'abonnement ni restriction, et combine une interface moderne ultra-rapide avec un pipeline de modèles de Deep Learning sur GPU NVIDIA CUDA.

---

## 🏗️ Structure du Projet Dossier par Dossier

```text
nelfax-ai/
├── backend_python/            # Microservice GPU MLOps (FastAPI Python 3.10 + PyTorch)
│   ├── models/                # Gestionnaire VRAM (basculement dynamique de modèles)
│   ├── pipelines/             # Pipelines IA : Real-ESRGAN, GFPGAN, SAM 2, LaMa, SDXL
│   └── main.py                # Endpoint unique stable POST /process-image
├── src/                       # Frontend SPA React 19 + TypeScript + Vite + Motion
│   ├── components/            # Composants UI (Header, Footer, Sliders avant/après)
│   ├── views/                 # Vues principales (StudioView, DashboardView, GalleryView)
│   ├── data/                  # Données statiques & descriptions d'outils
│   └── types.ts               # Définitions de types partagées
├── server.ts                  # Backend Proxy API Express Node.js (Port 3000)
├── Dockerfile                 # Conteneur unifié de production (NVIDIA CUDA + Node 20)
├── docker-compose.yml         # Déploiement Docker en 1 commande
├── start-prod.sh              # Script de lancement universel (Docker ou Natif)
├── package.json               # Dépendances Node & scripts de build
└── requirements.txt           # Dépendances Python PyTorch & MLOps
```

---

## ⚡ Caractéristiques Architecturales MLOps

1. **API Unique Stable (`POST /api/process-image`)** :
   - Reçoit l'image (`imageBase64`), le mode (`mode`) et le `prompt`.
   - Compression & redimensionnement automatique côté client pour limiter le poids à **< 10 Mo**.
   - Timeout strict de **60 secondes** et gestion de retry automatique (1 tentative en cas de micro-coupure réseau).

2. **Gestion Optimisée de la VRAM GPU** :
   - Basculement dynamique : un seul modèle lourd est chargé en mémoire VRAM à l'instant *t*.
   - Purge agressive après chaque requête : appel systématique de `torch.cuda.empty_cache()` et `gc.collect()`.
   - File d'attente asynchrone (`Semaphore(1)`) empêchant tout dépassement de mémoire (OOM).

---

## 🚀 Guide & Scripts de Lancement

### Option A : Déploiement Docker en 1 Commande (Recommandé en Production)

Assurez-vous d'avoir Docker et le [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html) installés sur votre serveur hôte / RunPod.

```bash
# Lancement automatique en arrière-plan
docker compose up --build -d

# Vérification des logs
docker compose logs -f nelfax-ai-prod
```
L'application est immédiatement opérationnelle sur **http://localhost:3000**.

### Option B : Script Universel Shell (`start-prod.sh`)

```bash
chmod +x start-prod.sh
./start-prod.sh
```

---

## ✅ Checklist de Déploiement en Production

- [x] **Code nettoyé** : Zéro code mort, zéro import inutilisé, compilation TypeScript 100% propre (`tsc --noEmit`).
- [x] **100% Gratuit & Autonome** : Paywalls et limites de crédits quotidiens supprimés, accès illimité (∞) activé par défaut.
- [x] **Synchronisation des API** : Route unique `/api/process-image` synchronisée entre React, Express et FastAPI.
- [x] **Stabilité UI** : Gestion d'erreur visuelle élégante (serveur offline, timeout 60s, échec modèle) sans aucun crash écran.
- [x] **Variables d'environnement** : Fichier `.env.example` documenté avec `RUNPOD_URL`, `RUNPOD_API_KEY` et `GEMINI_API_KEY`.
- [x] **Compression & Upload** : Contrôle strict de taille d'upload ≤ 10 Mo et encodage JPEG optimisé sur canvas HTML5.
