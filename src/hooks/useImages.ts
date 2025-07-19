import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThemeImage } from '@/utils/imageSet';

// Query keys for consistent caching
export const imageQueryKeys = {
  all: ['images'] as const,
  lists: () => [...imageQueryKeys.all, 'list'] as const,
  list: (source: 'google-drive' | 'manifest') => [...imageQueryKeys.lists(), source] as const,
  details: () => [...imageQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...imageQueryKeys.details(), id] as const,
};

// Fetch images from Google Drive
async function fetchGoogleDriveImages(): Promise<ThemeImage[]> {
  const response = await fetch('/api/images');
  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Fetch images from static manifest
async function fetchManifestImages(): Promise<ThemeImage[]> {
  const response = await fetch('/api/images/manifest');
  if (!response.ok) {
    throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Fetch individual image data
async function fetchImageData(fileId: string): Promise<{ dataUrl: string }> {
  const response = await fetch(`/api/images/${fileId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch image data: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Hook to fetch Google Drive images
export function useGoogleDriveImages() {
  return useQuery({
    queryKey: imageQueryKeys.list('google-drive'),
    queryFn: fetchGoogleDriveImages,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to fetch manifest images
export function useManifestImages() {
  return useQuery({
    queryKey: imageQueryKeys.list('manifest'),
    queryFn: fetchManifestImages,
    staleTime: 60 * 60 * 1000, // 1 hour (static content)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  });
}

// Hook to fetch individual image data
export function useImageData(fileId: string | null) {
  return useQuery({
    queryKey: imageQueryKeys.detail(fileId || ''),
    queryFn: () => fetchImageData(fileId!),
    enabled: !!fileId,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to refresh Google Drive cache
export function useRefreshGoogleDriveCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/images', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to refresh cache');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch Google Drive images
      queryClient.invalidateQueries({ queryKey: imageQueryKeys.list('google-drive') });
    },
  });
}

// Hook to refresh manifest cache
export function useRefreshManifestCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/images/manifest', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to refresh manifest cache');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch manifest images
      queryClient.invalidateQueries({ queryKey: imageQueryKeys.list('manifest') });
    },
  });
}

// Hook to prefetch images (for performance optimization)
export function usePrefetchImages() {
  const queryClient = useQueryClient();

  const prefetchGoogleDriveImages = () => {
    queryClient.prefetchQuery({
      queryKey: imageQueryKeys.list('google-drive'),
      queryFn: fetchGoogleDriveImages,
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchManifestImages = () => {
    queryClient.prefetchQuery({
      queryKey: imageQueryKeys.list('manifest'),
      queryFn: fetchManifestImages,
      staleTime: 60 * 60 * 1000,
    });
  };

  const prefetchImageData = (fileId: string) => {
    queryClient.prefetchQuery({
      queryKey: imageQueryKeys.detail(fileId),
      queryFn: () => fetchImageData(fileId),
      staleTime: 60 * 60 * 1000,
    });
  };

  return {
    prefetchGoogleDriveImages,
    prefetchManifestImages,
    prefetchImageData,
  };
} 