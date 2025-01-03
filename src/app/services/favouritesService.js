// Services liés aux favoris remove or add
export const handleFavorites = async (userId, imageId, action) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          imageId,
          action, // "add" ou "remove"
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la gestion des favoris');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };
  
  export const loadUserFavorites = async (userId) => {
    try {
      const response = await fetch(`/api/favorites/${userId}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des favoris');
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      throw error;
    }
  };