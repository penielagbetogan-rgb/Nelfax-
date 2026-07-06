import { FeatureDefinition } from '../types';

export const ALL_FEATURES: FeatureDefinition[] = [
  // Fonctionnalités gratuites
  {
    id: 'upscale_4k',
    name: 'Amélioration 4K',
    description: 'Agrandissement par réseaux antagonistes génératifs (GAN) avec recréation des micro-détails sans perte chromatique.',
    iconName: 'Sparkles',
    isPremium: false,
    badge: 'Gratuit',
    category: 'Amélioration Base'
  },
  {
    id: 'color_correction',
    name: 'Correction auto des couleurs',
    description: 'Équilibrage adaptatif de la balance des blancs, vibrance dynamique et restitution réaliste des tons chair.',
    iconName: 'Palette',
    isPremium: false,
    badge: 'Gratuit',
    category: 'Amélioration Base'
  },
  {
    id: 'sharpness',
    name: 'Netteté améliorée',
    description: 'Défloutage optique par déconvolution IA, rattrapage de mise au point légère et contouring naturel.',
    iconName: 'Focus',
    isPremium: false,
    badge: 'Gratuit',
    category: 'Amélioration Base'
  },
  {
    id: 'denoise',
    name: 'Réduction du bruit (Denoise)',
    description: 'Suppression du bruit ISO en basse lumière sans effet plastique lissé sur les textures naturelles.',
    iconName: 'ShieldAlert',
    isPremium: false,
    badge: 'Gratuit',
    category: 'Amélioration Base'
  },
  {
    id: 'auto_crop',
    name: 'Recadrage automatique IA',
    description: 'Cadrage intelligent basé sur la règle des tiers et le suivi de regard (Social Stories, Post, Portrait).',
    iconName: 'Crop',
    isPremium: false,
    badge: 'Gratuit',
    category: 'Amélioration Base'
  },

  // Toutes les fonctionnalités sont désormais 100% Gratuites
  {
    id: 'portrait_iphone',
    name: 'Portrait style iPhone (Bokeh)',
    description: 'Simulation optique d’objectif 85mm f/1.4 avec séparation 3D de profondeur et flou d’arrière-plan cinématographique.',
    iconName: 'Smartphone',
    isPremium: false,
    badge: 'IA 100% GRATUIT',
    category: 'Portrait & Visage'
  },
  {
    id: 'face_enhance',
    name: 'Amélioration avancée des visages',
    description: 'Restauration haute définition des yeux, des lèvres, de la pilosité et de la symétrie faciale sub-pixel.',
    iconName: 'UserCheck',
    isPremium: false,
    badge: 'IA 100% GRATUIT',
    category: 'Portrait & Visage'
  },
  {
    id: 'object_remove',
    name: 'Suppression magique d’objets',
    description: 'Effacement d’éléments indésirables, passants ou lignes électriques par remplissage inpainting génératif.',
    iconName: 'Eraser',
    isPremium: false,
    badge: 'IA 100% GRATUIT',
    category: 'Créatif & Restauration'
  },
  {
    id: 'sky_change',
    name: 'Changement automatique du ciel',
    description: 'Remplacement d’un ciel gris par un coucher de soleil doré, ciel étoilé ou nuages dramatiques avec harmonisation au sol.',
    iconName: 'CloudSun',
    isPremium: false,
    badge: 'IA 100% GRATUIT',
    category: 'Créatif & Restauration'
  },
  {
    id: 'landscape_beautify',
    name: 'Embellissement des paysages',
    description: 'Accentuation des volumes naturels, brume matinale atmosphérique et contraste micro-textural de la végétation.',
    iconName: 'Mountain',
    isPremium: false,
    badge: 'IA 100% GRATUIT',
    category: 'Créatif & Restauration'
  },
  {
    id: 'old_photo_colorize',
    name: 'Colorisation photos anciennes',
    description: 'Restauration de photos N&B historiques par colorisation sémantique profonde et élimination des rayures.',
    iconName: 'History',
    isPremium: false,
    badge: 'IA 100% GRATUIT',
    category: 'Créatif & Restauration'
  },
  {
    id: 'upscale_8k',
    name: 'Agrandissement Studio 8K',
    description: 'Super-résolution ultra-extrême pour impression grand format, affiches publicitaires et zoom chirurgical.',
    iconName: 'Maximize2',
    isPremium: false,
    badge: '8K GRATUIT',
    category: 'Ultra HD & Export'
  },
  {
    id: 'batch_process',
    name: 'Traitement par lots (Batch)',
    description: 'Améliorez simultanément jusqu’à 50 photos d’un événement en un seul clic avec profils constants.',
    iconName: 'Layers',
    isPremium: false,
    badge: 'BATCH GRATUIT',
    category: 'Ultra HD & Export'
  }
];
