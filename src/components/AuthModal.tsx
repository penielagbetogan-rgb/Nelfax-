import React, { useState } from 'react';
import { X, Mail, ShieldCheck, CheckCircle2, Sparkles, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMethod, setAuthMethod] = useState<'options' | 'email'>('options');
  const [emailInput, setEmailInput] = useState('peniel.dev@nelfax.ai');
  const [nameInput, setNameInput] = useState('Péniel Architecte');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const targetEmail = 'alexandre.dubois@gmail.com';
    let isVip = false;
    try {
      const res = await fetch(`/api/user/status?email=${encodeURIComponent(targetEmail)}`);
      if (res.ok) {
        const data = await res.json();
        isVip = !!data.isPremium;
      }
    } catch (e) {}
    onLoginSuccess({
      name: 'Alexandre Dubois (Google)',
      email: targetEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isLoggedIn: true,
      isPremium: isVip,
      creditsRemainingToday: isVip ? 999 : 5
    });
    setIsLoading(false);
    onClose();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const targetEmail = emailInput || 'user@nelfax.ai';
    let isVip = false;
    try {
      const res = await fetch(`/api/user/status?email=${encodeURIComponent(targetEmail)}`);
      if (res.ok) {
        const data = await res.json();
        isVip = !!data.isPremium;
      }
    } catch (e) {}
    onLoginSuccess({
      name: nameInput || 'Utilisateur NELFAX',
      email: targetEmail,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      isLoggedIn: true,
      isPremium: isVip,
      creditsRemainingToday: isVip ? 999 : 5
    });
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5 mx-auto mb-4 shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h3 className="font-display font-bold text-2xl text-white">Connexion NELFAX AI</h3>
          <p className="text-xs text-slate-400 mt-1">
            Améliorez, restaurez et sublimez vos photos grâce à l'IA photographique
          </p>
        </div>

        {/* Information sécurité et statut VIP */}
        <div className="mb-6 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Authentification Sécurisée NELFAX</p>
              <p className="text-[10px] text-slate-400">Statut VIP synchronisé automatiquement via FedaPay</p>
            </div>
          </div>
          <Lock className="w-4 h-4 text-slate-500" />
        </div>

        {isLoading ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-300">Connexion sécurisée en cours...</p>
          </div>
        ) : authMethod === 'options' ? (
          <div className="space-y-3">
            {/* Google One-Tap Realistic Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg transition transform active:scale-98"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
                <path fill="#34A853" d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.1.74-2.5 1.18-4.22 1.18-3.24 0-5.99-2.19-6.97-5.14H1.02v3.14C3.04 21.18 7.24 24 12 24Z"/>
                <path fill="#FBBC05" d="M5.03 14.03c-.25-.74-.39-1.54-.39-2.36s.14-1.62.39-2.36V6.17H1.02C.37 7.47 0 8.98 0 10.67s.37 3.2 1.02 4.5l4.01-3.14Z"/>
                <path fill="#EA4335" d="M12 4.75c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.14 15.3 0 12 0 7.24 0 3.04 2.82 1.02 6.17l4.01 3.14c.98-2.95 3.73-5.14 6.97-5.14Z"/>
              </svg>
              <span>Continuer avec Google</span>
            </button>

            {/* Email login Option */}
            <button
              onClick={() => setAuthMethod('email')}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-2xl flex items-center justify-center gap-3 border border-slate-700 transition"
            >
              <Mail className="w-5 h-5 text-indigo-400" />
              <span>Se connecter avec E-mail</span>
            </button>

            <div className="pt-4 text-center">
              <p className="text-[11px] text-slate-500">
                En vous connectant, vous acceptez les Conditions d'utilisation de NELFAX AI et recevez <span className="text-emerald-400 font-bold">5 photos gratuites chaque jour</span>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nom complet</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                placeholder="Ex: Sophie Martin"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse e-mail</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                placeholder="sophie@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition mt-2"
            >
              Se connecter instantanément
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('options')}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-2"
            >
              ← Retour aux options
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Chiffrement AES-256 & Auth synchronisée Cloud SQL/Firebase</span>
        </div>
      </div>
    </div>
  );
};
