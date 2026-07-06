import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Crown
} from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { SAMPLE_PROJECTS } from '../data/mockPhotos';
import { NavigationTab, EnhancementMode } from '../types';

interface HomeViewProps {
  onNavigate: (tab: NavigationTab, initialMode?: EnhancementMode) => void;
  onOpenAuth: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenAuth }) => {
  const heroSample = SAMPLE_PROJECTS[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 px-4 sm:px-6 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto text-center space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>Disponible sur Android 15 & Apple iOS 18</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 font-mono">IA Gemini 2.5 Vision</span>
          </div>

          {/* Main Title */}
          <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Sublimez vos photos avec l’Intelligence Artificielle <span className="text-red-600">NELFAX AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Amélioration 4K/8K, Portrait style iPhone f/1.4, réduction du bruit ISO et colorisation d’archives historiques en un seul geste.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('studio')}
              className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-red-500/30 flex items-center gap-2.5 transition transform hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
              <span>Ouvrir le Studio IA (100% Gratuit)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <span>100% Gratuit & Illimité sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <span>Export HD 4K/8K instantané</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <span>Qualité professionnelle studio</span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE BEFORE/AFTER DEMO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-mono">Démonstration interactive en direct</span>
          <h2 className="font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
            Comparez la précision du moteur GAN NELFAX AI
          </h2>
        </div>

        <BeforeAfterSlider
          originalUrl={heroSample.originalUrl}
          enhancedUrl={heroSample.enhancedUrl}
          title="Portrait Studio Haute Définition"
          modeLabel="Mode : Portrait style iPhone 85mm"
          onDownload={() => onNavigate('studio', 'portrait_iphone')}
        />
      </section>

      {/* FREE vs PREMIUM SPLIT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* FREE BOX */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-50 text-red-600 text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl border-l border-b border-red-100">
              Inclus Chaque Jour
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Fonctionnalités Gratuites</h3>
                <p className="text-xs text-slate-500">5 crédits offerts à minuit, tous les jours pour tous</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span><strong className="text-slate-900">Amélioration jusqu'en 4K</strong> (Upscaling haute clarté)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span><strong className="text-slate-900">Correction automatique des couleurs</strong> & balance des blancs</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span><strong className="text-slate-900">Netteté améliorée</strong> & défloutage optique</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span><strong className="text-slate-900">Réduction du bruit (Denoise)</strong> en faible éclairage</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span><strong className="text-slate-900">Recadrage automatique</strong> & Téléchargement HD</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('studio', 'upscale_4k')}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Lancer avec vos 5 photos gratuites
            </button>
          </div>

          {/* PREMIUM BOX */}
          <div className="bg-white border-2 border-red-500/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow">
              PRO VIP UNLOCK
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Fonctionnalités Premium</h3>
                <p className="text-xs text-slate-500">Pour photographes, influenceurs et créateurs d'exception</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700 font-medium grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              <li className="flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Portrait pro style iPhone</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Agrandissement Studio 8K</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Suppression des objets</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Changement auto du ciel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Colorisation photos anciennes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Traitement par lots (Batch)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Export 100% sans filigrane</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Traitement prioritaire cloud</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('premium')}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Découvrir les offres Premium
            </button>
          </div>

        </div>
      </section>

      {/* SHOWCASE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-2xl text-slate-900">Galerie d’exemples récents</h3>
            <p className="text-xs text-slate-500">Résultats obtenus avec les modèles IA NELFAX</p>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>Voir toute la galerie</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_PROJECTS.slice(1, 4).map((proj) => (
            <div
              key={proj.id}
              onClick={() => onNavigate('studio', proj.appliedMode)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer group hover:border-red-500 transition duration-300 shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={proj.enhancedUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm">
                  {proj.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-red-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow">
                  {proj.resolution}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{proj.appliedModeLabel}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-red-600 font-bold">
                  <span>Essayer ce mode</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
