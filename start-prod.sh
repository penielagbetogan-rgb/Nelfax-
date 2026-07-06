#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE LANCEMENT PRODUCTION - NELFAX AI (100% GRATUIT & AUTONOME)
# ==============================================================================
set -e

echo "=============================================================================="
echo "🚀 DÉMARRAGE DE NELFAX AI EN PRODUCTION"
echo "=============================================================================="

# 1. Vérification des dossiers requis
mkdir -p outputs weights

# 2. Vérification des variables d'environnement
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "⚠️ Fichier .env non trouvé. Création depuis .env.example..."
    cp .env.example .env
  fi
fi

# 3. Lancement via Docker Compose (si Docker est disponible) ou en mode natif Node/Python
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
  echo "📦 Construction et démarrage du conteneur Docker unifié (NVIDIA CUDA / PyTorch + Node)..."
  if docker compose version &> /dev/null; then
    docker compose up --build -d
  else
    docker-compose up --build -d
  fi
  echo "✅ Conteneur démarré ! Application accessible sur http://localhost:3000"
else
  echo "⚙️ Docker non détecté, démarrage natif sur l'hôte..."
  echo "🔨 Compilation du frontend et du backend..."
  npm run build
  echo "🐍 Démarrage du worker FastAPI GPU en arrière-plan sur le port 8000..."
  python3 backend_python/main.py &
  PID_PYTHON=$!
  echo "🌐 Démarrage du serveur Node.js en mode production sur le port 3000..."
  node dist/server.cjs &
  PID_NODE=$!
  
  trap "echo '🛑 Arrêt des services...'; kill $PID_PYTHON $PID_NODE 2>/dev/null; exit 0" SIGINT SIGTERM
  wait $PID_NODE
fi
