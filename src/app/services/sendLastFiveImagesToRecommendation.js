import axios from "axios";

export const sendLastFiveImagesToRecommendation = async (userId) => {
  try {
    // Récupérer les favoris de l'utilisateur
    const response = await axios.get(`http://localhost:5001/users/${userId}/favorites`);

    if (response.status === 200) {
      // Trier les favoris par date et récupérer les 5 derniers
      const lastFiveFavorites = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

      const recommendations = [];

      for (const favorite of lastFiveFavorites) {
        // Convertir Base64 en fichier Blob
        const byteCharacters = atob(favorite.imageBase64);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const imageBlob = new Blob([byteArray], { type: "image/jpeg" });

        // Créer un FormData pour envoyer l'image
        const formData = new FormData();
        formData.append("image", imageBlob, "temp_image.jpg");

        // Appeler l'API de recommandation pour chaque image
        const recommendResponse = await axios.post("http://localhost:5003/recommend", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (recommendResponse.status === 200) {
          recommendations.push({
            imageId: favorite.imageId,
            recommendations: recommendResponse.data.recommendations,
          });
        }
      }

      return recommendations;
    } else {
      console.error(`Erreur lors de la récupération des favoris : ${response.statusText}`);
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
    return [];
  }
};
