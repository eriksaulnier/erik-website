const path = require('path')

module.exports = {
  experimental: { scss: true },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}