import { NextRequest, NextResponse } from 'next/server';
import { getImageDataUrl } from '@/utils/googleDrive';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Get the image as base64 data URL for Jimp processing
    const dataUrl = await getImageDataUrl(fileId);
    
    return NextResponse.json({ dataUrl }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes cache
      },
    });
    
  } catch (error) {
    console.error('Error fetching image data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch image data' 
    }, { status: 500 });
  }
} 