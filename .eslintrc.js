module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    quotes: [2, 'single', { 'avoidEscape': true }],
    indent: ['error', 2]
  },
  overrides: [
    {
      files: ['*.js'],
      excludedFiles: []
    }
  ]
}
