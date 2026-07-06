import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { RunPodConfigModal } from './components/RunPodConfigModal';
import { DeviceSimulator } from './components/DeviceSimulator';

import { HomeView } from './views/HomeView';
import { StudioView } from './views/StudioView';
import { DashboardView } from './views/DashboardView';
import { GalleryView } from './views/GalleryView';
import { ProfileView } from './views/ProfileView';

import { SAMPLE_PROJECTS } from './data/mockPhotos';
import { NavigationTab, EnhancementMode, DeviceFrameMode, UserProfile, PhotoProject, FeatureDefinition, RunPodConfig } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [studioInitialMode, setStudioInitialMode] = useState<EnhancementMode>('upscale_4k');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<DeviceFrameMode>('fullscreen');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isRunPodConfigOpen, setIsRunPodConfigOpen] = useState<boolean>(false);
  const [globalUploadedFileUrl, setGlobalUploadedFileUrl] = useState<string | null>(null);

  const [runpodConfig, setRunpodConfig] = useState<RunPodConfig>(() => {
    const saved = localStorage.getItem('nelfax_runpod_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      endpointUrl: '',
      apiKey: '',
      enabled: false
    };
  });

  useEffect(() => {
    localStorage.setItem('nelfax_runpod_config', JSON.stringify(runpodConfig));
  }, [runpodConfig]);


  // User Profile State (100% Gratuit Illimité)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nelfax_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isPremium: true, creditsRemainingToday: 999999 };
      } catch (e) {}
    }
    return {
      id: 'usr-101',
      name: 'Alexandre Dubois',
      email: 'alexandre.dubois@nelfax.ai',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isLoggedIn: true,
      isPremium: true,
      creditsRemainingToday: 999999,
      maxDailyFreeCredits: 999999,
      totalPhotosProcessed: 14,
      cloudSyncEnabled: true,
      exportFormat: 'PNG',
      watermarkEnabled: false
    };
  });

  // Gallery Projects State
  const [projects, setProjects] = useState<PhotoProject[]>(() => {
    const saved = localStorage.getItem('nelfax_user_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SAMPLE_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('nelfax_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nelfax_user_projects', JSON.stringify(projects));
  }, [projects]);

  // Navigate helper
  const handleNavigate = (tab: NavigationTab, mode?: EnhancementMode) => {
    if (mode) {
      setStudioInitialMode(mode);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle dark/light mode
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Toggle device simulator
  const handleToggleDeviceMode = () => {
    const modes: DeviceFrameMode[] = ['fullscreen', 'iphone', 'android'];
    const nextIdx = (modes.indexOf(deviceMode) + 1) % modes.length;
    setDeviceMode(modes[nextIdx]);
  };

  // Use credit (Illimité & Gratuit pour tous)
  const handleUseCredit = (): boolean => {
    setUser(prev => ({ ...prev, totalPhotosProcessed: prev.totalPhotosProcessed + 1 }));
    return true;
  };

  // Save new project to gallery
  const handleSaveToGallery = (newProj: PhotoProject) => {
    setProjects(prev => [newProj, ...prev]);
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  // Update user
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  // Handle select feature card (Tout est gratuit)
  const handleSelectFeatureCard = (feature: FeatureDefinition) => {
    handleNavigate('studio', feature.id);
  };

  const handleGlobalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setGlobalUploadedFileUrl(url);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans pb-16">
      
      {/* Device Simulator Wrapping */}
      <DeviceSimulator mode={deviceMode} onModeChange={setDeviceMode}>
        <div className="flex flex-col min-h-screen relative">
          <Header
            activeTab={activeTab}
            onSelectTab={(tab) => handleNavigate(tab)}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            deviceMode={deviceMode}
            onToggleDeviceMode={handleToggleDeviceMode}
            onOpenRunPodConfig={() => setIsRunPodConfigOpen(true)}
          />

          <main className="flex-1">
            {activeTab === 'home' && (
              <HomeView
                onNavigate={handleNavigate}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}

            {activeTab === 'studio' && (
              <StudioView
                initialMode={studioInitialMode}
                user={user}
                onUseCredit={handleUseCredit}
                onOpenPremium={() => handleNavigate('dashboard')}
                onSaveToGallery={handleSaveToGallery}
                runpodConfig={runpodConfig}
                onOpenRunPodConfig={() => setIsRunPodConfigOpen(true)}
                globalCustomUrl={globalUploadedFileUrl}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                user={user}
                onSelectFeature={handleSelectFeatureCard}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryView
                projects={projects}
                onNavigate={handleNavigate}
                onDeleteProject={handleDeleteProject}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={() => {
                  handleUpdateUser({ isLoggedIn: false });
                  handleNavigate('home');
                }}
                onNavigate={handleNavigate}
              />
            )}
          </main>

          <Footer onSelectTab={(tab) => handleNavigate(tab)} />
          <BottomNav
            activeTab={activeTab}
            onSelectTab={(tab) => handleNavigate(tab)}
            onFileUpload={handleGlobalFileUpload}
          />
        </div>
      </DeviceSimulator>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          handleUpdateUser({ ...userData, isLoggedIn: true });
        }}
      />

      <RunPodConfigModal
        isOpen={isRunPodConfigOpen}
        onClose={() => setIsRunPodConfigOpen(false)}
        config={runpodConfig}
        onSaveConfig={setRunpodConfig}
      />
    </div>
  );
}
