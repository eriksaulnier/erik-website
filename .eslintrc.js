module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    quotes: [2, 'single', { 'avoidEscape': true }],
    indent: ['error', 2],
    semi: ['error', 'always'],
  },
  ignorePatterns: ['tina/__generated__'],
  overrides: [
    {
      files: ['*.js'],
      excludedFiles: [],
    }
  ],
};
