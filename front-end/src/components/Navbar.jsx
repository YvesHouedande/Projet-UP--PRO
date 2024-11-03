import React, { useState } from "react";
import Logo from "../assets/logo.png";
import SearchInput from "./assets/SearchInput";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white border-b-2 border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-3">
          {/* Logo et recherche */}
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            <div className="flex items-center space-x-2">
              <img 
                className="h-10 w-10 object-contain transform hover:rotate-6 transition-transform duration-300" 
                src={Logo} 
                alt="Logo" 
              />
              <span className="hidden md:block font-bold text-green-600">INP-HB Connect</span>
            </div>
            <div className="flex-1">
              <SearchInput />
            </div>
          </div>

          {/* Boutons de connexion/déconnexion */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 
                             rounded-xl border-2 border-green-200 hover:border-green-400 
                             transition-all duration-300 transform hover:scale-105">
              Connexion
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white 
                             bg-gradient-to-r from-green-500 to-green-600
                             rounded-xl hover:from-green-600 hover:to-green-700
                             transition-all duration-300 transform hover:scale-105">
              Déconnexion
            </button>
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* Menu mobile déroulant */}
        <div className={`md:hidden transition-all duration-300 ease-in-out 
                        ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} 
                        overflow-hidden`}>
          <div className="p-3 space-y-2">
            <button className="w-full p-2 text-sm font-medium text-green-600 
                             bg-green-50 rounded-xl border-2 border-green-200 
                             hover:border-green-400 transition-all duration-300">
              Connexion
            </button>
            <button className="w-full p-2 text-sm font-medium text-white 
                             bg-gradient-to-r from-green-500 to-green-600
                             rounded-xl hover:from-green-600 hover:to-green-700 
                             transition-all duration-300">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default Navbar;

