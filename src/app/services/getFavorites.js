import axios from "axios";

export const getFavorites = async (userId) => {
  try {
    //const response = await axios.get(`/api/users/${userId}/favorites`); // URL adaptée
    const response = await axios.get(`http://localhost:5001/users/user_001/favorites`); // URL adaptée

    if (response.status === 200) {
      // Transformez les données en un format compatible avec le composant
      return response.data.map(item => ({
        id: item.imageId,
        src: `data:image/jpeg;base64,${item.imageBase64}`,
      }));
    } else {
      console.error(`Erreur lors de la récupération des favoris : ${response.statusText}`);
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
    return [];
  }
};
