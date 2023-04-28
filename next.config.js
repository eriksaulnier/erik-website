const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com`,
        port: '',
        pathname: '/**',
      }
    ]
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    };
    return config;
  },
  rewrites: async function() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ];
  },
  eslint: {
    dirs: ['pages', 'components', 'lib', 'styles', 'tina', '!tina/__generated__'],
  },
});