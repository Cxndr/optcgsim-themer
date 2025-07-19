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
  // Use the thumbnail format that works for direct image loading in browsers
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
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

    // Optimized approach: batch processing with parallel requests
    console.log('🚀 Starting optimized Google Drive fetch for manifest...');
    
    const allFiles = new Map();
    const foldersToProcess = [mainFolderId];
    const processedFolders = new Set();
    
    while (foldersToProcess.length > 0) {
      const currentFolders = foldersToProcess.splice(0, 10); // Process up to 10 folders at once
      
      // Create parallel requests for current batch of folders
      const batchPromises = currentFolders.map(async (folderToProcess) => {
        if (processedFolders.has(folderToProcess)) return [];
        processedFolders.add(folderToProcess);
        
        try {
          const response = await drive.files.list({
            q: `'${folderToProcess}' in parents and trashed=false`,
            fields: 'files(id, name, parents, mimeType)',
            pageSize: 1000,
          });
          
          return response.data.files || [];
        } catch (error) {
          console.error(`Error fetching files from folder ${folderToProcess}:`, error);
          return [];
        }
      });
      
      // Wait for all requests in this batch to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Process the results
      for (const files of batchResults) {
        for (const file of files) {
          allFiles.set(file.id, file);
          
          // If it's a folder, add it to the queue for processing
          if (file.mimeType === 'application/vnd.google-apps.folder') {
            if (!processedFolders.has(file.id)) {
              foldersToProcess.push(file.id);
            }
          }
        }
      }
    }

    console.log(`📁 Found ${allFiles.size} total files/folders across all nested folders`);
    
    // Build a map of folder IDs to folder names for path reconstruction
    const folderMap = new Map();
    const parentMap = new Map();
    
    // First pass: identify all folders and build parent relationships
    for (const file of allFiles.values()) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        folderMap.set(file.id, file.name);
      }
      
      if (file.parents) {
        parentMap.set(file.id, file.parents);
      }
    }
    
    // Function to build the full path for a file
    const buildPath = (fileId, visited = new Set()) => {
      if (visited.has(fileId)) return ''; // Prevent infinite loops
      visited.add(fileId);
      
      const parents = parentMap.get(fileId);
      if (!parents || parents.length === 0 || parents[0] === mainFolderId) {
        return '';
      }
      
      const parentId = parents[0];
      const parentName = folderMap.get(parentId);
      if (!parentName) return '';
      
      const parentPath = buildPath(parentId, visited);
      return parentPath ? `${parentPath}/${parentName}` : parentName;
    };

    // Second pass: process image files
    let imageCount = 0;
    for (const file of allFiles.values()) {
      if (file.mimeType?.startsWith('image/')) {
        const pathPrefix = buildPath(file.id);
        const imageName = (pathPrefix ? `${pathPrefix}/` : '') + file.name.replace(/\.[^/.]+$/, '');
        
        images.push({
          name: imageName,
          src: getDisplayImageUrl(file.id),
        });
        
        imageCount++;
      }
    }
    
    console.log(`🖼️ Processed ${imageCount} images from ${allFiles.size} total files`);
    
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