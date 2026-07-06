import React from 'react';
import { Home, Sparkles, Plus, Image as ImageIcon, User } from 'lucide-react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onFileUpload
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-lg px-6 py-2.5">
      <div className="max-w-lg mx-auto flex items-center justify-between relative">
        
        {/* Accueil */}
        <button 
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'home' ? 'text-red-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Accueil</span>
        </button>

        {/* IA */}
        <button 
          onClick={() => onSelectTab('studio')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'studio' ? 'text-red-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">IA</span>
        </button>

        {/* Gros bouton "+" central rouge */}
        <label 
          onClick={() => {
            if (!onFileUpload) {
              onSelectTab('studio');
            }
          }}
          className="cursor-pointer -mt-7 bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full shadow-lg shadow-red-500/40 flex items-center justify-center transition hover:scale-105 active:scale-95 border-4 border-slate-50"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
          {onFileUpload ? (
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                onFileUpload(e);
                onSelectTab('studio');
              }} 
              className="hidden" 
            />
          ) : null}
        </label>

        {/* Galerie */}
        <button 
          onClick={() => onSelectTab('gallery')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'gallery' ? 'text-red-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-[10px]">Galerie</span>
        </button>

        {/* Profil */}
        <button 
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'profile' ? 'text-red-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profil</span>
        </button>

      </div>
    </nav>
  );
};
