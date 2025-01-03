'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <div className=" relative bg-fixed flex justify-between items-center p-2 ">
      {/* Section WanderLens */}
      <h1 className="text-xl font-bold text-white">WanderLens</h1>
      
      {/* Section Links avec arrière-plan flou */}
      <nav className=" rounded-full flex gap-4 z-40 bg-black/20 backdrop-blur-md px-8 py-1">
        <Link href="/" className="text-white hover:text-gray-300">
          Home
        </Link>
        <Link href="/services" className="text-white hover:text-gray-300">
          Services
        </Link>
        <Link href="/about" className="text-white hover:text-gray-300">
          About
        </Link>
      </nav>

      {/* Section Login */}
      <button className="text-white font-small text-m bg-black-500 px-8 py-2 rounded-full">Login</button>
    </div> 
  );
}
