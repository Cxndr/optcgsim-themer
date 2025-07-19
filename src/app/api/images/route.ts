import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getImageMetadataFromGoogleDrive } from '@/utils/googleDrive';

// Enhanced cache configuration
const CACHE_DURATION = 5 * 60; // 5 minutes in seconds for unstable_cache
const CLIENT_CACHE_DURATION = 300; // 5 minutes for client cache
const CDN_CACHE_DURATION = 600; // 10 minutes for CDN cache

// Create a cached version of the Google Drive fetch function
const getCachedImageMetadata = unstable_cache(
  async (folderId: string) => {
    console.log('Fetching fresh image metadata from Google Drive...');
    const images = await getImageMetadataFromGoogleDrive(folderId);
    console.log(`Fetched metadata for ${images.length} images from Google Drive`);
    return images;
  },
  ['google-drive-images'], // Cache key
  {
    revalidate: CACHE_DURATION, // Revalidate every 5 minutes
    tags: ['google-drive', 'images'], // Tags for selective revalidation
  }
);

export async function GET() {
  try {
    const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    if (!mainFolderId) {
      return NextResponse.json(
        { error: 'GOOGLE_DRIVE_FOLDER_ID environment variable is not set' },
        { status: 500 }
      );
    }

    // Use NextJS 15's unstable_cache for persistent caching across deployments
    const images = await getCachedImageMetadata(mainFolderId);
    
    console.log(`Serving ${images.length} cached images`);
    
    // Enhanced cache headers for optimal performance
    const response = NextResponse.json(images);
    response.headers.set('Cache-Control', 
      `public, max-age=${CLIENT_CACHE_DURATION}, s-maxage=${CDN_CACHE_DURATION}, stale-while-revalidate=86400`
    );
    response.headers.set('ETag', `"images-${Date.now()}-${images.length}"`);
    response.headers.set('Vary', 'Accept-Encoding');
    
    return response;
    
  } catch (error) {
    console.error('Error fetching images from Google Drive:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch images from Google Drive',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Add revalidation endpoint for cache management
export async function POST() {
  try {
    const { revalidateTag } = await import('next/cache');
    await revalidateTag('google-drive');
    
    return NextResponse.json({ 
      message: 'Google Drive cache revalidated successfully' 
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    );
  }
} 