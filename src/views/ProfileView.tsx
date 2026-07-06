import React from 'react';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Cloud, 
  Settings, 
  Key, 
  Download, 
  LogOut, 
  Crown, 
  CheckCircle2,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { UserProfile, NavigationTab } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onNavigate
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
      
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-red-600 shadow-md"
          />
          {user.isPremium && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md" title="Statut VIP PRO">
              <Crown className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="text-center sm:text-left space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="font-extrabold text-2xl text-slate-900">{user.name}</h1>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full self-center sm:self-auto ${
              user.isPremium
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {user.isPremium ? '⭐ Membre VIP PRO' : 'Forfait Gratuit Quotidien'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">{user.email}</p>
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-600 justify-center sm:justify-start">
            <span>📸 <strong>{user.totalPhotosProcessed}</strong> photos améliorées</span>
            <span>⚡ <strong>{user.isPremium ? '∞' : `${user.creditsRemainingToday}/${user.maxDailyFreeCredits}`}</strong> crédits du jour</span>
          </div>
        </div>

        <div>
          {!user.isPremium ? (
            <button
              onClick={() => onNavigate('premium')}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition"
            >
              Passer VIP PRO
            </button>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Abonnement Actif</span>
            </div>
          )}
        </div>
      </div>

      {/* Preferences & Settings */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-600" />
          <span>Réglages & Préférences d’Amélioration</span>
        </h3>

        <div className="space-y-4 divide-y divide-slate-100">
          
          {/* Format d'exportation */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900">Format d’exportation préféré</p>
              <p className="text-[11px] text-slate-500">Choisissez le format d'enregistrement de vos images 4K / 8K</p>
            </div>
            <div className="flex gap-2">
              {(['PNG', 'JPEG XL', 'HEIC', 'RAW'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => onUpdateUser({ exportFormat: fmt })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    user.exportFormat === fmt
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Synchronisation Cloud */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-red-600" />
                <span>Synchronisation Cloud (Firebase / Cloud Run)</span>
              </p>
              <p className="text-[11px] text-slate-500">Sauvegardez vos projets dans votre galerie cloud multi-appareils</p>
            </div>
            <button
              onClick={() => onUpdateUser({ cloudSyncEnabled: !user.cloudSyncEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                user.cloudSyncEnabled ? 'bg-red-600 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow" />
            </button>
          </div>

          {/* Filigrane Toggle */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900">Filigrane NELFAX AI sur les exports</p>
              <p className="text-[11px] text-slate-500">
                {user.isPremium ? 'Désactivé par défaut (Avantage VIP)' : 'Les utilisateurs gratuits ont un subtil badge'}
              </p>
            </div>
            <button
              onClick={() => {
                if (!user.isPremium) {
                  alert("⚠️ Seuls les abonnés Premium peuvent désactiver le filigrane 100%.");
                  onNavigate('premium');
                } else {
                  onUpdateUser({ watermarkEnabled: !user.watermarkEnabled });
                }
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                !user.watermarkEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow" />
            </button>
          </div>

        </div>
      </div>

      {/* API Key Status / Diagnostic */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Statut Moteur Gemini 2.5 API</h4>
              <p className="text-xs text-slate-500">Connecté au serveur Express Node.js sur le port 3000</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-bold">
            ● ONLINE & PRÊT
          </span>
        </div>
      </div>

      {/* Logout button */}
      <div className="flex justify-end">
        <button
          onClick={onLogout}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold border border-slate-200 hover:border-rose-300 transition flex items-center gap-2 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Se déconnecter</span>
        </button>
      </div>

    </div>
  );
};
