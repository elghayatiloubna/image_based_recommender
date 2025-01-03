'use client';

import { createContext, useState } from 'react';

export const RecommendationsContext = createContext();

export const RecommendationsProvider = ({ children }) => {
  const [generatedImageRecommendations, setGeneratedImageRecommendations] = useState([]);

  return (
    <RecommendationsContext.Provider value={{ generatedImageRecommendations, setGeneratedImageRecommendations }}>
      {children}
    </RecommendationsContext.Provider>
  );
};