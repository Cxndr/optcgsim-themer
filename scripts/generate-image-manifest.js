require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configure Google Drive API
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

const drive = google.drive({ version: 'v3', auth });

function getDisplayImageUrl(fileId) {
  // Use the export=view format for publicly shared files
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

async function generateImageManifest() {
  try {
    const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    if (!mainFolderId) {
      throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is not set');
    }

    console.log('Generating image manifest...');
    console.log(`Using folder ID: ${mainFolderId}`);
    
    const images = [];

    async function getAllFiles(parentId, pathPrefix = '') {
      const response = await drive.files.list({
        q: `'${parentId}' in parents and trashed=false`,
        fields: 'files(id, name, parents, mimeType)',
        pageSize: 1000,
      });

      const files = response.data.files || [];

      for (const file of files) {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          await getAllFiles(file.id, `${pathPrefix}${file.name}/`);
        } else if (file.mimeType?.startsWith('image/')) {
          const imageName = pathPrefix + file.name.replace(/\.[^/.]+$/, '');
          
          images.push({
            name: imageName,
            src: getDisplayImageUrl(file.id),
          });
        }
      }
    }

    await getAllFiles(mainFolderId);
    
    // Sort images by name
    images.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    // Write manifest to public directory
    const manifestPath = path.join(process.cwd(), 'public', 'image-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(images, null, 2));
    
    console.log(`Generated manifest with ${images.length} images`);
    console.log(`Manifest saved to: ${manifestPath}`);
    
  } catch (error) {
    console.error('Error generating image manifest:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  generateImageManifest();
}

module.exports = { generateImageManifest }; 