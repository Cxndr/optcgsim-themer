import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import fs from 'fs';
import path from 'path';

// Cache configuration for manifest
const MANIFEST_CACHE_DURATION = 60 * 60; // 1 hour in seconds for unstable_cache
const CLIENT_CACHE_DURATION = 3600; // 1 hour for client cache
const CDN_CACHE_DURATION = 7200; // 2 hours for CDN cache

// Create a cached version of the manifest read function
const getCachedManifest = unstable_cache(
  async () => {
    const manifestPath = path.join(process.cwd(), 'public', 'image-manifest.json');
    
    // Check if manifest file exists
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Image manifest not found');
    }

    // Read and parse the manifest file
    const manifestData = fs.readFileSync(manifestPath, 'utf-8');
    const images = JSON.parse(manifestData);
    
    console.log(`Loaded ${images.length} images from static manifest`);
    return images;
  },
  ['static-image-manifest'], // Cache key
  {
    revalidate: MANIFEST_CACHE_DURATION, // Revalidate every hour
    tags: ['manifest', 'static-images'], // Tags for selective revalidation
  }
);

export async function GET() {
  try {
    // Use cached manifest data
    const images = await getCachedManifest();
    
    console.log(`Serving ${images.length} images from cached static manifest`);
    
    // Enhanced cache headers for static content
    const response = NextResponse.json(images);
    response.headers.set('Cache-Control', 
      `public, max-age=${CLIENT_CACHE_DURATION}, s-maxage=${CDN_CACHE_DURATION}, immutable`
    );
    response.headers.set('ETag', `"manifest-${images.length}"`);
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Vary', 'Accept-Encoding');
    
    return response;
    
  } catch (error) {
    console.error('Error reading image manifest:', error);
    
    if (error instanceof Error && error.message === 'Image manifest not found') {
      return NextResponse.json(
        { 
          error: 'Image manifest not found. Please run "npm run generate-manifest" first.',
          instructions: 'Run "npm run generate-manifest" to generate the image manifest file.'
        },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to read image manifest',
        details: error instanceof Error ? error.message : String(error)
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  }
}

// Add revalidation endpoint for manifest cache
export async function POST() {
  try {
    const { revalidateTag } = await import('next/cache');
    await revalidateTag('manifest');
    
    return NextResponse.json({ 
      message: 'Manifest cache revalidated successfully' 
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to revalidate manifest cache' },
      { status: 500 }
    );
  }
} 