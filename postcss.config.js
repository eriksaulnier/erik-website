module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3,
        features: {
          'custom-properties': false
        }
      }
    ],
    ...(process.env.NODE_ENV === 'production'
      ? [
        '@fullhuman/postcss-purgecss',
        {
          content: [
            './components/**/*.js',
            './pages/**/*.js'
          ],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
        }
      ]
      : [])
  ]
}