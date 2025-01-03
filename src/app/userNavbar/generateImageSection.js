import React, { useState, useContext } from 'react';
import ImageGeneratorApi from "../services/ImageGeneratorAPI";
import axios from 'axios';
import { RecommendationsContext } from '../context/RecommendationsContext';

const GenerateImageSection = () => {
  const { setGeneratedImageRecommendations } = useContext(RecommendationsContext);
  const [description, setDescription] = useState("");
  const [season, setSeason] = useState("");
  const [keywords, setKeywords] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGeneratedImageSection, setShowGeneratedImageSection] = useState(true); // Nouvel état

  const seasonOptions = [
    { value: "winter", icon: "❄️", color: "text-blue-500" },
    { value: "summer", icon: "☀️", color: "text-yellow-500" },
    { value: "spring", icon: "🌱", color: "text-green-500" },
    { value: "autumn", icon: "🍂", color: "text-orange-500" }
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim() === "") return;
    setIsLoading(true);
    const generatedImage = await ImageGeneratorApi(description);
    setImageUrl(generatedImage);
    setIsLoading(false);
  };

  const handleRecommendations = async () => {
    if (!imageUrl) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      formData.append('image', blob, 'generated_image.jpg');

      const recommendResponse = await axios.post("http://localhost:5003/recommend", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Formater les recommandations pour inclure le chemin des images
      const formattedRecommendations = recommendResponse.data.recommendations.map(rec => `images/${rec.filename}`);

      // Mettre à jour les recommandations via le contexte
      setGeneratedImageRecommendations(formattedRecommendations);

      // Fermer la section de génération d'images
      setShowGeneratedImageSection(false);
    } catch (error) {
      setError("Failed to fetch recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  // Si la section de génération d'images est cachée, ne rien afficher
  if (!showGeneratedImageSection) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Describe your image"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-black text-xs w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="flex gap-3 justify-between">
              {seasonOptions.map((seasonOption) => (
                <button
                  key={seasonOption.value}
                  type="button"
                  onClick={() => setSeason(seasonOption.value)}
                  className={`
                    flex flex-col items-center p-2 rounded-lg w-1/4
                    ${season === seasonOption.value 
                      ? `${seasonOption.color} bg-opacity-20 border-2 border-blue-300` 
                      : 'text-gray-500 hover:bg-gray-100'}
                  `}
                >
                  <span className="text-xl">{seasonOption.icon}</span>
                  <span className="text-xs capitalize">{seasonOption.value}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Additional keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="text-black w-full p-3 text-xs border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="
                w-full py-1 rounded-lg 
                bg-blue-600 text-white 
                hover:bg-blue-700 
                transition duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isLoading ? "Generating..." : "Create Image"}
            </button>
          </form>
        </div>
        <button
          type="button"
          onClick={handleRecommendations}
          disabled={isLoading || !imageUrl}
          className="
            w-full py-1 mt-2 rounded-lg 
            bg-black/20 text-white 
            hover:bg-black
            transition duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isLoading ? "Fetching Recommendations..." : "Recommendations"}
        </button>
      </div>

      <div className="w-full flex flex-col justify-center items-center">
        {imageUrl ? (
          <div className="w-full space-y-4">
            <div className="border-grey-200 rounded-xl overflow-hidden shadow-lg">
              <img
                src={imageUrl}
                alt="Generated"
                className="w-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        ) : (
          <div className="
            w-full h-[350px] 
            border-4 border-dashed border-blue-200 
            flex flex-col justify-center items-center
            text-gray-400 rounded-xl
          ">
            <span className="text-3xl">🖼️</span>
            <p>Your image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImageSection;