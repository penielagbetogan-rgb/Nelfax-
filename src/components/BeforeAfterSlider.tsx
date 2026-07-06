import React, { useState, useRef } from 'react';
import { SlidersHorizontal, Sparkles, ZoomIn, Download } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalUrl: string;
  enhancedUrl: string;
  title?: string;
  modeLabel?: string;
  className?: string;
  onDownload?: () => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalUrl,
  enhancedUrl,
  title,
  modeLabel,
  className = '',
  onDownload
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const pos = ((touch.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, pos)));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, pos)));
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 ${className}`}>
      {/* Top Badge overlay */}
      {(title || modeLabel) && (
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 items-center pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs font-medium text-white flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{title || 'Comparaison en direct'}</span>
          </div>
          {modeLabel && (
            <div className="bg-indigo-600/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg">
              {modeLabel}
            </div>
          )}
        </div>
      )}

      {/* Action buttons overlay */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md p-2 rounded-full border border-slate-700 text-slate-200 transition"
          title="Zoom détail"
        >
          <ZoomIn className={`w-4 h-4 ${isZoomed ? 'text-indigo-400' : ''}`} />
        </button>
        {onDownload && (
          <button
            onClick={onDownload}
            className="bg-indigo-600 hover:bg-indigo-500 backdrop-blur-md p-2 rounded-full text-white transition shadow-lg flex items-center gap-1.5 px-3 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HD</span>
          </button>
        )}
      </div>

      {/* Main image container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className={`relative w-full select-none cursor-ew-resize overflow-hidden ${
          isZoomed ? 'aspect-[4/3] scale-125 origin-center transition-transform duration-300' : 'aspect-[4/3] sm:aspect-[16/10]'
        }`}
      >
        {/* AFTER Image (Background full width) */}
        <img
          src={enhancedUrl}
          alt="Version améliorée par IA"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute bottom-4 right-4 z-10 bg-indigo-600/90 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase text-white shadow">
          Après (IA 4K)
        </div>

        {/* BEFORE Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalUrl}
            alt="Original avant amélioration"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase text-slate-300 border border-slate-700 shadow">
            Avant (Original)
          </div>
        </div>

        {/* Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(99,102,241,0.8)] z-10 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Thumb circle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bottom Range input for accessibility & touch */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-slate-400">Glissez pour comparer</span>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="slider-compare w-48 sm:w-64 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="font-mono text-indigo-400 font-bold">{Math.round(sliderPosition)}%</span>
      </div>
    </div>
  );
};
