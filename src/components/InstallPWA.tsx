import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

export const InstallPWA: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setPlatform(isMobile ? 'mobile' : 'desktop');

    const handler = (e: Event) => {
      e.preventDefault();
      window.deferredPrompt = e as BeforeInstallPromptEvent;
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!window.deferredPrompt) return;

    await window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      window.deferredPrompt = null;
    }
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowPrompt(false)} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-6 z-50 animate-scale-up">
        <div className="relative">
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center touch-feedback"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Installer l'application
            </h3>
            <p className="text-sm text-gray-500">
              {platform === 'mobile' 
                ? "Installez WESD SignPDF sur votre appareil pour un accès rapide et hors ligne"
                : "Installez WESD SignPDF sur votre ordinateur pour une expérience optimale"}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleInstall}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium touch-feedback"
            >
              Installer maintenant
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium touch-feedback"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};