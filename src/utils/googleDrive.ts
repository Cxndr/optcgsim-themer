import { google } from 'googleapis';
import { ThemeImage } from './imageSet';

export interface GoogleDriveFile {
  id: string;
  name: string;
  parents?: string[];
  mimeType: string;
  webViewLink?: string;
}

// Initialize Google Drive API
function initializeDriveAPI() {
  let auth;
  
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    // Production: Use JSON content from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
  } else {
    // Development: Use local service account file
    auth = new google.auth.GoogleAuth({
      keyFile: './google-service-account.json',
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
  }

  return google.drive({ version: 'v3', auth });
}

// Convert Google Drive file ID to thumbnail/display URL (works in browsers)
export function getDisplayImageUrl(fileId: string): string {
  // Use the thumbnail format that works for direct image loading in browsers
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
}

// Convert Google Drive file ID to direct download URL (for Jimp processing)
export function getDownloadImageUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Alternative: Get a direct image blob URL through the API
export async function getImageDataUrl(fileId: string): Promise<string> {
  try {
    const drive = initializeDriveAPI();
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    }, {
      responseType: 'arraybuffer',
    });

    // Convert ArrayBuffer to base64 data URL
    const buffer = Buffer.from(response.data as ArrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = await getMimeType(fileId);
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error fetching image data:', error);
    throw error;
  }
}

// Helper function to get file mime type
async function getMimeType(fileId: string): Promise<string> {
  try {
    const drive = initializeDriveAPI();
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'mimeType',
    });
    return response.data.mimeType || 'image/jpeg';
  } catch (error) {
    console.error('Error fetching mime type:', error);
    return 'image/jpeg'; // fallback
  }
}

// Lightweight function to get just file metadata (fast)
export async function getImageMetadataFromGoogleDrive(folderId: string): Promise<ThemeImage[]> {
  const drive = initializeDriveAPI();
  const images: ThemeImage[] = [];

  async function getAllFiles(parentId: string, pathPrefix: string = ''): Promise<void> {
    try {
      const response = await drive.files.list({
        q: `'${parentId}' in parents and trashed=false`,
        fields: 'files(id, name, parents, mimeType)',
        pageSize: 1000,
      });

      const files = response.data.files || [];

      for (const file of files) {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          // Recursively process subfolders
          await getAllFiles(file.id!, `${pathPrefix}${file.name}/`);
        } else if (file.mimeType?.startsWith('image/')) {
          // Process image files - use display URL for thumbnails
          const imageName = pathPrefix + file.name!.replace(/\.[^/.]+$/, ''); // Remove extension
          
          images.push({
            name: imageName,
            src: getDisplayImageUrl(file.id!), // Use display URL for thumbnails
          });
        }
      }
    } catch (error) {
      console.error('Error fetching files from Google Drive:', error);
      throw error;
    }
  }

  await getAllFiles(folderId);
  
  // Sort images by name
  images.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  
  return images;
}

// Original function for backward compatibility - now uses metadata approach
export async function getImagesFromGoogleDrive(folderId: string): Promise<ThemeImage[]> {
  // For the main listing, always use the fast metadata approach
  return await getImageMetadataFromGoogleDrive(folderId);
}

// Alternative method if you prefer to store the folder structure in env vars
export async function getImagesFromSpecificFolders(folderMappings: Record<string, string>): Promise<ThemeImage[]> {
  const drive = initializeDriveAPI();
  const images: ThemeImage[] = [];

  for (const [folderName, folderId] of Object.entries(folderMappings)) {
    try {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
        fields: 'files(id, name)',
        pageSize: 1000,
      });

      const files = response.data.files || [];

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        
        images.push({
          name: `${folderName}-${file.name?.replace(/\.[^/.]+$/, '') || index}`,
          src: getDisplayImageUrl(file.id!), // Use display URL
        });
      }
    } catch (error) {
      console.error(`Error fetching files from folder ${folderName}:`, error);
    }
  }

  images.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return images;
} 