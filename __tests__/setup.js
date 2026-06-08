/**
 * Jest Setup File
 * Configures test environment and global mocks
 */

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock React Native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock useColorScheme
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: () => 'light',
}));

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
