import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'image-manifest.json');
    
    // Check if manifest file exists
    if (!fs.existsSync(manifestPath)) {
      return NextResponse.json(
        { 
          error: 'Image manifest not found. Please run "npm run generate-manifest" first.',
          instructions: 'Run "npm run generate-manifest" to generate the image manifest file.'
        },
        { status: 404 }
      );
    }

    // Read the manifest file
    const manifestData = fs.readFileSync(manifestPath, 'utf-8');
    const images = JSON.parse(manifestData);
    
    console.log(`Serving ${images.length} images from static manifest`);
    
    // Set long cache headers since this is a static file
    const response = NextResponse.json(images);
    response.headers.set('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    
    return response;
    
  } catch (error) {
    console.error('Error reading image manifest:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to read image manifest',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 