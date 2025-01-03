/*import axios from "axios";

const handleAddToFavorites = async (userId, image, action) => {
  const url = action === "add"
    ? `http://localhost:5001/users/${userId}/favorites`  // Ajout du userId dans l'URL
    : `http://localhost:5001/users/${userId}/favorites/${image.imageId}`;  // Suppression d'un favori avec imageId

  const formData = new FormData();
  formData.append("user_id", userId);
  

  if (action === "add") {
    // Ajout de l'image seulement pour l'action "add"
    const response = await fetch( image.url || image );
    const blob = await response.blob(); // Conversion en objet Blob
    const file = new File([blob], "destination.jpg", { type: blob.type });
    formData.append("image", file);
    // Add the imageId - generate one or use some unique identifier
    const imageId = `img_${Date.now()}`; // Simple example of generating an ID
    formData.append("imageId", imageId);
       
    
  } else {
    formData.append("image_id", image.imageId); // Supposons que l'image a un ID côté backend
  }
  console.log('FormData envoyé:', formData);


  try {
    const result = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Réponse du serveur :", result.data);
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
    throw error;
  }
};

export default handleAddToFavorites;
*/

import axios from "axios";

const handleAddToFavorites = async (userId, image, action) => {
  // Construire l'URL en fonction de l'action
  const baseUrl = `http://localhost:5001/users/${userId}/favorites`;
  const url = action === "add" 
    ? baseUrl 
    : `${baseUrl}/${image.imageId}`;

  try {
    if (action === "add") {
      // Préparation du FormData pour l'ajout
      const formData = new FormData();
      formData.append("user_id", userId);

      // Gestion de l'image selon son format (URL string ou objet)
      const imageUrl = image.url || image;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "destination.jpg", { type: blob.type });
      formData.append("image", file);

      // Génération et ajout de l'ID unique
      const imageId = `img_${Date.now()}`;
      formData.append("imageId", imageId);

      // Requête POST pour l'ajout
      const result = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Image ajoutée aux favoris:", result.data);
      return { ...result.data, imageId }; // Retourner les données avec l'ID

    } else if (action === "remove") {
      // Requête DELETE pour la suppression
      const result = await axios.delete(url);
      console.log("Image supprimée des favoris:", result.data);
      return result.data;
    }
  } catch (error) {
    console.error("Erreur lors de la gestion des favoris:", error);
    throw error;
  }
};

export default handleAddToFavorites;