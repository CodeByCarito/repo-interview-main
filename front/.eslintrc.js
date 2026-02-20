module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    curly: ['warn', 'multi-line'],
  },
  overrides: [
    {
      files: ['jest.setup.js', 'jest.config.js', 'babel.config.js'],
      parserOptions: {
        requireConfigFile: false,
      },
    },
  ],
};
