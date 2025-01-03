"use client";

import Navbar from "../navbar/layout";
import ImageUploader from "./ImageUploader"; // Importation du composant ImageUploader

export default function Dashboard() {
  const handleImageSelect = (imageUrl) => {
    console.log("Image sélectionnée :", imageUrl);
    // Tu peux utiliser l'URL ici pour d'autres opérations (ex. envoyer au backend)
  };

  return (
    <div className="h-screen relative">
      <div className="absolute inset-0"></div>
      <div className="relative z-10 text-center text-white flex flex-col justify-center items-center h-full">
        <h1 className="text-4xl md:text-6xl font-bold">Every Image Tells a Story</h1>
        <p className="text-lg mt-4">What’s Your Next Travel Story?</p>

        <div className="flex flex-row mt-8 space-y-4">
          <input
            type="text"
            placeholder="Date"
            className="px-4 py-2 bg-white rounded-md focus:outline-none shadow-md border border-gray-300 text-black"
          />
          {/* Utilisation de ImageUploader */}
          <ImageUploader  onImageSelect={handleImageSelect} />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md">Search</button>
        </div>
      </div>
    </div>
  );
}
