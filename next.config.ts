const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'https://pestonuts.ir/bk/uploads/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://pestonuts.ir/bk/api/:path*',
      },
    ];
  },
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'pestonuts.ir/bk',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'pestonuts.ir/bk',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;