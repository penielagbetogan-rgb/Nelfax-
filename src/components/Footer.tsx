import React from 'react';
import { Sparkles, ShieldCheck, Smartphone, Heart } from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-10 px-4 sm:px-6 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-base text-white tracking-tight">NELFAX AI</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Moteur d’intelligence artificielle photographique de pointe pour Android & iOS. Transformez vos photos en chefs-d’œuvre 4K/8K.
          </p>
          <div className="flex items-center gap-2 pt-1 text-emerald-400 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Moteur Gemini 2.5 Flash / Vision connecté</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-2">
          <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Navigation</h4>
          <ul className="space-y-1.5">
            <li>
              <button onClick={() => onSelectTab('home')} className="hover:text-white transition">Accueil & Démo</button>
            </li>
            <li>
              <button onClick={() => onSelectTab('studio')} className="hover:text-white transition">Studio IA 4K/8K</button>
            </li>
            <li>
              <button onClick={() => onSelectTab('dashboard')} className="hover:text-white transition">Tableau de bord & Quotas</button>
            </li>
            <li>
              <button onClick={() => onSelectTab('gallery')} className="hover:text-white transition">Galerie d’Améliorations</button>
            </li>
          </ul>
        </div>

        {/* AI & MLOps Engine */}
        <div className="space-y-2">
          <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Moteur IA & MLOps</h4>
          <ul className="space-y-1.5">
            <li>
              <span className="text-slate-400">Real-ESRGAN x4plus / x8plus</span>
            </li>
            <li>
              <span className="text-slate-400">GFPGANv1.4 Restauration</span>
            </li>
            <li>
              <span className="text-slate-400">CUDA 12.1 NVIDIA PyTorch</span>
            </li>
            <li>
              <span className="text-slate-400">Express Node.js Port 3000</span>
            </li>
          </ul>
        </div>

        {/* Mobile & App Store Status */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Disponibilité Mobile</h4>
          <div className="flex flex-col gap-2">
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-white font-bold text-xs">App Store (iOS 18)</p>
                <p className="text-[10px] text-slate-400">Compatible iPhone & iPad Pro</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-white font-bold text-xs">Google Play Store</p>
                <p className="text-[10px] text-slate-400">Android 14 / 15 Material You</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
        <p>© 2026 NELFAX AI Corporation. Tous droits réservés.</p>
        <p className="flex items-center gap-1">
          Conçu avec passion et précision par notre architecte senior IA <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
        </p>
      </div>
    </footer>
  );
};
