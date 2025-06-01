import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate Google Drive webhook
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.DRIVE_WEBHOOK_SECRET;
    
    if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the webhook payload
    const payload = await request.json();
    console.log('📥 Google Drive webhook received:', payload);

    // Check if this is about our image folder
    const targetFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (payload.folderId && payload.folderId !== targetFolderId) {
      console.log('🚫 Webhook for different folder, ignoring');
      return NextResponse.json({ message: 'Ignored - different folder' });
    }

    // Trigger GitHub Action workflow to update manifest
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_REPO_OWNER; // e.g., "username"
    const repoName = process.env.GITHUB_REPO_NAME;   // e.g., "optcgsim-themer"

    if (githubToken && repoOwner && repoName) {
      const githubResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/update-manifest.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ref: 'main',
            inputs: {
              trigger: 'google-drive-webhook',
              change_type: payload.changeType || 'unknown'
            }
          })
        }
      );

      if (githubResponse.ok) {
        console.log('✅ Successfully triggered GitHub Action workflow');
        return NextResponse.json({ 
          message: 'Manifest update triggered successfully',
          triggered: true 
        });
      } else {
        console.error('❌ Failed to trigger GitHub Action:', await githubResponse.text());
      }
    }

    return NextResponse.json({ 
      message: 'Webhook received but no action taken',
      triggered: false 
    });

  } catch (error) {
    console.error('Error handling drive webhook:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Google Drive webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
} 