import { useContext ,useState } from 'react';
import { RecommendationsContext } from '../context/RecommendationsContext'; // Ajustez le chemin

const UploadImageSection = () => {
  const { setGeneratedImageRecommendations } = useContext(RecommendationsContext); // Utiliser le contexte
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadSection, setShowUploadSection] = useState(true);

  // Fonction pour gérer la sélection d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Fonction pour gérer le bouton Submit
  const handleSubmit = async () => {
    if (selectedImage) {
      try {
        // Convertir l'image en fichier Blob
        const response = await fetch(selectedImage);
        const blob = await response.blob();

        // Créer un FormData pour envoyer l'image au backend
        const formData = new FormData();
        formData.append('image', blob, 'uploaded_image.jpg');

        // Envoyer l'image à l'API
        const recommendResponse = await axios.post("http://localhost:5003/recommend", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Formater les recommandations pour inclure le chemin des images
        const formattedRecommendations = recommendResponse.data.recommendations.map(rec => `images/${rec.filename}`);

        // Mettre à jour les recommandations via le contexte
        setGeneratedImageRecommendations(formattedRecommendations);

        // Fermer la section d'upload
        setShowUploadSection(false);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        alert("Failed to fetch recommendations. Please try again.");
      }
    }
  };

  // Si la section d'upload est cachée, ne rien afficher
  if (!showUploadSection) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Zone d'upload */}
      <div className="flex justify-center items-center h-[300px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 relative w-full">
        {/* Input file caché */}
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Zone cliquable pour uploader */}
        <label
          htmlFor="fileInput"
          className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
        >
          {/* Si une image est sélectionnée, on l'affiche */}
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="flex flex-col justify-center items-center text-gray-400">
              <span className="text-3xl">🖼️</span>
              <p className="mt-2 text-lg">Click to upload an image</p>
            </div>
          )}
        </label>
      </div>

      {/* Bouton Submit */}
      <button
        onClick={handleSubmit}
        className={`px-6 py-1 bg-sky-500 text-white rounded-lg hover:bg-blue-700 transition duration-300 ${
          !selectedImage ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!selectedImage}
      >
        Get Recommendations
      </button>
    </div>
  );
};

export default UploadImageSection;