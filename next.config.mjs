/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com']
  },
  swcMinify: false, // switches to tensor minification - bug regarding jimp and nextjs: https://github.com/jimp-dev/jimp/issues/1344
};



export default nextConfig;

