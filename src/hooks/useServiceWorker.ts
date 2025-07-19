'use client';

import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isControlling: boolean;
  error: string | null;
}

interface CacheStatus {
  [cacheName: string]: number;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isControlling: false,
    error: null,
  });

  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({});

  // Register service worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setState(prev => ({ ...prev, isSupported: false }));
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));

    const registerSW = async () => {
      try {
        console.log('Registering service worker...');
        const registration = await navigator.serviceWorker.register('/sw.js');

        setState(prev => ({ ...prev, isRegistered: true }));

        // Handle different states
        if (registration.installing) {
          setState(prev => ({ ...prev, isInstalling: true }));
          console.log('Service worker installing...');
        }

        if (registration.waiting) {
          setState(prev => ({ ...prev, isWaiting: true }));
          console.log('Service worker waiting...');
        }

        if (registration.active) {
          setState(prev => ({ ...prev, isControlling: true }));
          console.log('Service worker active and controlling');
        }

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            setState(prev => ({ ...prev, isInstalling: true }));
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                setState(prev => ({ 
                  ...prev, 
                  isInstalling: false,
                  isWaiting: navigator.serviceWorker.controller ? true : false,
                  isControlling: !navigator.serviceWorker.controller
                }));
              }
            });
          }
        });

      } catch (error) {
        console.error('Service worker registration failed:', error);
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Registration failed'
        }));
      }
    };

    registerSW();

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setState(prev => ({ ...prev, isControlling: true }));
      console.log('Service worker now controlling');
    });

  }, []);

  // Get cache status
  const getCacheStatus = async (): Promise<CacheStatus> => {
    if (!navigator.serviceWorker.controller) {
      throw new Error('No service worker controlling this page');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        const { success, data, error } = event.data;
        if (success) {
          setCacheStatus(data);
          resolve(data);
        } else {
          reject(new Error(error));
        }
      };

      navigator.serviceWorker.controller!.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [messageChannel.port2]
      );
    });
  };

  // Clear specific cache
  const clearCache = async (cacheName: string): Promise<void> => {
    if (!navigator.serviceWorker.controller) {
      throw new Error('No service worker controlling this page');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        const { success, error } = event.data;
        if (success) {
          resolve();
        } else {
          reject(new Error(error));
        }
      };

      navigator.serviceWorker.controller!.postMessage(
        { type: 'CLEAR_CACHE', data: { cacheName } },
        [messageChannel.port2]
      );
    });
  };

  // Clear all caches
  const clearAllCaches = async (): Promise<void> => {
    if (!navigator.serviceWorker.controller) {
      throw new Error('No service worker controlling this page');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        const { success, error } = event.data;
        if (success) {
          setCacheStatus({});
          resolve();
        } else {
          reject(new Error(error));
        }
      };

      navigator.serviceWorker.controller!.postMessage(
        { type: 'CLEAR_ALL_CACHES' },
        [messageChannel.port2]
      );
    });
  };

  // Update service worker
  const updateServiceWorker = async (): Promise<void> => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
    }
  };

  // Skip waiting and activate new service worker
  const skipWaiting = (): void => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    ...state,
    cacheStatus,
    getCacheStatus,
    clearCache,
    clearAllCaches,
    updateServiceWorker,
    skipWaiting,
  };
} 