import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import Loading from '../components/assets/Loading';
import NavBox from '../components/assets/NavBox';
import { HiAcademicCap, HiOfficeBuilding, HiCalendar, HiLocationMarker } from 'react-icons/hi';
import { FaSearch } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosService from '../helpers/axios';

const tabs = [
  { id: 'promotions', label: 'Promotions', icon: HiAcademicCap },
  { id: 'services', label: 'Services', icon: HiOfficeBuilding },
];

// Composant carte pour les promotions
const PromoCard = ({ promo }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/peer/${promo.public_id}`)}
      className="flex flex-col h-full bg-white rounded-2xl border-2 border-gray-200 
                hover:border-green-300 overflow-hidden
                shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)]
                hover:shadow-[8px_8px_0px_0px_rgba(34,197,94,0.2)]
                transform hover:-translate-y-1
                transition-all duration-300 cursor-pointer"
    >
      {/* Image de couverture */}
      <div className="h-32 bg-gradient-to-r from-green-400 to-blue-400 relative">
        {promo.cover ? (
          <img 
            src={promo.cover} 
            alt={promo.label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <HiAcademicCap className="text-white text-5xl opacity-50" />
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            {promo.label}
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
            {promo.year}
          </span>
        </div>

        {/* Informations */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <HiLocationMarker className="mr-2" />
            <span className="text-sm">{promo.school_label}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <HiAcademicCap className="mr-2" />
            <span className="text-sm">Filière {promo.study_label}</span>
          </div>
        </div>
      </div>

      {/* Pied de carte */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <button className="w-full py-2 px-4 bg-green-50 text-green-600 
                         rounded-xl font-medium hover:bg-green-100 
                         transition-colors duration-300
                         flex items-center justify-center gap-2">
          <span>Voir la promotion</span>
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
};

export default function Community() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('promotions');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fonction de recherche avec debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems(true);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab]);

  // Fonction pour récupérer les items (promos ou services)
  const fetchItems = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const endpoint = activeTab === 'promotions' ? '/peer/' : '/service/';
      let url = endpoint;
      
      if (searchTerm) {
        url += `?search=${searchTerm}`;
      } else if (!reset && nextUrl) {
        url = nextUrl;
      }

      const response = await axiosService.get(url);
      
      if (reset) {
        setItems(response.data.results);
      } else {
        setItems(prev => [...prev, ...response.data.results]);
      }
      
      setNextUrl(response.data.next);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Changement d'onglet
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm('');
    setItems([]);
    setNextUrl(null);
  };

  // Utilisation de SWR pour la gestion des données
  const { data, error, mutate } = useSWR(
    `/peer/${searchTerm ? `?search=${searchTerm}` : ''}`,
    fetcher
  );

  // Gestion du chargement et des erreurs
  if (error) return <div>Une erreur s'est produite</div>;
  if (!data && !searchTerm) return <Loading />;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Navigation Desktop */}
          <div className="hidden lg:block w-64 min-h-screen sticky top-0 p-4">
            <NavBox />
          </div>

          {/* Contenu principal */}
          <div className="flex-1 px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {/* En-tête avec recherche */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 
                            shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)] mb-6">
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Communauté INP-HB
                  </h1>
                  
                  {/* Barre de recherche */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`Rechercher des ${activeTab === 'promotions' ? 'promotions' : 'services'}...`}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200
                               focus:border-green-400 focus:ring-4 focus:ring-green-50
                               transition-all duration-300"
                    />
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Onglets */}
                <div className="border-t-2 border-gray-200">
                  <div className="flex">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
                          flex items-center gap-2 px-6 py-4 font-medium text-sm
                          transition-all duration-200
                          ${activeTab === tab.id 
                            ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                          }
                        `}
                      >
                        <tab.icon className="text-xl" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grille des promotions */}
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.results.map(promo => (
                    <PromoCard key={promo.public_id} promo={promo} />
                  ))}
                </div>

                {/* Message si aucun résultat */}
                {data?.results.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune promotion trouvée
                    {searchTerm && ` pour la recherche "${searchTerm}"`}
                  </div>
                )}

                {/* Indicateur de chargement */}
                {loading && <Loading />}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <NavBox />
        </div>
      </div>
    </Layout>
  );
} 