const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Reset require cache to avoid circular dependency issues
config.transformer = {
  ...config.transformer,
  allowOptionalDependencies: true,
};

module.exports = config;
