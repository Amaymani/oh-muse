/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'ohmuse-pohsts.s3.ap-south-1.amazonaws.com',
      port: '',
      pathname: '/pohsts/**',
    }],
  },
};

export default nextConfig;
