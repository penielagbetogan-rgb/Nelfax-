import React from 'react';
import * as Icons from 'lucide-react';
import { FeatureDefinition } from '../types';

interface FeatureCardProps {
  feature: FeatureDefinition;
  onSelect: (feature: FeatureDefinition) => void;
  isUserPremium: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onSelect,
  isUserPremium
}) => {
  // Dynamically resolve icon from lucide-react
  const IconComponent = (Icons as Record<string, React.ElementType>)[feature.iconName] || Icons.Sparkles;
  const isLocked = feature.isPremium && !isUserPremium;

  return (
    <div
      onClick={() => onSelect(feature)}
      className={`group relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
        feature.isPremium
          ? 'bg-white border-2 border-red-500/60 hover:border-red-600 shadow-sm hover:shadow-md hover:-translate-y-1'
          : 'bg-white border border-slate-200 hover:border-red-500 hover:bg-slate-50 shadow-sm hover:shadow-md hover:-translate-y-1'
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
          feature.isPremium
            ? 'bg-red-50 text-red-600 border border-red-200'
            : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-red-50 group-hover:text-red-600'
        }`}>
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-1.5">
          {feature.badge && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              feature.isPremium
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-50 text-red-600 border border-red-200 font-semibold'
            }`}>
              {feature.badge}
            </span>
          )}
          {isLocked && (
            <div className="p-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200" title="Réservé aux abonnés Premium">
              <Icons.Lock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <h4 className="font-bold text-base text-slate-900 group-hover:text-red-600 transition">
          {feature.name}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {feature.description}
        </p>
      </div>

      {/* Action footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500">
          {feature.category}
        </span>
        <span className={`flex items-center gap-1 font-bold transition-transform group-hover:translate-x-1 ${
          isLocked ? 'text-amber-600' : 'text-red-600'
        }`}>
          <span>{isLocked ? 'Débloquer PRO' : 'Essayer'}</span>
          <Icons.ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
