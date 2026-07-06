import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Crown, 
  RefreshCw, 
  FileImage, 
  Sliders, 
  AlertTriangle,
  Server,
  Image as ImageIcon,
  Wand2,
  Home,
  User,
  Plus,
  ArrowRight,
  Eraser,
  Palette,
  Camera,
  LayoutGrid
} from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { ALL_FEATURES } from '../data/features';
import { PRESET_STUDIO_SAMPLES } from '../data/mockPhotos';
import { EnhancementMode, UserProfile, RunPodConfig } from '../types';

interface StudioViewProps {
  initialMode?: EnhancementMode;
  user: UserProfile;
  onUseCredit: () => boolean;
  onOpenPremium: () => void;
  onSaveToGallery: (project: any) => void;
  runpodConfig?: RunPodConfig;
  onOpenRunPodConfig?: () => void;
  globalCustomUrl?: string | null;
}

export const StudioView: React.FC<StudioViewProps> = ({
  initialMode = 'upscale_4k',
  user,
  onUseCredit,
  onOpenPremium,
  onSaveToGallery,
  runpodConfig,
  onOpenRunPodConfig,
  globalCustomUrl
}) => {
  const [selectedFeatureId, setSelectedFeatureId] = useState<EnhancementMode>(initialMode);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [customOriginalUrl, setCustomOriginalUrl] = useState<string | null>(globalCustomUrl || null);
  const [processedResultUrl, setProcessedResultUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (globalCustomUrl) {
      setCustomOriginalUrl(globalCustomUrl);
      setProcessedResultUrl(null);
    }
  }, [globalCustomUrl]);

  // Job & Progress state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState<number>(0);
  const [jobStepLabel, setJobStepLabel] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedFeature = ALL_FEATURES.find(f => f.id === selectedFeatureId) || ALL_FEATURES[0];
  const currentSample = PRESET_STUDIO_SAMPLES[activePhotoIndex] || PRESET_STUDIO_SAMPLES[0];
  const currentOriginalUrl = customOriginalUrl || currentSample.originalUrl;
  const currentEnhancedUrl = processedResultUrl || (customOriginalUrl ? customOriginalUrl : currentSample.enhancedUrl);
  const hasProcessedResult = Boolean(processedResultUrl || (!customOriginalUrl && currentSample.enhancedUrl));

  // Helper to convert and optimize any URL / Blob to Base64 DataURL
  const convertAndCompressToBase64 = async (url: string, maxDim = 2048, quality = 0.88): Promise<string> => {
    let rawB64 = url;
    if (!url.startsWith('data:image')) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        rawB64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn("Impossible de fetch l'URL, tentative d'utilisation directe :", err);
        return url;
      }
    }

    // Compression & optimisation sur canvas HTML5 pour des performances optimales et réduction de la bande passante
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(rawB64);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(rawB64);
      img.src = rawB64;
    });
  };

  // Trigger Real AI Enhancement Job via single stable API (/api/process-image)
  const handleApplyEnhancement = async () => {
    if (!onUseCredit()) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setJobProgress(10);
    setJobStepLabel('Compression et optimisation de l’image...');

    // Animation progressive de progression réaliste
    let currentProgress = 10;
    const progressSteps = [
      { pct: 25, label: 'Envoi sécurisé au serveur Node / API...' },
      { pct: 45, label: 'Allocation VRAM et exécution tensorielle CUDA...' },
      { pct: 70, label: 'Affinement sub-pixel et reconstruction IA...' },
      { pct: 88, label: 'Finalisation et encodage haute définition...' }
    ];
    let stepIndex = 0;
    const progressTimer = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setJobProgress(progressSteps[stepIndex].pct);
        setJobStepLabel(progressSteps[stepIndex].label);
        stepIndex++;
      }
    }, 1800);

    try {
      const b64 = await convertAndCompressToBase64(currentOriginalUrl);

      // Fonction d'appel avec retry automatique 1 fois (exigence de stabilité production)
      const executeRequestWithRetry = async (attempt: number): Promise<any> => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // Timeout strict 60s
        try {
          const res = await fetch('/api/process-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: selectedFeatureId,
              imageBase64: b64,
              prompt: "high quality detailed 8k cinematic masterpiece",
              runpodConfig
            }),
            signal: controller.signal
          });
          clearTimeout(timeout);
          return await res.json();
        } catch (err: any) {
          clearTimeout(timeout);
          if (attempt === 1) {
            setJobStepLabel('Tentative de reconnexion automatique au serveur (2/2)...');
            await new Promise(r => setTimeout(r, 1500));
            return executeRequestWithRetry(2);
          }
          if (err.name === 'AbortError') {
            throw new Error("Délai d'attente dépassé (Timeout 60s). Le serveur ou le GPU est en cours d'initialisation.");
          }
          throw new Error("Serveur indisponible ou erreur réseau. Vérifiez que le backend Node/Python est en cours d'exécution.");
        }
      };

      const data = await executeRequestWithRetry(1);
      clearInterval(progressTimer);

      if (!data || !data.success) {
        throw new Error(data?.error || "Échec lors du traitement MLOps IA.");
      }

      const finalResultUrl = data.result_url || data.result_image || data.resultUrl;
      if (finalResultUrl) {
        setProcessedResultUrl(finalResultUrl);
      }
      setJobProgress(100);
      setJobStepLabel('✨ Traitement IA terminé avec succès !');
      setIsProcessing(false);

      if (finalResultUrl) {
        const jobId = `nelfax-${Date.now()}`;
        setCurrentJobId(jobId);
        onSaveToGallery({
          id: jobId,
          originalUrl: currentOriginalUrl,
          enhancedUrl: finalResultUrl,
          title: customOriginalUrl ? 'Photo Utilisateur' : currentSample.title,
          mode: selectedFeatureId,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsProcessing(false);
      setJobProgress(0);
      setErrorMessage(err.message || 'Erreur inconnue lors du traitement.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limite stricte de taille : 10 MB
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Fichier trop volumineux (limite max : 10 Mo). Veuillez choisir ou compresser une image plus légère.");
        return;
      }
      const url = URL.createObjectURL(file);
      setCustomOriginalUrl(url);
      setProcessedResultUrl(null);
      setErrorMessage(null);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentEnhancedUrl;
    link.download = `NELFAX-AI-${selectedFeatureId}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* 2. SECTION BIENVENUE & FOND LUDIQUE */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 py-6 sm:py-8 px-4">
        {/* Formes géométriques colorées abstraites en arrière-plan */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute -top-4 left-6 w-20 h-20 bg-yellow-400 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-8 right-10 w-24 h-24 bg-purple-500 rounded-3xl rotate-12 blur-xl" />
          <div className="absolute bottom-2 left-1/3 w-16 h-16 bg-blue-500 rounded-full blur-lg" />
          <div className="absolute -bottom-6 right-1/4 w-28 h-28 bg-pink-500 rounded-full blur-2xl" />
          <div className="absolute top-2 left-2/3 w-12 h-12 bg-green-400 rotate-45 blur-md" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Bonjour ! Prêt à transformer vos photos ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Outil actif : <span className="font-semibold text-red-600">{selectedFeature.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenRunPodConfig && (
              <button
                onClick={onOpenRunPodConfig}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Server className="w-3.5 h-3.5 text-indigo-600" />
                <span>GPU</span>
                <span className={`w-2 h-2 rounded-full ${runpodConfig?.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </button>
            )}

            <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition shrink-0">
              <Upload className="w-4 h-4 text-red-400" />
              <span>Importer une image</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </section>

      {/* ERROR BANNER IF ANY */}
      {errorMessage && (
        <div className="max-w-5xl mx-auto w-full px-4 mt-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-800 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs font-semibold">{errorMessage}</p>
            </div>
            <button
              onClick={handleApplyEnhancement}
              disabled={isProcessing}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-rose-700 transition shadow-sm shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réessayer</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-5xl mx-auto w-full px-4 mt-6 space-y-8">
        
        {/* 3. LA CARTE CENTRALE (SLIDER AVANT/APRÈS) */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-4 sm:p-6 relative overflow-hidden">
          
          {/* En-tête de la carte */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                Améliorer la qualité
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Rendre vos photos plus nettes en un clic
              </p>
            </div>

            {hasProcessedResult && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-red-400" />
                <span>Télécharger</span>
              </button>
            )}
          </div>

          {/* Slider et zone visuelle */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[340px] sm:min-h-[440px] flex items-center justify-center border border-slate-800">
            
            {/* SPINNER DE CHARGEMENT RÉEL */}
            {isProcessing && (
              <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-red-500 animate-spin" />
                <div>
                  <p className="font-bold text-lg text-white">Traitement IA en cours...</p>
                  <p className="text-xs font-mono text-red-300 mt-1.5">{jobStepLabel} ({jobProgress}%)</p>
                </div>
                <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-300" 
                    style={{ width: `${jobProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Slider Avant/Après */}
            {hasProcessedResult ? (
              <div className="relative w-full h-full min-h-[340px] sm:min-h-[440px]">
                <BeforeAfterSlider
                  originalUrl={currentOriginalUrl}
                  enhancedUrl={currentEnhancedUrl}
                  title={customOriginalUrl ? 'Votre Photo' : currentSample.title}
                  modeLabel={selectedFeature.name}
                  className="w-full h-full min-h-[340px] sm:min-h-[440px]"
                />
                <div className="absolute top-4 left-4 pointer-events-none z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10">
                  Avant
                </div>
                <div className="absolute top-4 right-4 pointer-events-none z-10 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-red-400/30">
                  Après
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 space-y-4 bg-slate-900">
                <img
                  src={currentOriginalUrl}
                  alt="Aperçu source"
                  className="max-h-[400px] w-auto object-contain rounded-xl shadow-lg"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10">
                  Avant (Original)
                </div>
              </div>
            )}

            {/* Bouton d'action circulaire blanc avec flèche rouge en bas à droite */}
            <button
              onClick={handleApplyEnhancement}
              disabled={isProcessing}
              title="Lancer l'amélioration IA"
              className="absolute bottom-4 right-4 z-20 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition group border border-slate-100 disabled:opacity-50"
            >
              <ArrowRight className="w-6 h-6 text-red-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Exemples rapides */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between overflow-x-auto gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Photos tests :</span>
            <div className="flex items-center gap-2">
              {PRESET_STUDIO_SAMPLES.slice(0, 4).map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePhotoIndex(idx);
                    setCustomOriginalUrl(null);
                    setProcessedResultUrl(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 border ${
                    activePhotoIndex === idx && !customOriginalUrl
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. LA GRILLE DES 3 SERVICES PRINCIPAUX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Carte 1 : Photo IA */}
          <div 
            onClick={() => setSelectedFeatureId('upscale_8k')}
            className={`p-5 rounded-3xl bg-rose-50 hover:bg-rose-100/90 border border-rose-200/60 transition cursor-pointer flex items-center gap-4 shadow-sm ${
              selectedFeatureId === 'upscale_8k' ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md text-red-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900">Photo IA</h4>
              <p className="text-xs text-slate-500 mt-0.5">Créez des images incroyables</p>
            </div>
          </div>

          {/* Carte 2 : Collages */}
          <div 
            onClick={() => setSelectedFeatureId('portrait_iphone')}
            className={`p-5 rounded-3xl bg-purple-50 hover:bg-purple-100/90 border border-purple-200/60 transition cursor-pointer flex items-center gap-4 shadow-sm ${
              selectedFeatureId === 'portrait_iphone' ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md text-purple-600 shrink-0">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900">Collages</h4>
              <p className="text-xs text-slate-500 mt-0.5">Créez de magnifiques collages</p>
            </div>
          </div>

          {/* Carte 3 : Filtres */}
          <div 
            onClick={() => setSelectedFeatureId('landscape_beautify')}
            className={`p-5 rounded-3xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200/60 transition cursor-pointer flex items-center gap-4 shadow-sm ${
              selectedFeatureId === 'landscape_beautify' ? 'ring-2 ring-amber-500' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md text-amber-600 shrink-0">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900">Filtres</h4>
              <p className="text-xs text-slate-500 mt-0.5">Appliquez des filtres étonnants</p>
            </div>
          </div>

        </div>

        {/* 5. SECTION "OUTILS POPULAIRES" */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900">Outils populaires</h3>
            <button 
              onClick={onOpenPremium}
              className="text-xs font-bold text-red-600 hover:text-red-700 transition"
            >
              Voir tout
            </button>
          </div>

          <div className="flex items-center gap-5 overflow-x-auto pb-4 pt-2 px-1">
            
            {/* Restauration */}
            <button 
              onClick={() => setSelectedFeatureId('upscale_4k')}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className={`relative w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center group-hover:border-red-500 group-hover:shadow transition ${
                selectedFeatureId === 'upscale_4k' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'
              }`}>
                <Sparkles className="w-6 h-6 text-red-600" />
                <span className="absolute -top-1.5 -right-1 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow">
                  NEW
                </span>
              </div>
              <span className={`text-xs font-semibold transition ${selectedFeatureId === 'upscale_4k' ? 'text-red-600 font-bold' : 'text-slate-700 group-hover:text-red-600'}`}>
                Restauration
              </span>
            </button>

            {/* Coloriser */}
            <button 
              onClick={() => setSelectedFeatureId('colorization')}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className={`w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center group-hover:border-red-500 group-hover:shadow transition ${
                selectedFeatureId === 'colorization' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'
              }`}>
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`text-xs font-semibold transition ${selectedFeatureId === 'colorization' ? 'text-red-600 font-bold' : 'text-slate-700 group-hover:text-red-600'}`}>
                Coloriser
              </span>
            </button>

            {/* Portrait */}
            <button 
              onClick={() => setSelectedFeatureId('portrait_iphone')}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className={`w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center group-hover:border-red-500 group-hover:shadow transition ${
                selectedFeatureId === 'portrait_iphone' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'
              }`}>
                <Camera className="w-6 h-6 text-indigo-600" />
              </div>
              <span className={`text-xs font-semibold transition ${selectedFeatureId === 'portrait_iphone' ? 'text-red-600 font-bold' : 'text-slate-700 group-hover:text-red-600'}`}>
                Portrait
              </span>
            </button>

            {/* Supprimer */}
            <button 
              onClick={() => setSelectedFeatureId('object_remove')}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className={`w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center group-hover:border-red-500 group-hover:shadow transition ${
                selectedFeatureId === 'object_remove' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'
              }`}>
                <Eraser className="w-6 h-6 text-rose-600" />
              </div>
              <span className={`text-xs font-semibold transition ${selectedFeatureId === 'object_remove' ? 'text-red-600 font-bold' : 'text-slate-700 group-hover:text-red-600'}`}>
                Supprimer
              </span>
            </button>

            {/* Retoucher */}
            <button 
              onClick={() => setSelectedFeatureId('face_enhance')}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className={`w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center group-hover:border-red-500 group-hover:shadow transition ${
                selectedFeatureId === 'face_enhance' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'
              }`}>
                <Wand2 className="w-6 h-6 text-amber-600" />
              </div>
              <span className={`text-xs font-semibold transition ${selectedFeatureId === 'face_enhance' ? 'text-red-600 font-bold' : 'text-slate-700 group-hover:text-red-600'}`}>
                Retoucher
              </span>
            </button>

          </div>
        </section>

      </main>
    </div>
  );
};
