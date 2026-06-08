import AsyncStorage from '@react-native-async-storage/async-storage';
import errorLogger from './errorLogger';

const STORAGE_KEYS = {
  FAVORITES: '@blog_app_favorites',
  THEME: '@blog_app_theme',
};

/**
 * AsyncStorage Service
 * Handles persistent data storage and retrieval
 */
class StorageService {
  // Favorites Management
  async saveFavorites(favorites) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites)
      );
      errorLogger.info('Favorites saved successfully', { count: favorites.length });
      return true;
    } catch (error) {
      errorLogger.log(error, { action: 'saveFavorites' });
      return false;
    }
  }

  async getFavorites() {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (favorites) {
        const parsed = JSON.parse(favorites);
        errorLogger.info('Favorites loaded', { count: parsed.length });
        return parsed;
      }
      return [];
    } catch (error) {
      errorLogger.log(error, { action: 'getFavorites' });
      return [];
    }
  }

  async clearFavorites() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
      errorLogger.info('Favorites cleared');
      return true;
    } catch (error) {
      errorLogger.log(error, { action: 'clearFavorites' });
      return false;
    }
  }

  // Theme Management
  async saveTheme(theme) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
      errorLogger.info('Theme preference saved', { theme });
      return true;
    } catch (error) {
      errorLogger.log(error, { action: 'saveTheme' });
      return false;
    }
  }

  async getTheme() {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (theme) {
        errorLogger.info('Theme preference loaded', { theme });
        return theme;
      }
      return null;
    } catch (error) {
      errorLogger.log(error, { action: 'getTheme' });
      return null;
    }
  }

  // Utility: Clear all data
  async clearAll() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
      await AsyncStorage.removeItem(STORAGE_KEYS.THEME);
      errorLogger.info('All storage cleared');
      return true;
    } catch (error) {
      errorLogger.log(error, { action: 'clearAll' });
      return false;
    }
  }
}

export default new StorageService();
