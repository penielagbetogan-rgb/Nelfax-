import React from 'react';
import { 
  Zap, 
  Crown, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';
import { ALL_FEATURES } from '../data/features';
import { UserProfile, NavigationTab, FeatureDefinition } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  onSelectFeature: (feature: FeatureDefinition) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onSelectFeature,
  onNavigate
}) => {
  const freePercentage = user.isPremium ? 100 : Math.round((user.creditsRemainingToday / user.maxDailyFreeCredits) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-20">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tableau de bord NELFAX AI</span>
          </div>
          <h1 className="font-extrabold text-2xl sm:text-4xl text-slate-900">
            Ravi de vous revoir, {user.name.split(' ')[0]} !
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
            Prêt à transformer vos clichés en chefs-d’œuvre 4K ou 8K ? Explorez vos quotas quotidiens et lancez un traitement en un clic.
          </p>
        </div>

        {/* Quota Ring Card */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-5 shrink-0 shadow-sm min-w-[260px]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" className="text-slate-200 fill-none" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={163.36}
                strokeDashoffset={163.36 - (163.36 * freePercentage) / 100}
                className={`fill-none transition-all duration-700 ${user.isPremium ? 'text-amber-500' : 'text-red-600'}`}
              />
            </svg>
            <span className="absolute font-mono font-bold text-sm text-slate-900">
              ∞
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900">
              Forfait 100% Gratuit & Illimité
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Accès débloqué 24/7 sur GPU
            </p>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium">Photos Traitées</p>
            <p className="font-bold text-2xl text-slate-900 mt-1">{user.totalPhotosProcessed}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium">Vitesse IA Moyenne</p>
            <p className="font-bold text-2xl text-red-600 mt-1">0.8s / 4K</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium">Niveau de Qualité</p>
            <p className="font-bold text-2xl text-slate-900 mt-1">Ultra 8K RAW</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* All Features Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-600" />
              <span>Outils IA NELFAX (100% Gratuits)</span>
            </h2>
            <p className="text-xs text-slate-500">Tous les modèles de super-résolution, portrait et inpainting accessibles sans limite</p>
          </div>
          <button onClick={() => onNavigate('studio')} className="text-xs font-bold text-red-600 hover:underline">
            Tout ouvrir dans le Studio →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ALL_FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onSelect={onSelectFeature}
              isUserPremium={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
