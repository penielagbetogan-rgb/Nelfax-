export type NavigationTab = 
  | 'home' 
  | 'studio' 
  | 'dashboard' 
  | 'gallery' 
  | 'profile';

export type DeviceFrameMode = 'fullscreen' | 'iphone' | 'android';

export type EnhancementMode = 
  // Free Features
  | 'upscale_4k'
  | 'color_correction'
  | 'sharpness'
  | 'denoise'
  | 'auto_crop'
  // Premium Features
  | 'portrait_iphone'
  | 'face_enhance'
  | 'object_remove'
  | 'sky_change'
  | 'landscape_beautify'
  | 'old_photo_colorize'
  | 'upscale_8k'
  | 'batch_process';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  isPremium: boolean;
  creditsRemainingToday: number;
  maxDailyFreeCredits: number;
  totalPhotosProcessed: number;
  cloudSyncEnabled: boolean;
  exportFormat: 'PNG' | 'JPEG XL' | 'HEIC' | 'RAW';
  watermarkEnabled: boolean;
  runpodConfig?: RunPodConfig;
}

export interface RunPodConfig {
  endpointUrl: string;
  apiKey: string;
  enabled: boolean;
}

export interface ProcessingJob {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  stepLabel: string;
  resultUrl?: string;
  resultImageBase64?: string;
  diagnostic?: any;
  error?: string;
}


export interface PhotoProject {
  id: string;
  title: string;
  category: 'Portrait' | 'Paysage' | 'Restauration' | 'Studio 4K/8K';
  originalUrl: string;
  enhancedUrl: string;
  appliedMode: EnhancementMode;
  appliedModeLabel: string;
  createdAt: string;
  isFavorite: boolean;
  resolution: string;
  fileSize: string;
  aiDiagnostic?: {
    originalResolution: string;
    targetResolution: string;
    sharpnessScoreBefore: number;
    sharpnessScoreAfter: number;
    noiseReductionPercentage: number;
    colorAccuracyIndex: string;
    detectedSubject: string;
    aiActions: string[];
    geminiInsight: string;
  };
}

export interface FeatureDefinition {
  id: EnhancementMode;
  name: string;
  description: string;
  iconName: string;
  isPremium: boolean;
  badge?: string;
  category: 'Amélioration Base' | 'Portrait & Visage' | 'Créatif & Restauration' | 'Ultra HD & Export';
}
