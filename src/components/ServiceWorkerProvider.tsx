'use client';

import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function ServiceWorkerProvider() {
  const {
    isSupported,
    isRegistered,
    isControlling,
    error
  } = useServiceWorker();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Service Worker Status:', {
        isSupported,
        isRegistered,
        isControlling,
        error
      });
    }
  }, [isSupported, isRegistered, isControlling, error]);

  // Don't render anything, this is just for registration
  return null;
} 