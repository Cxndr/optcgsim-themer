/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'drive.google.com', 'googleusercontent.com', 'lh3.googleusercontent.com'],
    unoptimized: true, // Disable image optimization until usage reset
  },
  // Note: swcMinify is deprecated in Next.js 13+ and removed in Next.js 15
  // SWC minification is now enabled by default
};

export default nextConfig;

