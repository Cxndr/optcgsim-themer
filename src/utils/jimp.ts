/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Simple approach: keep default Jimp for now, add webp to worker
export const { Jimp } = require('jimp');

// Also export a webp-enabled version for when we can use it
let webpJimp: any = null;

export const getWebpJimp = async () => {
  if (!webpJimp) {
    try {
      const { createJimp } = await import("@jimp/core");
      const { defaultFormats, defaultPlugins } = await import("jimp");
      const webp = await import('@jimp/wasm-webp');
      
      console.log('🔄 Loading Jimp with WebP support...');
      webpJimp = createJimp({
        formats: [...defaultFormats, webp.default],
        plugins: defaultPlugins,
      });
      console.log('✅ Jimp with WebP support loaded!');
    } catch (error) {
      console.warn('⚠️ Failed to load WebP support, using default Jimp:', error);
      webpJimp = Jimp;
    }
  }
  return webpJimp;
};

// Re-export types and other utilities from jimp for compatibility
export {
  intToRGBA,
  rgbaToInt,
  type JimpInstance
} from 'jimp';

// Export the custom Jimp as default
export default Jimp; 