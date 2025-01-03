"use client";

import React, { useState } from "react";

export default function ImageUploader({ onImageSelect }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      if (onImageSelect) {
        onImageSelect(imageUrl); // Appelle une fonction callback si fournie
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        className="flex flex-row mt-8 space-y-4"
        onChange={handleImageChange}
      />
      {image && (
        <img
          src={image}
          alt="Preview"
          className="mt-4 rounded-md shadow-md max-w-xs"
        />
      )}
    </div>
  );
}
