const path = require('path')

module.exports = {
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    }

    return config
  },
  rewrites: async function() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ]
  },
  eslint: {
    dirs: ['pages', 'components', 'lib', 'styles', '.tina', '!.tina/__generated__'],
  },
}