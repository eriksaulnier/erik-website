const path = require('path')
const withPlugins = require('next-compose-plugins')

module.exports = withPlugins([], {
  target: 'serverless',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  }
})