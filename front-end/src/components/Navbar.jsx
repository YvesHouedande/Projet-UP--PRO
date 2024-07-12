import React, { useState } from "react";
import Logo from "../assets/logo.png";
import SearchInput from "./assets/SearchInput";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="flex flex-wrap items-center justify-between p-2 w-full text-white bg-gray-50">
      <div className="flex items-center space-x-4 w-2/4 ">
        <img className="h-10 w-10 mr-2" src={Logo} alt="Logo" />
        <SearchInput />
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="block md:hidden text-white focus:outline-none my-2"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
          </svg>
        </button>
      </div>
      <ul className={`flex-col md:flex-row py-2 md:flex md:space-x-4 ${!isOpen ? 'hidden' : 'flex'} w-full md:w-auto transition-transform duration-500 ease-in-out transform ${!isOpen ? 'translate-y-0' : 'translate-y-0'}`}>
        <li className="font-bold cursor-pointer w-full md:w-auto bg-green-500 p-2 mb-2 rounded-lg hover:text-white hover:bg-orange-600 text-center transition-all duration-500 ease-in-out">Connexion</li>
        <li className="font-bold cursor-pointer w-full md:w-auto bg-green-500 p-2 mb-2 rounded-lg hover:text-white hover:bg-orange-600 text-center transition-all duration-500 ease-in-out">Deconnexion</li>
      </ul>
    </div>
  );
}

// export default Navbar;

