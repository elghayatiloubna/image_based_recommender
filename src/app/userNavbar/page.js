
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GenerateImageSection from './generateImageSection';
import UploadImageSection from './uploadImageSection';
import FavoritesGrid from '../userDashboard/favoritesPage/page';

export default function UserNavbar() {
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isUploadSectionVisible, setIsUploadSectionVisible] = useState(false);

  const toggleSection = () => {
    setIsSectionVisible(!isSectionVisible); // Affiche ou cache la "fenêtre"
  };
  const toggleUploadSection = () => {
    setIsUploadSectionVisible(!isUploadSectionVisible); // Affiche ou cache la section d'upload
  };
  return (
    <div /*class="bg-[url('/nature.jpg')]"*/ className="relative ">
      {/* Barre de Navigation */}
      <nav className="border-none flex justify-between items-center p-2 backdrop-blur-md">
        {/* Nom de l'application */}
        <div className=" font-mono italic px-10 text-xl font-bold text-sky-500">wanderLens</div>
 
        {/* Boutons au milieu */ }
        <div className="hidden md:flex gap-8">
          <button
            onClick={toggleUploadSection}
            className="px-8 py-1 bg-sky-500 backdrop-blur-md rounded-full text-white hover:bg-sky-600"
          >
            Upload Image
          </button>
          <button
            onClick={toggleSection}  //Affiche la fenêtre flottante
            className="px-8 py-1 bg-sky-500 backdrop-blur-md rounded-full text-white hover:bg-blue-600"
          >
            Generate Image
          </button>
        </div>

        {/* Section Droite */ }
        <div className="flex items-center gap-6">
          <Link
            href="/preferred-destinations"
            className=" px-8 py-1 bg-sky-300 rounded-full text-white hover:bg-blue-600"
          >
            My favorites
          </Link>

          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
            <Link href="/profile" className="text-sm font-bold">
              P
            </Link>
          </div>
        </div>
      </nav>

      {/* Fenêtre flottante : Génération d'image */ }
      {isSectionVisible && (
  <div className="
      fixed top-20 left-1/2 transform -translate-x-1/2 
     w-[70%] bg-white shadow-lg rounded-lg p-6 z-50
    ">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-700">Image generator</h2>
      <button
        onClick={toggleSection}
        className="text-red-500 hover:text-red-700 font-bold"
      >
        X
      </button>
    </div>
    {/* Contenu de la section */ }
    <GenerateImageSection />
    
  </div>
  
)}


{isUploadSectionVisible && (
        <div className="fixed left-1/2 transform -translate-x-1/2 w-[40%] bg-white shadow-lg rounded-lg p-6 z-50">
          <div className="flex justify-between items-center ">
            <h2 className="text-xl font-bold text-gray-700"></h2>
            <button
              onClick={toggleUploadSection} // Ferme la fenêtre
              className="text-red-500 hover:text-red-700 font-bold"
            >
              X
            </button>
          </div>
          {/* Composant UploadImageSection */}
          <UploadImageSection />
        </div>
      )}

    </div>
  );
}




