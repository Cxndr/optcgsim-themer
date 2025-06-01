import { NextResponse } from 'next/server';
import { getImageMetadataFromGoogleDrive } from '@/utils/googleDrive';
import { ThemeImage } from '@/utils/imageSet';

// Cache for storing image metadata
let imageCache: { data: ThemeImage[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  try {
    const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    if (!mainFolderId) {
      return NextResponse.json(
        { error: 'GOOGLE_DRIVE_FOLDER_ID environment variable is not set' },
        { status: 500 }
      );
    }

    // Check if we have cached data that's still valid
    if (imageCache && (Date.now() - imageCache.timestamp) < CACHE_DURATION) {
      console.log(`Returning cached metadata for ${imageCache.data.length} images`);
      return NextResponse.json(imageCache.data);
    }

    console.log('Fetching fresh image metadata from Google Drive...');
    
    // Use fast metadata-only approach - no image data processing
    const images = await getImageMetadataFromGoogleDrive(mainFolderId);
    
    // Cache the results
    imageCache = {
      data: images,
      timestamp: Date.now()
    };
    
    console.log(`Fetched and cached metadata for ${images.length} images from Google Drive`);
    
    // Set cache headers for the client
    const response = NextResponse.json(images);
    response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes client cache
    
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