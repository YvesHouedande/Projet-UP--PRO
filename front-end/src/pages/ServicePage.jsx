import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import Layout from './Layout';
import Loading from '../components/assets/Loading';
import { HiOfficeBuilding, HiLocationMarker, HiNewspaper, HiUsers } from 'react-icons/hi';
import Feed from '../components/assets/Feed';
import { getUser } from '../hooks/user.actions';
import axiosService from '../helpers/axios';
import PublicationsTab from '../components/profile/PublicationsTab';
import NavBox from '../components/assets/NavBox';

const TabButton = ({ children, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-2 sm:px-6 py-3 sm:py-4 font-medium text-sm
      transition-all duration-200 whitespace-nowrap
      ${active 
        ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }
    `}
  >
    {icon}
    <span>{children}</span>
  </button>
);

export default function ServicePage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [posts, setPosts] = useState([]);
  const [nextPostsUrl, setNextPostsUrl] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
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

  useEffect(() => {
    if (serviceId && activeTab === 'posts') {
      fetchPosts(true);
    }
  }, [serviceId, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Informations du service */}
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 
                         shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiOfficeBuilding className="text-green-500" />
                À propos du service
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {serviceData?.school_details && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                    <HiLocationMarker className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>École : {serviceData.school_details.name}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Description :</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {serviceData?.description || "Aucune description disponible"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                  <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                    <HiNewspaper className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{serviceData?.posts_count || 0} publications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte du manager */}
            {serviceData?.manager_details && (
              <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 
                           shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiUsers className="text-green-500" />
                  Responsable du service
                </h2>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl 
                             border-2 border-gray-100 hover:border-green-200 
                             hover:shadow-md transition-all duration-200
                             cursor-pointer bg-gray-50">
                  <img 
                    src={serviceData.manager_details.avatar}
                    alt="Avatar" 
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-green-200"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {serviceData.manager_details.first_name} {serviceData.manager_details.last_name}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      {serviceData.manager_details.email}
                    </p>
                    
                    {serviceData.manager_details.number && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                        Contact : {serviceData.manager_details.number}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {serviceData.manager_details.status_choice}
                      </span>
                      
                      {serviceData.can_edit && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Responsable actuel
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-4 sm:space-y-6">
            {serviceData?.can_edit && (
              <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 
                           shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
                <Feed
                  onPostCreated={() => mutate()}
                  source="service"
                  serviceId={serviceId}
                />
              </div>
            )}

            <PublicationsTab 
              user={serviceData}
              context="service"
              serviceId={serviceId}
            />
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6 pb-20 lg:pb-8">
        {/* En-tête avec titre et tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 
                     shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
              {serviceData?.label}
            </h1>
          </div>
          
          <div className="border-t-2 border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              <TabButton 
                active={activeTab === 'info'}
                onClick={() => setActiveTab('info')}
                icon={<HiOfficeBuilding className="w-5 h-5" />}
              >
                Informations
              </TabButton>
              <TabButton 
                active={activeTab === 'posts'}
                onClick={() => setActiveTab('posts')}
                icon={<HiNewspaper className="w-5 h-5" />}
              >
                Publications
              </TabButton>
            </div>
          </div>
        </div>

        {/* Contenu des onglets */}
        {renderTabContent()}

        {/* NavBox mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-50">
          <NavBox />
        </div>
      </div>
    </Layout>
  );
} 