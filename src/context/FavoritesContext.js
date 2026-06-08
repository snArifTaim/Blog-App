import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storageService from '../services/storageService';
import errorLogger from '../services/errorLogger';
import { getPost, updatePostLikes } from '../services/mockDataService';
import eventBus from '../services/eventBus';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const saved = await storageService.getFavorites();
      if (saved && Array.isArray(saved)) {
        setFavoriteIds(saved);
      }
    } catch (error) {
      errorLogger.log(error, { action: 'loadFavorites' });
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleFavorite = useCallback(async (postId) => {
    try {
      const isRemoving = favoriteIds.includes(postId);
      const newFavorites = isRemoving
        ? favoriteIds.filter((id) => id !== postId)
        : [...favoriteIds, postId];

      setFavoriteIds(newFavorites);

      // Persist asynchronously (fire-and-forget with error handling)
      storageService.saveFavorites(newFavorites).catch((error) => {
        errorLogger.log(error, { action: 'toggleFavorite', postId });
      });

      // Optimistically notify listeners with a delta for immediate UI update
      try {
        const delta = isRemoving ? -1 : 1;
        eventBus.emit('postLikesDelta', { id: postId, delta });

        // Update likes in the mock data (fire-and-forget). After persistence
        // emit the canonical value so any out-of-sync clients can reconcile.
        getPost(postId)
          .then((post) => {
            const currentLikes = (post && typeof post.likes === 'number') ? post.likes : 0;
            const newLikes = Math.max(0, currentLikes + delta);
            return updatePostLikes(postId, newLikes).then(() => newLikes);
          })
          .then((newLikes) => {
            eventBus.emit('postLikesUpdated', { id: postId, likes: newLikes });
          })
          .catch((err) => {
            errorLogger.log(err, { action: 'updatePostLikes', postId });
          });
      } catch (err) {
        errorLogger.log(err, { action: 'emitDelta', postId });
      }
    } catch (error) {
      errorLogger.log(error, { action: 'toggleFavorite_root', postId });
    }
  }, [favoriteIds]);

  const isFavorite = useCallback(
    (postId) => favoriteIds.includes(postId),
    [favoriteIds]
  );

  const getFavoriteIds = useCallback(
    () => [...favoriteIds],
    [favoriteIds]
  );

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, toggleFavorite, isFavorite, getFavoriteIds, isLoaded }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
