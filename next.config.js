/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'htjtgyjywrxfslkgdwvb.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
    domains: ['via.placeholder.com'],
  },
};

module.exports = nextConfig;
