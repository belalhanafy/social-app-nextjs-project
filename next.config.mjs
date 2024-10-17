/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'linked-posts.routemisr.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    CI: 'false',
  },
};

export default nextConfig;
