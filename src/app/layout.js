'use client'; // Ajoutez cette directive si vous utilisez des hooks React

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./navbar/layout"; // Ajustez le chemin en fonction de votre structure de dossier
import { RecommendationsProvider } from './context/RecommendationsContext'; // Importez le contexte

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Ajoutez la Navbar ici */}
        
        
        {/* Enveloppez children avec RecommendationsProvider */}
        <RecommendationsProvider>
          {children} {/* Tout le contenu des autres pages */}
        </RecommendationsProvider>
      </body>
    </html>
  );
}