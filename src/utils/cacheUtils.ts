// Cache utility functions for the OPTCG Themer application

// Cache duration constants (in seconds)
export const CACHE_DURATIONS = {
  // API responses
  GOOGLE_DRIVE_IMAGES: 5 * 60, // 5 minutes
  IMAGE_DATA: 60 * 60, // 1 hour
  STATIC_MANIFEST: 2 * 60 * 60, // 2 hours
  
  // Static assets
  IMAGES: 24 * 60 * 60, // 24 hours
  FONTS: 30 * 24 * 60 * 60, // 30 days
  STYLES: 24 * 60 * 60, // 24 hours
  
  // Pages
  STATIC_PAGES: 24 * 60 * 60, // 24 hours
  DYNAMIC_PAGES: 60 * 60, // 1 hour
} as const;

// Cache header generators
export function generateCacheHeaders(
  maxAge: number,
  sMaxAge?: number,
  options: {
    immutable?: boolean;
    staleWhileRevalidate?: number;
    mustRevalidate?: boolean;
    noCache?: boolean;
  } = {}
): Record<string, string> {
  const {
    immutable = false,
    staleWhileRevalidate = 86400, // 24 hours default
    mustRevalidate = false,
    noCache = false,
  } = options;

  if (noCache) {
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
  }

  const directives = ['public'];
  
  directives.push(`max-age=${maxAge}`);
  
  if (sMaxAge !== undefined) {
    directives.push(`s-maxage=${sMaxAge}`);
  }
  
  if (staleWhileRevalidate > 0) {
    directives.push(`stale-while-revalidate=${staleWhileRevalidate}`);
  }
  
  if (immutable) {
    directives.push('immutable');
  }
  
  if (mustRevalidate) {
    directives.push('must-revalidate');
  }

  return {
    'Cache-Control': directives.join(', '),
    'Vary': 'Accept-Encoding',
  };
}

// Predefined cache header sets
export const CACHE_HEADERS = {
  // For Google Drive images (can change, but not frequently)
  GOOGLE_DRIVE_IMAGES: generateCacheHeaders(
    CACHE_DURATIONS.GOOGLE_DRIVE_IMAGES,
    CACHE_DURATIONS.GOOGLE_DRIVE_IMAGES * 2
  ),
  
  // For individual image data (rarely changes)
  IMAGE_DATA: generateCacheHeaders(
    CACHE_DURATIONS.IMAGE_DATA,
    CACHE_DURATIONS.IMAGE_DATA * 2,
    { immutable: true }
  ),
  
  // For static manifest (very stable)
  STATIC_MANIFEST: generateCacheHeaders(
    CACHE_DURATIONS.STATIC_MANIFEST,
    CACHE_DURATIONS.STATIC_MANIFEST * 2,
    { immutable: true }
  ),
  
  // For static images (never change)
  STATIC_IMAGES: generateCacheHeaders(
    CACHE_DURATIONS.IMAGES,
    CACHE_DURATIONS.IMAGES,
    { immutable: true }
  ),
  
  // For fonts (never change)
  FONTS: generateCacheHeaders(
    CACHE_DURATIONS.FONTS,
    CACHE_DURATIONS.FONTS,
    { immutable: true }
  ),
  
  // For error responses (don't cache)
  ERROR: generateCacheHeaders(0, 0, { noCache: true }),
} as const;

// ETag generation
export function generateETag(content: string | number | object): string {
  const stringContent = typeof content === 'string' 
    ? content 
    : JSON.stringify(content);
  
  // Simple hash function for ETag
  let hash = 0;
  for (let i = 0; i < stringContent.length; i++) {
    const char = stringContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `"${Math.abs(hash).toString(36)}"`;
}

// Cache key generators for React Query
export function generateCacheKey(
  type: string, 
  identifier?: string | number, 
  params?: Record<string, unknown>
): string[] {
  const key = [type];
  
  if (identifier !== undefined) {
    key.push(String(identifier));
  }
  
  if (params) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, k) => {
        acc[k] = params[k];
        return acc;
      }, {} as Record<string, unknown>);
    
    key.push(JSON.stringify(sortedParams));
  }
  
  return key;
}

// Browser cache management utilities
export const browserCache = {
  // Clear specific cache by key pattern
  async clearByPattern(pattern: string): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const matchingCaches = cacheNames.filter(name => 
        name.includes(pattern)
      );
      
      await Promise.all(
        matchingCaches.map(name => caches.delete(name))
      );
    }
  },
  
  // Get cache size information
  async getCacheInfo(): Promise<Record<string, number>> {
    if (!('caches' in window)) {
      return {};
    }
    
    const cacheNames = await caches.keys();
    const info: Record<string, number> = {};
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      info[name] = keys.length;
    }
    
    return info;
  },
  
  // Estimate storage usage
  async getStorageEstimate(): Promise<StorageEstimate | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return await navigator.storage.estimate();
    }
    return null;
  },
};

// Performance monitoring utilities
export const cacheMetrics = {
  // Track cache hit/miss rates
  trackCacheHit(cacheType: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_hit', {
        cache_type: cacheType,
      });
    }
  },
  
  trackCacheMiss(cacheType: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_miss', {
        cache_type: cacheType,
      });
    }
  },
  
  // Measure cache performance
  measureCachePerformance<T>(
    operation: () => Promise<T>,
    cacheType: string
  ): Promise<T> {
    const startTime = performance.now();
    
    return operation().then(result => {
      const duration = performance.now() - startTime;
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'cache_performance', {
          cache_type: cacheType,
          duration: Math.round(duration),
        });
      }
      
      return result;
    });
  },
};

// Type definitions for global gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters?: Record<string, unknown>
    ) => void;
  }
} 