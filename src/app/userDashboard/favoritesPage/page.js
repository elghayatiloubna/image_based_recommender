'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Heart } from 'lucide-react';
import { getFavorites } from '../../services/getFavorites'; // Import de la fonction
import axios from "axios";

const FavoritesGrid = ({ userId }) => { // Recevoir l'ID utilisateur en prop
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Récupération des favoris au montage du composant
    const fetchFavorites = async () => {
      const fetchedFavorites = await getFavorites(userId); // Passez l'ID utilisateur
      setFavorites(fetchedFavorites);
    };
    fetchFavorites();
  }, [userId]); // Effectuer une nouvelle requête si userId change

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//upload the new image to database
const handleImageUpload = async (userId, image) => {
  const formData = new FormData();
  formData.append('image', image);
  const imageId = `img_${Date.now()}`;
  formData.append('imageId', imageId);

  try {
    await axios.post(`http://localhost:5001/users/${userId}/favorites`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Appeler `getFavorites` pour rafraîchir la liste
    const updatedFavorites = await getFavorites(userId);
    setFavorites(updatedFavorites);
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image :', error);
  }
};

  ///////////////////////////////////////////////////////////////////////////////////

  // delete the image from the database when the heart is clicked

  const toggleFavorite = async (userId,favoriteId) => {
    const isCurrentlyFavorite = favorites.some((fav) => fav.id === favoriteId);
  
    if (isCurrentlyFavorite) {
      try {
        const response = await fetch(`http://localhost:5001/users/${userId}/favorites/${favoriteId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // Retirer l'image des favoris
          setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
        } else {
          console.error('Failed to delete favorite');
        }
      } catch (error) {
        console.error('Error deleting favorite:', error);
      }
    }
  };
  
  ////////////////////////////////////////////////////////////
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 font-mono italic px-10  text-sky-500">My Favorites</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Zone d'upload intégrée à la grille */}
        <div
          className={`relative aspect-square rounded-lg overflow-hidden ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border-2 border-dashed">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload('user_001',e.target.files[0])}
            />
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Add new favorite</p>
            <p className="text-xs text-gray-500 mt-1 px-4 text-center">
              {isDragging ? 'Drop here' : 'Click or drag'}
            </p>
          </label>
        </div>

        {/* Grille d'images */}
        {favorites.map(({ id, src }, index) => (
          <div
            key={id} // Utiliser `id` comme clé unique
            className="relative group aspect-square overflow-hidden rounded-lg"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={src}
              alt={`Favorite ${index + 1}`}
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-2 right-2 flex gap-2">
              <button
                   onClick={() => toggleFavorite('user_001',id)}
                   className={`p-2 bg-white/90 rounded-full hover:bg-white transition-colors ${
                     favorites.some((fav) => fav.id === id) ? 'text-red-700 fill-red-700' : ''
                   }`}
                 >
                   <Heart className={`w-6 h-6 ${favorites.some((fav) => fav.id === id) ? 'fill-red-700' : ''}`} />
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesGrid;
