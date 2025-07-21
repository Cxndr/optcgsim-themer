'use client';

import { useEffect, useState } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const { isSupported, isRegistered, error, clearAllCaches, getCacheStatus } = useServiceWorker();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [showCacheTools, setShowCacheTools] = useState(false);

  useEffect(() => {
    setIsDevelopment(
      typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    );
  }, []);

  const handleClearCache = async () => {
    try {
      await clearAllCaches();
      console.log('All caches cleared successfully');
      alert('Cache cleared! The page will refresh.');
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache. Check console for details.');
    }
  };

  const handleShowCacheStatus = async () => {
    try {
      const status = await getCacheStatus();
      console.log('Cache Status:', status);
      alert(`Cache Status (check console for details):\n${Object.entries(status).map(([name, count]) => `${name}: ${count} items`).join('\n')}`);
    } catch (error) {
      console.error('Failed to get cache status:', error);
    }
  };

  return (
    <>
      {children}
      
      {/* Development Cache Tools */}
      {isDevelopment && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowCacheTools(!showCacheTools)}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg hover:bg-blue-700 transition-colors"
            title="Toggle cache development tools"
          >
            🔧 Cache Tools
          </button>
          
          {showCacheTools && (
            <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[200px]">
              <h3 className="font-semibold text-gray-800 mb-2">Development Cache Tools</h3>
              
              <div className="space-y-2">
                <button
                  onClick={handleClearCache}
                  className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Clear All Caches
                </button>
                
                <button
                  onClick={handleShowCacheStatus}
                  className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  Show Cache Status
                </button>
              </div>
              
              <div className="mt-3 text-xs text-gray-600">
                <div>SW: {isSupported ? (isRegistered ? '✅ Active' : '⏳ Loading') : '❌ Not Supported'}</div>
                {error && <div className="text-red-500">Error: {error}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
} 