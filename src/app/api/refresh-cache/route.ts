import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate request from GitHub Action
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.CACHE_REFRESH_SECRET || process.env.GITHUB_TOKEN;
    
    if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
      console.log('❌ Unauthorized cache refresh attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Cache refresh triggered by GitHub Action');

    // Clear both manifest and Google Drive caches
    await revalidateTag('manifest');
    await revalidateTag('google-drive');
    
    console.log('✅ Cache cleared successfully');
    
    return NextResponse.json({ 
      message: 'Cache refreshed successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error refreshing cache:', error);
    return NextResponse.json({ 
      error: 'Failed to refresh cache',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 