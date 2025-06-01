// Helper function to convert Google Drive URLs to Jimp-compatible format
export async function getJimpCompatibleUrl(googleDriveUrl: string): Promise<string> {
  try {
    // Extract file ID from different Google Drive URL formats
    let fileId: string | null = null;
    
    // Format 1: https://drive.google.com/uc?export=view&id=FILE_ID
    const exportViewMatch = googleDriveUrl.match(/[?&]id=([^&]+)/);
    if (exportViewMatch) {
      fileId = exportViewMatch[1];
    }
    
    // Format 2: https://lh3.googleusercontent.com/d/FILE_ID (with optional parameters)
    const googleUserContentMatch = googleDriveUrl.match(/\/d\/([^/?=]+)/);
    if (googleUserContentMatch) {
      fileId = googleUserContentMatch[1];
    }
    
    if (!fileId) {
      throw new Error('Could not extract file ID from Google Drive URL');
    }
    
    console.log('🔍 Extracted file ID:', fileId, 'from URL:', googleDriveUrl);
    
    // Use our API to get the image data as base64
    const response = await fetch(`/api/images/${fileId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const { dataUrl } = await response.json();
    return dataUrl;
    
  } catch (error) {
    console.error('Error converting Google Drive URL for Jimp:', error);
    throw error;
  }
}

// Check if a URL is a Google Drive URL
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('googleusercontent.com');
} 