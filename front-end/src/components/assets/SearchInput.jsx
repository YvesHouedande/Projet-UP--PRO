import React, { useRef, useState, useEffect } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import SearchResults from './SearchResults';
import axiosService from '../../helpers/axios';

export default function SearchInput() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState(null); // null, 'users', 'schools', 'publications'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Toggle search input visibility
  const handleIconClick = () => {
    setIsSearchOpen(prevState => !prevState);
    if (!isSearchOpen) {
      inputRef.current.focus();
    }
  };

  // Set search type and keep search box open
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setIsSearchOpen(true); // Keep search box open after selecting the type
  };

  // Perform search
  const handleSearch = async () => {
    if (searchType && query) {
      try {
        let response;
        switch (searchType) {
          case 'users':
            response = await axiosService.get(`/user/?search=${query}`);
            break;
          case 'publications':
            response = await axiosService.get(`/general_post/?search=${query}`);
            break;
          case 'events':
            response = await axiosService.get(`/event/?search=${query}`);
            break;
          case 'promotions':
            // Recherche directe par label
            response = await axiosService.get(`/peer/?search=${query}`);
            break;
          default:
            break;
        }
        
        if (response && response.data) {
          setResults(response.data.results || []);
        }
      } catch (error) {
        console.error(`Error fetching ${searchType} with query ${query}:`, error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  // Handle input change for search query
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    handleSearch(); // Perform search on query change
  };

  // Close search box if clicked outside
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center border-green-400 border-solid border-2 rounded-full transition-all duration-300 ease-in-out md:w-full"
    >
      <IoMdSearch
        className="text-black ml-3 cursor-pointer"
        size={30}
        onClick={handleIconClick}
      />
      <input
        type="text"
        ref={inputRef}
        className={`text-black px-4 py-2 focus:ring-0 border-none bg-transparent transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0'} md:w-full md:opacity-100`}
        placeholder="Recherche..."
        value={query}
        onChange={handleInputChange}
        onClick={() => setIsSearchOpen(true)} // Open search box when input is clicked
      />
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
          {/* Titre des résultats et bouton de fermeture */}
          {query && (
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
              <span className="text-black font-semibold">Résultats de recherche</span>
              <button
                className="text-gray-500"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  inputRef.current.focus();
                }}
              >
                <MdClose size={20} />
              </button>
            </div>
          )}

          {query ? (
            <div className="flex flex-col p-2">
              {/* Show search results */}
              <SearchResults searchType={searchType} results={results} />
            </div>
          ) : (
            <div className="flex flex-col p-2">
              {/* Show search type options */}
              <label className="flex items-center cursor-pointer text-black">
                <input
                  type="radio"
                  name="searchType"
                  value="users"
                  checked={searchType === 'users'}
                  onChange={() => handleSearchTypeChange('users')}
                />
                <span className="ml-2">Utilisateurs</span>
              </label>
              <label className="flex items-center cursor-pointer mt-1 text-black">
                <input
                  type="radio"
                  name="searchType"
                  value="schools"
                  checked={searchType === 'schools'}
                  onChange={() => handleSearchTypeChange('schools')}
                />
                <span className="ml-2">Écoles</span>
              </label>
              <label className="flex items-center cursor-pointer mt-1 text-black">
                <input
                  type="radio"
                  name="searchType"
                  value="publications"
                  checked={searchType === 'publications'}
                  onChange={() => handleSearchTypeChange('publications')}
                />
                <span className="ml-2">Publications</span>
              </label>
              <label className="flex items-center cursor-pointer mt-1 text-black">
                <input
                  type="radio"
                  name="searchType"
                  value="events"
                  checked={searchType === 'events'}
                  onChange={() => handleSearchTypeChange('events')}
                />
                <span className="ml-2">Événements</span>
              </label>
              <label className="flex items-center cursor-pointer mt-1 text-black">
                <input
                  type="radio"
                  name="searchType"
                  value="promotions"
                  checked={searchType === 'promotions'}
                  onChange={() => handleSearchTypeChange('promotions')}
                />
                <span className="ml-2">Promotions</span>
              </label>
            </div>
          )}
        </div>
      )}

    </div>
  );
}








