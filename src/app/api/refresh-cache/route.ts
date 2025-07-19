import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate request from GitHub Action
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.CACHE_REFRESH_SECRET;
    
    // Log for debugging (without exposing the actual secret)
    console.log('🔐 Webhook authentication check:', {
      hasAuthHeader: !!authHeader,
      hasSecret: !!webhookSecret,
      authHeaderFormat: authHeader ? 'Bearer ***' : 'missing'
    });
    
    if (!webhookSecret) {
      console.log('❌ CACHE_REFRESH_SECRET environment variable not set');
      return NextResponse.json({ 
        error: 'Server configuration error',
        message: 'CACHE_REFRESH_SECRET not configured'
      }, { status: 500 });
    }
    
    if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
      console.log('❌ Unauthorized cache refresh attempt');
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Invalid or missing authorization header'
      }, { status: 401 });
    }

    // Parse request body for additional info
    const body = await request.json().catch(() => ({}));
    console.log('🔄 Cache refresh triggered:', {
      source: body.source || 'unknown',
      imageCount: body.image_count || 'not specified'
    });

    // Clear both manifest and Google Drive caches
    await revalidateTag('manifest');
    await revalidateTag('google-drive');
    
    console.log('✅ Cache cleared successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Cache refreshed successfully',
      timestamp: new Date().toISOString(),
      source: body.source
    });
    
  } catch (error) {
    console.error('❌ Error refreshing cache:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to refresh cache',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 