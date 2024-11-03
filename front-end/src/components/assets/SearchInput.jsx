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

  // Mapping des types de recherche en français
  const searchTypes = {
    'users': 'Utilisateurs',
    'schools': 'Écoles',
    'publications': 'Publications',
    'events': 'Événements',
    'promotions': 'Promotions'
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Barre de recherche sans bordure bleue au focus */}
      <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 
                      hover:border-green-400 focus-within:border-green-400 
                      focus-within:ring-4 focus-within:ring-green-50 
                      transition-all duration-300">
        <IoMdSearch
          className="ml-3 text-gray-400 group-hover:text-green-500"
          size={20}
          onClick={handleIconClick}
        />
        <input
          type="text"
          ref={inputRef}
          className="w-full px-3 py-2.5 bg-transparent text-sm text-gray-600 
                     placeholder-gray-400 focus:outline-none border-none
                     focus:ring-0 focus:ring-offset-0"
          placeholder={`Rechercher ${searchType ? searchTypes[searchType].toLowerCase() : '...'}`}
          value={query}
          onChange={handleInputChange}
          onClick={() => setIsSearchOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current.focus();
            }}
            className="p-2 hover:text-green-500 transition-colors mr-1"
          >
            <MdClose size={18} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl 
                        border-2 border-gray-200 shadow-lg overflow-hidden
                        transform origin-top transition-all duration-300">
          {/* En-tête du dropdown */}
          {query && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r 
                           from-gray-50 to-white border-b">
              <span className="text-sm font-medium text-gray-700">
                Résultats de recherche
              </span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                {results.length} résultat(s)
              </span>
            </div>
          )}

          {/* Options de recherche ou résultats */}
          <div className="p-2">
            {!query ? (
              <div className="space-y-1">
                {Object.entries(searchTypes).map(([type, label]) => (
                  <label key={type} 
                         className={`flex items-center p-2.5 rounded-xl cursor-pointer
                                   transition-all duration-300 
                                   ${searchType === type 
                                     ? 'bg-green-50 border-2 border-green-400' 
                                     : 'hover:bg-gray-50 border-2 border-transparent'
                                   }`}>
                    <input
                      type="radio"
                      name="searchType"
                      value={type}
                      checked={searchType === type}
                      onChange={() => handleSearchTypeChange(type)}
                      className="w-4 h-4 text-green-600 border-gray-300 
                               focus:ring-green-500 focus:ring-offset-0"
                    />
                    <span className={`ml-3 text-sm font-medium transition-colors
                                    ${searchType === type ? 'text-green-700' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <SearchResults searchType={searchType} results={results} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}








