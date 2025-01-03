'use client';

/*import { useEffect, useState } from "react";
import UserNavbar from "../userNavbar/page";
import RecommendedDestinations from "./RecommendedDestination";
import { sendLastFiveImagesToRecommendation } from "../services/sendLastFiveImagesToRecommendation"; // Importez votre fonction API

export default function UserDashboard() {
  const [destinationImages, setDestinationImages] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendations = await sendLastFiveImagesToRecommendation("user_001");
        console.log(recommendations);
        // Extraire les filenames recommandés et les mapper aux chemins locaux
        const recommendedImages = recommendations.flatMap(item =>
          item.recommendations.map(rec => `images/${rec.filename}`)
        );

        setDestinationImages(recommendedImages);
      } catch (error) {
        console.error("Erreur lors de la récupération des recommandations :", error);
        setDestinationImages([]); // En cas d'erreur, affichez une liste vide
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <>
      {/* Barre de Navigation *///}
      /*<UserNavbar />

      {/* Contenu Principal *///}
      //<main className="backdrop-blur-md min-h-screen p-6">
        //<RecommendedDestinations userId="user_001" images={destinationImages} />
      //</main>
    //</>
  //);
//}

/*import { useEffect, useState } from "react";
import UserNavbar from "../userNavbar/page";
import RecommendedDestinations from "./RecommendedDestination";
import { sendLastFiveImagesToRecommendation } from "../services/sendLastFiveImagesToRecommendation";

export default function UserDashboard({ recommendations }) {
  const [destinationImages, setDestinationImages] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendations = await sendLastFiveImagesToRecommendation("user_001");
        const recommendedImages = recommendations.flatMap(item =>
          item.recommendations.map(rec => `images/${rec.filename}`)
        );
        setDestinationImages(recommendedImages);
      } catch (error) {
        console.error("Erreur lors de la récupération des recommandations :", error);
        setDestinationImages([]);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <>
      <UserNavbar />
      <main className="backdrop-blur-md min-h-screen p-6">
        <RecommendedDestinations userId="user_001" images={destinationImages} />
        {recommendations && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">Recommended Images</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {recommendations.map((rec, index) => (
                <img
                  key={index}
                  src={`images/${rec.filename}`}
                  alt={`Recommended ${index}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}*/
'use client';

import { useState, useEffect, useContext } from "react";
import UserNavbar from "../userNavbar/page";
import RecommendedDestinations from "./RecommendedDestination";
import { sendLastFiveImagesToRecommendation } from "../services/sendLastFiveImagesToRecommendation";
import { RecommendationsContext } from '../context/RecommendationsContext';

export default function UserDashboard() {
  const { generatedImageRecommendations } = useContext(RecommendationsContext);
  const [favoriteRecommendations, setFavoriteRecommendations] = useState([]);

  // Charger les recommandations basées sur les favoris
  useEffect(() => {
    const fetchFavoriteRecommendations = async () => {
      try {
        const recommendations = await sendLastFiveImagesToRecommendation("user_001");
        const recommendedImages = recommendations.flatMap(item =>
          item.recommendations.map(rec => `images/${rec.filename}`)
        );
        setFavoriteRecommendations(recommendedImages);
      } catch (error) {
        console.error("Erreur lors de la récupération des recommandations :", error);
        setFavoriteRecommendations([]);
      }
    };

    fetchFavoriteRecommendations();
  }, []);

  // Combiner les images des favoris et de la génération
  const destinationImages = [...generatedImageRecommendations, ...favoriteRecommendations];

  return (
    <>
      {/* Barre de Navigation */}
      <UserNavbar />

      {/* Contenu Principal */}
      <main className="backdrop-blur-md min-h-screen p-6">
        <RecommendedDestinations userId="user_001" images={destinationImages} />
      </main>
    </>
  );
}