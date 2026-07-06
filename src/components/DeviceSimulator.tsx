import React from 'react';
import { Smartphone, Monitor, Tablet, Wifi, Battery, Signal } from 'lucide-react';
import { DeviceFrameMode } from '../types';

interface DeviceSimulatorProps {
  mode: DeviceFrameMode;
  onModeChange: (mode: DeviceFrameMode) => void;
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  mode,
  onModeChange,
  children
}) => {
  if (mode === 'fullscreen') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        {children}
      </div>
    );
  }

  const isIos = mode === 'iphone';

  return (
    <div className="min-h-screen bg-slate-900 py-6 sm:py-10 px-2 sm:px-6 flex flex-col items-center justify-start">
      {/* Device switcher toolbar */}
      <div className="mb-6 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-full flex items-center gap-1 shadow-2xl z-50">
        <button
          onClick={() => onModeChange('fullscreen')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            mode === 'fullscreen'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Web Plein Écran</span>
        </button>
        <button
          onClick={() => onModeChange('iphone')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            isIos
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iOS (iPhone 16 Pro)</span>
        </button>
        <button
          onClick={() => onModeChange('android')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            mode === 'android'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Android (Galaxy S24)</span>
        </button>
      </div>

      {/* Simulated Device Frame */}
      <div
        className={`relative transition-all duration-500 shadow-[0_25px_70px_rgba(0,0,0,0.8)] border-4 ${
          isIos
            ? 'w-full max-w-[420px] min-h-[860px] rounded-[52px] bg-black border-slate-700 p-3.5'
            : 'w-full max-w-[430px] min-h-[870px] rounded-[36px] bg-black border-slate-800 p-3'
        }`}
      >
        {/* Hardware side buttons (simulated) */}
        <div className="absolute -left-5 top-28 w-1.5 h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-5 top-44 w-1.5 h-14 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-5 top-36 w-1.5 h-20 bg-slate-700 rounded-r-md" />

        {/* Screen inner area */}
        <div
          className={`relative w-full h-full bg-slate-950 flex flex-col overflow-hidden ${
            isIos ? 'rounded-[40px]' : 'rounded-[26px]'
          }`}
          style={{ maxHeight: '820px' }}
        >
          {/* Status Bar */}
          <div className="w-full bg-slate-950 pt-2 px-6 pb-2 flex items-center justify-between text-white select-none shrink-0 z-40 border-b border-slate-900/60">
            <span className="text-xs font-bold tracking-tight">09:41</span>

            {/* iOS Dynamic Island vs Android Punch Hole */}
            {isIos ? (
              <div className="w-24 h-5 bg-black rounded-full border border-slate-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-950/80 border border-indigo-500/40" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800" />
            )}

            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* App Content inside device with scrolling */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-none">
            {children}
          </div>

          {/* Home indicator bar at bottom */}
          <div className="w-full bg-slate-950 py-2 flex justify-center shrink-0 border-t border-slate-900/40">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500 text-center max-w-sm">
        Simulation active de l’expérience mobile native NELFAX AI ({isIos ? 'Apple iOS 18' : 'Google Android 15'}).
      </p>
    </div>
  );
};
