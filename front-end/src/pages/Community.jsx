import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import Loading from '../components/assets/Loading';
import NavBox from '../components/assets/NavBox';
import { 
  HiAcademicCap, 
  HiOfficeBuilding, 
  HiCalendar, 
  HiDocumentText,
  HiLocationMarker 
} from 'react-icons/hi';
import { FaSearch, FaPlus } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosService from '../helpers/axios';

const tabs = [
  { id: 'promotions', label: 'Promotions', icon: HiAcademicCap },
  { id: 'services', label: 'Services', icon: HiOfficeBuilding },
  { id: 'requests', label: 'Demandes', icon: HiDocumentText },
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

// Nouveau composant pour les services
const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/service/${service.public_id}`)}
      className="flex flex-col h-full bg-white rounded-2xl border-2 border-gray-200 
                hover:border-green-300 overflow-hidden
                shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)]
                hover:shadow-[8px_8px_0px_0px_rgba(34,197,94,0.2)]
                transform hover:-translate-y-1
                transition-all duration-300 cursor-pointer"
    >
      <div className="h-32 bg-gradient-to-r from-blue-400 to-green-400 relative">
        {service.cover ? (
          <img src={service.cover} alt={service.label} className="w-full h-full object-cover"/>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <HiOfficeBuilding className="text-white text-5xl opacity-50" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.label}</h3>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        <div className="flex items-center text-gray-600">
          <HiCalendar className="mr-2" />
          <span className="text-sm">{service.event_count} événements</span>
        </div>
      </div>
    </div>
  );
};

// Fonction pour tronquer le texte
const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Modifier le composant RequestCard
const RequestCard = ({ request, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{request.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          request.status === 'approved' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {request.status === 'pending' ? 'En attente' :
           request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{truncateText(request.description)}</p>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Créée le {new Date(request.created).toLocaleDateString()}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(request);
          }}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Voir détails →
        </button>
      </div>
    </div>
  );
};

// Nouveau composant pour le modal de détails
const RequestDetailsModal = ({ request, isOpen, onClose }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{request.name}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            request.status === 'approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {request.status === 'pending' ? 'En attente' :
             request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{request.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Informations de contact</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Email : </span>
                {request.details?.contact_info?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Téléphone : </span>
                {request.details?.contact_info?.phone}
              </p>
            </div>
          </div>

          <div className="text-gray-500 text-sm">
            Créée le {new Date(request.created).toLocaleDateString()}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant modal pour créer une demande
const CreateRequestModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'promotion',
    name: '',
    description: '',
    details: {
      contact_info: {
        email: '',
        phone: ''
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-2 overflow-y-auto">
      <div className="bg-white rounded-2xl p-4 w-full max-w-lg my-14">
        <h2 className="text-2xl font-bold mb-4">Nouvelle Demande</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de demande */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Type de demande*
            </label>
            <select 
              className="w-full rounded-xl border-2 border-gray-200 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            >
              <option value="promotion">Création de promotion</option>
              <option value="service">Création de service</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Nom de la demande */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Nom de la demande*
            </label>
            <input
              type="text"
              className="w-full rounded-xl border-2 border-gray-200 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Création promotion STIC 2024"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Description détaillée*
            </label>
            <textarea
              className="w-full rounded-xl border-2 border-gray-200 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Décrivez votre demande en détail..."
              required
            />
          </div>

          {/* Informations de contact */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Informations de contact*</h3>
            
            {/* Email de contact */}
            <div>
              <label className="block text-gray-700 mb-2">
                Email de contact
              </label>
              <input
                type="email"
                className="w-full rounded-xl border-2 border-gray-200 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={formData.details.contact_info.email}
                onChange={(e) => setFormData({
                  ...formData,
                  details: {
                    ...formData.details,
                    contact_info: {
                      ...formData.details.contact_info,
                      email: e.target.value
                    }
                  }
                })}
                placeholder="votre@email.com"
                required
              />
            </div>

            {/* Téléphone de contact */}
            <div>
              <label className="block text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                className="w-full rounded-xl border-2 border-gray-200 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={formData.details.contact_info.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  details: {
                    ...formData.details,
                    contact_info: {
                      ...formData.details.contact_info,
                      phone: e.target.value
                    }
                  }
                })}
                placeholder="+225 XXXXXXXXXX"
                required
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200"
            >
              Soumettre la demande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Fonction pour obtenir le placeholder en fonction de l'onglet
const getSearchPlaceholder = (tab) => {
  switch (tab) {
    case 'promotions':
      return 'Rechercher des promotions par nom, année...';
    case 'services':
      return 'Rechercher des services par nom, description...';
    case 'requests':
      return 'Rechercher des demandes par nom, statut...';
    default:
      return 'Rechercher...';
  }
};

export default function Community() {
  const [activeTab, setActiveTab] = useState('promotions');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fonction de recherche avec debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems(true);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab]);

  // Fonction pour récupérer les items (promos, services ou demandes)
  const fetchItems = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      let endpoint;
      switch (activeTab) {
        case 'promotions':
          endpoint = '/peer/';
          break;
        case 'services':
          endpoint = '/service/';
          break;
        case 'requests':
          endpoint = '/request/';
          break;
        default:
          endpoint = '/peer/';
      }

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
    activeTab === 'requests' 
      ? `/request/${searchTerm ? `?search=${searchTerm}` : ''}`
      : `/peer/${searchTerm ? `?search=${searchTerm}` : ''}`,
    fetcher
  );

  // Fonction pour créer une nouvelle demande
  const handleCreateRequest = async (formData) => {
    try {
      await axiosService.post('/request/', formData);
      setIsCreateModalOpen(false);
      // Recharger les données
      fetchItems(true);
      // Réinitialiser les items et recharger depuis le début
      setItems([]);
      setNextUrl(null);
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
    }
  };

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
                      placeholder={getSearchPlaceholder(activeTab)}
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
                <InfiniteScroll
                  dataLength={items.length}
                  next={() => fetchItems(false)}
                  hasMore={!!nextUrl}
                  loader={<Loading />}
                  endMessage={
                    <p className="text-center text-gray-500 my-4">
                      Plus aucun élément à afficher
                    </p>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => {
                      if (activeTab === 'promotions') return <PromoCard key={item.public_id} promo={item} />;
                      if (activeTab === 'services') return <ServiceCard key={item.public_id} service={item} />;
                      return <RequestCard 
                        key={item.public_id} 
                        request={item} 
                        onViewDetails={(request) => setSelectedRequest(request)}
                      />;
                    })}
                  </div>
                </InfiniteScroll>

                {/* Bouton flottant pour créer une demande */}
                {activeTab === 'requests' && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="fixed bottom-20 right-6 w-14 h-14 bg-green-500 rounded-full 
                             flex items-center justify-center text-white shadow-lg
                             hover:bg-green-600 transition-colors duration-300"
                  >
                    <FaPlus className="text-xl" />
                  </button>
                )}

                {/* Modal de création de demande */}
                <CreateRequestModal
                  isOpen={isCreateModalOpen}
                  onClose={() => setIsCreateModalOpen(false)}
                  onSubmit={handleCreateRequest}
                />

                <RequestDetailsModal
                  isOpen={!!selectedRequest}
                  request={selectedRequest}
                  onClose={() => setSelectedRequest(null)}
                />
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