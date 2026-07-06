import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Trash2, 
  Eye, 
  Heart, 
  Plus, 
  X
} from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { PhotoProject, NavigationTab } from '../types';

interface GalleryViewProps {
  projects: PhotoProject[];
  onNavigate: (tab: NavigationTab) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  projects,
  onNavigate,
  onDeleteProject,
  onToggleFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [inspectProject, setInspectProject] = useState<PhotoProject | null>(null);

  const categories = ['Toutes', 'Portrait', 'Paysage', 'Restauration', 'Studio 4K/8K'];

  const filteredProjects = selectedCategory === 'Toutes'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const downloadFile = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `NELFAX-AI_${title.replace(/\s+/g, '_')}_HD.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-20">
      
      {/* Header & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-red-600" />
            <span>Galerie d’Améliorations IA</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Retrouvez tous vos projets améliorés, restaurez et comparez en haute définition 4K / 8K
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => onNavigate('studio')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm ml-2 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau projet</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Aucun projet dans cette catégorie</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Vous n'avez pas encore amélioré de photo avec cette catégorie. Lancez le Studio IA pour commencer !
          </p>
          <button
            onClick={() => onNavigate('studio')}
            className="px-6 py-3 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition shadow-sm"
          >
            Ouvrir le Studio IA
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-red-500 transition flex flex-col justify-between group"
            >
              {/* Image Thumbnail with Overlay */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={proj.enhancedUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm">
                    {proj.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    onClick={() => onToggleFavorite(proj.id)}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-600 hover:text-red-600 transition shadow-sm"
                  >
                    <Heart className={`w-4 h-4 ${proj.isFavorite ? 'text-red-600 fill-red-600' : ''}`} />
                  </button>
                </div>

                {/* Bottom resolution tag */}
                <div className="absolute bottom-3 right-3 bg-red-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-sm">
                  {proj.resolution}
                </div>

                {/* Inspect Button overlay on hover */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-xs">
                  <button
                    onClick={() => setInspectProject(proj)}
                    className="px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-xl hover:scale-105 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Comparer Avant/Après</span>
                  </button>
                </div>
              </div>

              {/* Project Info & Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-red-600 transition">{proj.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{proj.appliedModeLabel}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>{proj.createdAt} • {proj.fileSize}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => downloadFile(proj.enhancedUrl, proj.title)}
                      title="Télécharger HD"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      title="Supprimer"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white text-slate-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Inspector Modal */}
      {inspectProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-xl text-slate-900">{inspectProject.title}</h3>
                <p className="text-xs text-slate-500">{inspectProject.appliedModeLabel} • {inspectProject.resolution}</p>
              </div>
              <button
                onClick={() => setInspectProject(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <BeforeAfterSlider
              originalUrl={inspectProject.originalUrl}
              enhancedUrl={inspectProject.enhancedUrl}
              title={inspectProject.title}
              modeLabel={inspectProject.appliedModeLabel}
              onDownload={() => downloadFile(inspectProject.enhancedUrl, inspectProject.title)}
            />

            {inspectProject.aiDiagnostic && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <p className="font-bold text-slate-800">📊 Diagnostic & Actions IA :</p>
                <p className="text-slate-600 italic">« {inspectProject.aiDiagnostic.detectedSubject} »</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setInspectProject(null);
                  onNavigate('studio');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
              >
                Rééditer dans le Studio
              </button>
              <button
                onClick={() => downloadFile(inspectProject.enhancedUrl, inspectProject.title)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger 4K / 8K</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
