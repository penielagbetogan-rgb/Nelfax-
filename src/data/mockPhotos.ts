import { PhotoProject } from '../types';

export const SAMPLE_PROJECTS: PhotoProject[] = [
  {
    id: 'proj-1',
    title: 'Portrait Studio de Sophie (Basse lumière)',
    category: 'Portrait',
    originalUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=60',
    enhancedUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=100',
    appliedMode: 'portrait_iphone',
    appliedModeLabel: 'Portrait style iPhone (Bokeh 85mm)',
    createdAt: 'Il y a 2 heures',
    isFavorite: true,
    resolution: '3840 x 5120 px (4K)',
    fileSize: '14.2 MB',
    aiDiagnostic: {
      originalResolution: '1200 x 1600 px (Détails flous)',
      targetResolution: '3840 x 5120 px (4K Ultra-Net)',
      sharpnessScoreBefore: 48,
      sharpnessScoreAfter: 97,
      noiseReductionPercentage: 91,
      colorAccuracyIndex: '99.5%',
      detectedSubject: 'Portrait féminin en contre-jour léger avec grain ISO chromatique dans les zones sombres.',
      aiActions: [
        'Séparation par carte de profondeur 3D pour flou optique f/1.4',
        'Récupération chirurgicale de l’iris et des cils par ViT',
        'Lissage chromatique du bruit sans altérer le grain naturel de la peau'
      ],
      geminiInsight: 'Le mode Portrait iPhone a récréé la géométrie lumineuse exacte d’un objectif à focale fixe professionnelle, en rehaussant la colorimétrie carnation.'
    }
  },
  {
    id: 'proj-2',
    title: 'Vue Nocturne Cyberpunk sur Tokyo',
    category: 'Paysage',
    originalUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=50',
    enhancedUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=100',
    appliedMode: 'upscale_8k',
    appliedModeLabel: 'Agrandissement Studio 8K & Denoise',
    createdAt: 'Hier, 19:40',
    isFavorite: true,
    resolution: '7680 x 4320 px (8K)',
    fileSize: '34.8 MB',
    aiDiagnostic: {
      originalResolution: '1080 x 608 px (Bruit élevé)',
      targetResolution: '7680 x 4320 px (8K Super-Résolution)',
      sharpnessScoreBefore: 39,
      sharpnessScoreAfter: 98,
      noiseReductionPercentage: 94,
      colorAccuracyIndex: '99.8%',
      detectedSubject: 'Paysage urbain de nuit avec éclairage néon intense et pollution lumineuse diffuse.',
      aiActions: [
        'Élimination du bruit numérique par réseau antagoniste génératif (SR-GAN)',
        'Accroissement du contraste dynamique des néons sans écrêtage des reflets sur l’eau',
        'Upscaling 8x net sur les fenêtres des gratte-ciels distants'
      ],
      geminiInsight: 'La densité d’informations révélée dans les zones d’ombre nocturne atteint un niveau de netteté comparable au capteur moyen format.'
    }
  },
  {
    id: 'proj-3',
    title: 'Photo de Mariage Vintage Paris 1968',
    category: 'Restauration',
    originalUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=60',
    enhancedUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=100',
    appliedMode: 'old_photo_colorize',
    appliedModeLabel: 'Colorisation photos anciennes & Dérayage',
    createdAt: 'Il y a 3 jours',
    isFavorite: false,
    resolution: '3840 x 4800 px (4K)',
    fileSize: '11.6 MB',
    aiDiagnostic: {
      originalResolution: '800 x 1000 px (N&B dégradé)',
      targetResolution: '3840 x 4800 px (4K Colorisé)',
      sharpnessScoreBefore: 34,
      sharpnessScoreAfter: 94,
      noiseReductionPercentage: 89,
      colorAccuracyIndex: '98.2%',
      detectedSubject: 'Archive historique d’un portrait d’époque avec micros-rayures et oxydation argentique.',
      aiActions: [
        'Inpainting sémantique pour reboucher 14 micros-rayures de surface',
        'Colorisation neuronale basée sur l’éclairage naturel européen de l’après-midi',
        'Synthèse de grain photographique moderne Fujicolor Pro 400H'
      ],
      geminiInsight: 'La colorisation apporte une tonalité vibrante et chaleureuse, rendant le sujet intemporel et d’une clarté contemporaine.'
    }
  },
  {
    id: 'proj-4',
    title: 'Vallée des Alpes de Haute-Savoie',
    category: 'Paysage',
    originalUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=60',
    enhancedUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=100',
    appliedMode: 'landscape_beautify',
    appliedModeLabel: 'Embellissement paysages & Ciel',
    createdAt: '28 Juin 2026',
    isFavorite: true,
    resolution: '4096 x 2730 px (4K Cinéma)',
    fileSize: '18.4 MB',
    aiDiagnostic: {
      originalResolution: '1400 x 933 px (Brume dense)',
      targetResolution: '4096 x 2730 px (4K Dehaze Pro)',
      sharpnessScoreBefore: 51,
      sharpnessScoreAfter: 96,
      noiseReductionPercentage: 85,
      colorAccuracyIndex: '99.2%',
      detectedSubject: 'Chaîne montagneuse alpine avec voile atmosphérique et ciel surexposé.',
      aiActions: [
        'Suppression du voile atmosphérique (Dehaze IA) augmentant la visibilité des crêtes de 15 km',
        'Accentuation dynamique de la saturation verte sur la canopée et des roches granitiques',
        'Remplacement sub-pixel des reflets nuageux en haute altitude'
      ],
      geminiInsight: 'Le rendu final offre une profondeur stéréoscopique saisissante digne d’une production documentaire UHD.'
    }
  }
];

export const PRESET_STUDIO_SAMPLES = [
  {
    title: 'Portrait Flou (Basse Lumière)',
    originalUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=55',
    enhancedUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=100',
    mode: 'portrait_iphone' as const,
    modeLabel: 'Portrait style iPhone'
  },
  {
    title: 'Paysage Sombre & Nuageux',
    originalUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=50',
    enhancedUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=100',
    mode: 'sky_change' as const,
    modeLabel: 'Changement de ciel doré'
  },
  {
    title: 'Selfie Grain ISO Élevé',
    originalUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=50',
    enhancedUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=100',
    mode: 'face_enhance' as const,
    modeLabel: 'Amélioration des visages 4K'
  },
  {
    title: 'Archive Ancienne 1950',
    originalUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=50',
    enhancedUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=100',
    mode: 'old_photo_colorize' as const,
    modeLabel: 'Colorisation IA'
  }
];
