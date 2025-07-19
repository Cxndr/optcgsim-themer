import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getImageDataUrl } from '@/utils/googleDrive';

// Cache configuration for individual images
const IMAGE_CACHE_DURATION = 60 * 60; // 1 hour in seconds for unstable_cache
const CLIENT_CACHE_DURATION = 3600; // 1 hour for client cache
const CDN_CACHE_DURATION = 7200; // 2 hours for CDN cache

// Create a cached version of the image data fetch function
const getCachedImageData = unstable_cache(
  async (fileId: string) => {
    console.log(`Fetching image data for file: ${fileId}`);
    const dataUrl = await getImageDataUrl(fileId);
    console.log(`Successfully fetched image data for file: ${fileId}`);
    return dataUrl;
  },
  ['google-drive-image-data'], // Cache key prefix
  {
    revalidate: IMAGE_CACHE_DURATION, // Revalidate every hour
    tags: ['google-drive', 'image-data'], // Tags for selective revalidation
  }
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Use cached image data fetch
    const dataUrl = await getCachedImageData(fileId);
    
    // Enhanced cache headers for better performance
    const response = NextResponse.json({ dataUrl });
    response.headers.set('Cache-Control', 
      `public, max-age=${CLIENT_CACHE_DURATION}, s-maxage=${CDN_CACHE_DURATION}, stale-while-revalidate=86400, immutable`
    );
    response.headers.set('ETag', `"image-data-${fileId}"`);
    response.headers.set('Vary', 'Accept-Encoding');
    response.headers.set('Content-Type', 'application/json');
    
    return response;
    
  } catch (error) {
    console.error('Error fetching image data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch image data',
      fileId: (await params).fileId
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
} 