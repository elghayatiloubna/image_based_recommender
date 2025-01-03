'use client';
import { useState } from 'react';
import ImageGeneratorAPI from './ImageGeneratorAPI';

export default function GeneratedImage({ onSubmitRecommendations }) {
  const [isOpen, setIsOpen] = useState(false); // Controls the modal visibility
  const [description, setDescription] = useState(''); // User's input description
  const [generatedImage, setGeneratedImage] = useState(''); // Holds the generated image

  // Callback when the image is generated
  const handleImageGenerated = (imageUrl) => {
    setGeneratedImage(imageUrl);
  };

  const handleSubmit = () => {
    // Sends the image to the parent for recommendations
    onSubmitRecommendations(generatedImage);
    setIsOpen(false);
    setGeneratedImage('');
    setDescription('');
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Image
      </button>

      {/* Modal window */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Describe the Image</h2>

            {/* Input for description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description here..."
              className="w-full p-2 border rounded mb-4"
            ></textarea>

            {/* API Component for generating image */}
            <ImageGeneratorAPI 
              description={description} 
              onImageGenerated={handleImageGenerated} 
            />

            {/* Display generated image */}
            {generatedImage && (
              <div className="text-center mb-4">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-40 object-cover rounded"
                />
              </div>
            )}

            {/* Submit button */}
            {generatedImage && (
              <button 
                onClick={handleSubmit} 
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
