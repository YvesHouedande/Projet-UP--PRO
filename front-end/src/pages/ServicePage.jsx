import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import Layout from './Layout';
import Loading from '../components/assets/Loading';
import { HiOfficeBuilding, HiLocationMarker, HiNewspaper, HiCalendar, HiUsers } from 'react-icons/hi';
import { IoAddCircle } from "react-icons/io5";
import Feed from '../components/assets/Feed';
import { getUser } from '../hooks/user.actions';
import axiosService from '../helpers/axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Modal } from 'flowbite-react';
import CreateEvent from '../components/events/CreateEvent';
import PublicationsTab from '../components/profile/PublicationsTab';

const TabButton = ({ children, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 sm:px-6 py-4 font-medium text-sm
      transition-all duration-200 flex-shrink-0
      ${active 
        ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }
    `}
  >
    <span className="w-5 h-5">{icon}</span>
    <span className="hidden sm:inline">{children}</span>
  </button>
);

export default function ServicePage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [nextPostsUrl, setNextPostsUrl] = useState(null);
  const [nextEventsUrl, setNextEventsUrl] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const currentUser = getUser();

  const { data: serviceData, error: serviceError, isLoading: serviceLoading, mutate } = 
    useSWR(serviceId ? `/service/${serviceId}/` : null, fetcher);

  const isManager = React.useMemo(() => {
    return serviceData?.can_edit || false;
  }, [serviceData]);

  // Chargement des posts
  const fetchPosts = async (reset = false) => {
    if (loadingPosts) return;
    setLoadingPosts(true);

    try {
      const url = reset ? `/service/${serviceId}/general_post/` : nextPostsUrl;
      const response = await axiosService.get(url);
      
      if (reset) {
        setPosts(response.data.results);
      } else {
        setPosts(prev => [...prev, ...response.data.results]);
      }
      
      setNextPostsUrl(response.data.next);
    } catch (error) {
      console.error('Erreur lors du chargement des publications:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Chargement des événements
  const fetchEvents = async (reset = false) => {
    if (loadingEvents) return;
    setLoadingEvents(true);

    try {
      const url = reset ? `/service/${serviceId}/event/` : nextEventsUrl;
      const response = await axiosService.get(url);
      
      if (reset) {
        setEvents(response.data.results);
      } else {
        setEvents(prev => [...prev, ...response.data.results]);
      }
      
      setNextEventsUrl(response.data.next);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (serviceId && activeTab === 'posts') {
      fetchPosts(true);
    } else if (serviceId && activeTab === 'events') {
      fetchEvents(true);
    }
  }, [serviceId, activeTab]);

  const renderManagerCard = () => {
    const manager = serviceData?.manager_details;
    if (!manager) return null;

    return (
      <div 
        onClick={() => navigate(`/profile/${manager.public_id}`)}
        className="bg-white rounded-2xl border-2 border-gray-200 p-4 
                  shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]
                  hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]
                  transition-all duration-200 cursor-pointer"
      >
        {/* ... Contenu du manager card ... */}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations du service */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                         shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiOfficeBuilding className="text-green-500" />
                À propos du service
              </h2>
              
              <div className="space-y-4">
                {serviceData?.school_details && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiLocationMarker className="w-5 h-5 text-green-500" />
                    <span>École : {serviceData.school_details.name}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Description :</h3>
                  <p className="text-gray-600">
                    {serviceData?.description || "Aucune description disponible"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiNewspaper className="w-5 h-5 text-green-500" />
                    <span>{serviceData?.posts_count || 0} publications</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiCalendar className="w-5 h-5 text-green-500" />
                    <span>{serviceData?.event_count || 0} événements</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Créé le {new Date(serviceData?.created).toLocaleDateString()}</p>
                  <p>Dernière mise à jour le {new Date(serviceData?.updated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Carte du manager */}
            {serviceData?.manager_details && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                           shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiUsers className="text-green-500" />
                  Responsable du service
                </h2>

                <div 
                  onClick={() => navigate(`/profile/${serviceData.manager_details.public_id}`)}
                  className="flex items-start space-x-4 p-4 rounded-xl border-2 border-gray-100
                           hover:border-green-200 hover:shadow-md transition-all duration-200
                           cursor-pointer bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <img 
                      src={serviceData.manager_details.avatar}
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {serviceData.manager_details.first_name} {serviceData.manager_details.last_name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      {serviceData.manager_details.email}
                    </p>
                    
                    {serviceData.manager_details.number && (
                      <p className="text-sm text-gray-600 mb-1">
                        Contact : {serviceData.manager_details.number}
                      </p>
                    )}
                    
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {serviceData.manager_details.status_choice}
                    </span>
                    
                    {serviceData.can_edit && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Responsable actuel
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            {/* Feed pour le délégué */}
            {serviceData?.can_edit && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                           shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
                <Feed
                  onPostCreated={() => mutate()}
                  source="service"
                  serviceId={serviceId}
                />
              </div>
            )}

            {/* Liste des publications */}
            <PublicationsTab 
              user={serviceData}
              context="service"
              serviceId={serviceId}
            />
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6 relative min-h-[50vh]">
            {isManager && (
              <button
                onClick={() => setIsCreateEventOpen(true)}
                className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full
                         shadow-lg hover:bg-green-600 transition-colors duration-200
                         flex items-center gap-2"
              >
                <IoAddCircle size={24} />
                <span className="hidden sm:inline">Créer un événement</span>
              </button>
            )}

            <InfiniteScroll
              dataLength={events.length}
              next={() => fetchEvents(false)}
              hasMore={!!nextEventsUrl}
              loader={<Loading />}
              endMessage={
                <p className="text-center text-gray-500 my-4">
                  Plus aucun événement à afficher
                </p>
              }
            >
              {/* ... Rendu des événements ... */}
            </InfiniteScroll>

            <Modal show={isCreateEventOpen} onClose={() => setIsCreateEventOpen(false)}>
              <Modal.Header>Créer un événement</Modal.Header>
              <Modal.Body>
                <CreateEvent
                  serviceId={serviceId}
                  onSuccess={() => {
                    setIsCreateEventOpen(false);
                    fetchEvents(true);
                  }}
                />
              </Modal.Body>
            </Modal>
          </div>
        );

      default:
        return null;
    }
  };

  if (serviceLoading) return <Loading />;
  if (serviceError) return <div>Erreur de chargement des données</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* En-tête avec titre et tabs */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 
                     shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {serviceData?.label}
            </h1>
          </div>
          
          <div className="border-t-2 border-gray-200">
            <div className="flex overflow-x-auto">
              <TabButton 
                active={activeTab === 'info'}
                onClick={() => setActiveTab('info')}
                icon={<HiOfficeBuilding />}
              >
                Informations
              </TabButton>
              <TabButton 
                active={activeTab === 'posts'}
                onClick={() => setActiveTab('posts')}
                icon={<HiNewspaper />}
              >
                Publications
              </TabButton>
              <TabButton 
                active={activeTab === 'events'}
                onClick={() => setActiveTab('events')}
                icon={<HiCalendar />}
              >
                Événements
              </TabButton>
            </div>
          </div>
        </div>

        {/* Contenu de l'onglet actif */}
        {renderTabContent()}
      </div>
    </Layout>
  );
} 