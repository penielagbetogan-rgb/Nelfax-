import React, { useState } from 'react';
import { Cpu, Server, ShieldCheck, Zap, AlertCircle, CheckCircle2, X, ExternalLink, RefreshCw } from 'lucide-react';
import { RunPodConfig } from '../types';

interface RunPodConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RunPodConfig;
  onSaveConfig: (cfg: RunPodConfig) => void;
}

export const RunPodConfigModal: React.FC<RunPodConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [endpointUrl, setEndpointUrl] = useState(config.endpointUrl);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [enabled, setEnabled] = useState(config.enabled);

  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [hardwareInfo, setHardwareInfo] = useState<any>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setTestMessage("Ping du serveur GPU en cours...");
    setHardwareInfo(null);

    try {
      const response = await fetch('/api/gpu/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpointUrl, apiKey })
      });

      const data = await response.json();
      if (data.success) {
        setTestingStatus('success');
        setTestMessage(`Connecté à : ${data.engine}`);
        setHardwareInfo(data.hardware);
      } else {
        setTestingStatus('error');
        setTestMessage(data.error || "Erreur de connexion au GPU RunPod.");
      }
    } catch (err: any) {
      setTestingStatus('error');
      setTestMessage("Serveur inaccessible : vérifiez le port 8000 ou l'URL RunPod Proxy.");
    }
  };

  const handleSave = () => {
    onSaveConfig({
      endpointUrl: endpointUrl.trim(),
      apiKey: apiKey.trim(),
      enabled
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">Connexion GPU NVIDIA RunPod</h2>
            <p className="text-xs text-slate-400">Exécutez Real-ESRGAN, SAM 2 et SDXL sur GPU dédiés (RTX 4090 / A100)</p>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Server className={`w-5 h-5 ${enabled ? 'text-emerald-400' : 'text-slate-500'}`} />
            <div>
              <p className="text-xs font-bold text-white">Activer le dispatch externe RunPod / FastAPI</p>
              <p className="text-[11px] text-slate-400">
                {enabled
                  ? 'Les images sont envoyées à votre cluster PyTorch dédié sur le port 8000.'
                  : 'Mode Hybride autonome actif (traitement haute-performance sur le serveur de base).'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              enabled ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              URL publique du Pod ou Endpoint RunPod Serverless
            </label>
            <input
              type="text"
              placeholder="https://8000-xxxxx.proxy.runpod.net ou https://api.runpod.ai/v2/xxxxx"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Clé API RunPod (Optionnel si Pod privé / Serverless)
            </label>
            <input
              type="password"
              placeholder="rpa_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Test Connection Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={handleTestConnection}
            disabled={testingStatus === 'testing' || !endpointUrl}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${testingStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>Tester la connexion GPU</span>
          </button>

          {testingStatus !== 'idle' && (
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border ${
              testingStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
              testingStatus === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
              'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
            }`}>
              {testingStatus === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> :
               testingStatus === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : null}
              <span className="truncate">{testMessage}</span>
            </div>
          )}
        </div>

        {/* Hardware diagnostic display */}
        {hardwareInfo && (
          <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-300 font-bold">
              <span>🎮 Spécification Matérielle GPU Détectée</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 uppercase text-[10px]">{hardwareInfo.device}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px] font-mono pt-1">
              <div>VRAM Total : <strong>{hardwareInfo.vram_total_gb || 24} GB</strong></div>
              <div>FP16 Half-Precision : <strong>{hardwareInfo.fp16_enabled ? 'Oui (Actif)' : 'Non'}</strong></div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60 text-slate-400 text-[11px] space-y-1.5 leading-relaxed">
          <p className="font-bold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Guide Rapide Déploiement :</span>
          </p>
          <p>1. Le code complet du serveur PyTorch se trouve dans le dossier <code>/backend_python/</code>.</p>
          <p>2. Lancez <code>python3 main.py</code> sur votre GPU NVIDIA et exposez le port 8000.</p>
          <p>3. Collez l'URL ci-dessus pour transférer le calcul lourd (Real-ESRGAN x8, SAM 2, SDXL) en temps réel.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-400 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enregistrer la Configuration GPU</span>
          </button>
        </div>

      </div>
    </div>
  );
};
