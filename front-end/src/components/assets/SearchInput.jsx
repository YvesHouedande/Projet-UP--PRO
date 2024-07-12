import React, {useRef, useState } from 'react'
import { IoMdSearch } from "react-icons/io";


export default function SearchInput() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const inputRef = useRef(null);

    const handleIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative flex items-center md:w-full border-green-400 border-solid border-2 rounded-full transition-all duration-300 ease-in-out">
        <IoMdSearch
        className="text-black ml-3 cursor-pointer"
        size={30}
        onClick={handleIconClick}
        />
        <input
        type="text"
        ref={inputRef}
        className={`text-black px-4 py-2 focus:ring-0 border-none bg-transparent transition-opacity duration-500 ease-in-out ${isSearchOpen ? 'opacity-100 w-48' : 'opacity-0 w-0'} md:w-full md:opacity-100`}
        placeholder="Recherche..."
        />
    </div>
  )
}
