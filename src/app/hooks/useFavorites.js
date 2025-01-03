import { useState, useEffect } from 'react';
import { loadUserFavorites, handleFavorites } from '../services/favoritesService';

export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const data = await loadUserFavorites(userId);
        setFavorites(data.favorites);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const toggleFavorite = async (image) => {
    const isFavorite = favorites.some(fav => fav.imageId === image.id);
    const action = isFavorite ? "remove" : "add";

    try {
      await handleFavorites(userId, image.id, action);
      
      if (action === "add") {
        setFavorites(prev => [...prev, { imageId: image.id, image: image }]);
      } else {
        setFavorites(prev => prev.filter(fav => fav.imageId !== image.id));
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const isFavorite = (imageId) => {
    return favorites.some(fav => fav.imageId === imageId);
  };

  return {
    favorites,
    isLoading,
    error,
    toggleFavorite,
    isFavorite
  };
};