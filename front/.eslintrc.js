module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    curly: ['warn', 'multi-line'],
  },
  overrides: [
    {
      files: ['.eslintrc.js', 'jest.setup.js', 'jest.config.js', 'babel.config.js', 'index.js'],
      parserOptions: {
        requireConfigFile: false,
      },
    },
  ],
};
