// Fake API qui simule une image générée à partir d'une description
/*const ImageGeneratorApi = async (description) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Retourne une URL d'image simulée avec la description comme paramètre
        const generatedImageUrl = '/Sea.jpg'
        resolve(generatedImageUrl);
      }, 1000); // Simulation d'un délai de 1 seconde
    });
  };
  
  export default ImageGeneratorApi;*/


  import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Remplacez par l'URL de votre backend Flask déployé (par exemple, via Ngrok)

const ImageGeneratorApi = async (description) => {
  try {
    // Envoi de la description au backend Flask
    const response = await axios.post(`${BASE_URL}/generate-image`, { prompt: description });

    // Gestion des erreurs côté backend
    if (response.data.error) {
      throw new Error(response.data.error);
    }

    // Récupération de l'image encodée en Base64 depuis la réponse
    const { image } = response.data;

    // Retourne l'image sous forme d'URL pour l'affichage dans React
    return `data:image/jpeg;base64,${image}`;
  } catch (error) {
    console.error("Erreur lors de la génération de l'image :", error);
    throw error; // Propagation de l'erreur pour gestion dans le composant React
  }
};

export default ImageGeneratorApi;

  