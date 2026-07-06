import React from 'react';
import { 
  Sparkles, 
  User as UserIcon, 
  Image as ImageIcon, 
  LayoutDashboard, 
  Smartphone,
  Cpu,
  Home,
  Download
} from 'lucide-react';
import { NavigationTab, UserProfile, DeviceFrameMode } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  deviceMode: DeviceFrameMode;
  onToggleDeviceMode: () => void;
  onOpenRunPodConfig?: () => void;
}



export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  user,
  onOpenAuth,
  deviceMode,
  onToggleDeviceMode,
  onOpenRunPodConfig
}) => {
  return (
    <header className="sticky top-0 z-40 bg-red-600 text-white shadow-md px-4 py-3 sm:px-6 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-red-600 shadow-sm group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5 fill-red-600 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl sm:text-2xl tracking-tight leading-none text-white">
                NELFAX AI
              </span>
              <span className="text-[10px] bg-red-700 text-red-100 font-mono px-1.5 py-0.5 rounded border border-red-500 hidden xs:inline-block">
                v2.5
              </span>
            </div>
            <p className="text-[11px] text-red-100 font-medium tracking-wide mt-0.5 hidden sm:block">
              Améliorez. Restaurez. Sublimez.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-red-700/60 p-1 rounded-full border border-red-500/40 shadow-inner">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-red-100 hover:text-white hover:bg-red-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Accueil</span>
          </button>
          <button
            onClick={() => onSelectTab('studio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'studio'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-red-100 hover:text-white hover:bg-red-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio IA</span>
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'dashboard'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-red-100 hover:text-white hover:bg-red-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Bord</span>
          </button>
          <button
            onClick={() => onSelectTab('gallery')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'gallery'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-red-100 hover:text-white hover:bg-red-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galerie</span>
          </button>
        </nav>

        {/* Quotas & User Auth & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Download ZIP button */}
          <a
            href="/NELFAX_AI_FULL_PROJECT.zip"
            download="NELFAX_AI_FULL_PROJECT.zip"
            title="Télécharger l'archive ZIP complète du projet prêt pour la production"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm border border-emerald-400"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Télécharger ZIP</span>
          </a>

          {/* Daily Quota Counter */}
          <div className="hidden sm:flex items-center gap-2 bg-red-700/80 border border-red-500/50 px-3 py-1.5 rounded-full text-xs text-white">
            <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="font-bold">IA 100% GRATUITE & ILLIMITÉE</span>
          </div>

          {/* RunPod GPU Config Trigger */}
          {onOpenRunPodConfig && (
            <button
              onClick={onOpenRunPodConfig}
              title="Paramètres GPU RunPod & FastAPI Python"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-700 hover:bg-red-800 text-xs font-bold text-white transition border border-red-500"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-300" />
              <span>GPU</span>
            </button>
          )}

          {/* Device toggle shortcut */}
          <button
            onClick={onToggleDeviceMode}
            title="Simuler un mobile iOS / Android"
            className={`p-1.5 rounded-full border transition ${
              deviceMode !== 'fullscreen'
                ? 'bg-white text-red-600 border-white'
                : 'bg-red-700 border-red-500 text-red-100 hover:text-white hover:bg-red-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* User Profile / Auth Button */}
          {user.isLoggedIn ? (
            <button
              onClick={() => onSelectTab('profile')}
              className="w-9 h-9 rounded-full bg-red-700 border-2 border-white/80 flex items-center justify-center text-white font-bold text-sm shadow overflow-hidden cursor-pointer hover:opacity-90 transition"
              title={user.name}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition border border-red-500"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
