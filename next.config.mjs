/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'down-id.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'down-tx-id.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cf.shopee.co.id',
      },
    ],
  },
};

export default nextConfig;
