/*'use client';

/*const RecommendedDestinations = ({ images }) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-5 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid rounded-lg  overflow-hidden relative group"
        >
          <img
            src={image}
            alt={`destination-${index}`}
            loading="lazy"
            className="w-full object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
            style={{
              height: `${200 + (index % 3) * 100}px`, // Hauteurs variables entre 200px, 300px, et 400px
            }}
          />
          {/* Bouton d'ajout visible au clic *///}
          /*
        </div>
      ))}
    </div>
  );
};


export default RecommendedDestinations;*/
/*'use client';

import React, { useState } from "react";
import { Upload, Heart } from 'lucide-react';
import handleAddToFavorites from "../services/handleAddToFavorites";

const RecommendedDestinations = ({ images, userId }) => {
  const [clickedIndices, setClickedIndices] = useState([]);

  const handleFavoriteClick = async (index, image) => {
    const action = clickedIndices.includes(index) ? "remove" : "add";

    try {
      await handleAddToFavorites(userId, image, action); // Appel du service
      setClickedIndices((prev) =>
        action === "add" ? [...prev, index] : prev.filter((i) => i !== index)
      );
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris :", error);
    }
  };

  return (
    <div className="columns-2 md:columns-3 lg:columns-5 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid rounded-lg overflow-hidden relative group"
        >
          <img
            src={image}
            alt={`destination-${index}`}
            loading="lazy"
            className="w-full object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
            style={{
              height: `${200 + (index % 3) * 100}px`,
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleFavoriteClick(index, image)}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                {clickedIndices.includes(index) ? (
                  <Heart className="w-6 h-6 text-red-700 fill-red-700" />
                ) : (
                  <Heart className="w-6 h-6 text-red-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

 export default RecommendedDestinations; 

*/

/////////////////////////////////////////////////////

'use client';

import React, { useState } from "react";
import { Upload, Heart } from 'lucide-react';
import handleAddToFavorites from "../services/handleAddToFavorites";

const RecommendedDestinations = ({ images, userId }) => {
  //Modification : stocker les objets avec l'ID au lieu de simples indices
  const [favorites, setFavorites] = useState({});

  const handleFavoriteClick = async (index, image) => {
    // Vérifier si l'image est déjà en favoris
    const isInFavorites = favorites[index];
    const action = isInFavorites ? "remove" : "add";
    
    try {
      const result = await handleAddToFavorites(userId, 
        isInFavorites ? { ...image, imageId: favorites[index].imageId } : image, 
        action
      );
      
      if (result) {
        setFavorites(prev => {
          if (action === "add") {
            // Stocker l'ID retourné par le serveur avec l'index
            return { ...prev, [index]: { imageId: result.imageId } };
          } else {
            // Supprimer l'entrée des favoris
            const newFavorites = { ...prev };
            delete newFavorites[index];
            return newFavorites;
          }
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="columns-2 md:columns-3 lg:columns-5 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid rounded-lg overflow-hidden relative group"
        >
          <img
            src={image}
            alt={`destination-${index}`}
            loading="lazy"
            className="w-full object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
            style={{
              height: `${200 + (index % 3) * 100}px`,
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleFavoriteClick(index, image)}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                {favorites[index] ? (
                  <Heart className="w-6 h-6 text-red-700 fill-red-700" />
                ) : (
                  <Heart className="w-6 h-6 text-red-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

 export default RecommendedDestinations; 

