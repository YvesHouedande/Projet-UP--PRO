import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import Layout from './Layout';
import Loading from '../components/assets/Loading';
import { HiOfficeBuilding, HiLocationMarker, HiNewspaper, HiInformationCircle, HiCalendar } from 'react-icons/hi';
import Feed from '../components/assets/Feed';
import { getUser } from '../hooks/user.actions';
import axiosService from '../helpers/axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';
import { IoAddCircle } from "react-icons/io5";
import CreateEvent from '../components/events/CreateEvent';
import EventsTab from '../components/shared/EventsTab';

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
  const [activeTab, setActiveTab] = useState('info');
  const [posts, setPosts] = useState([]);
  const [nextPostsUrl, setNextPostsUrl] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const currentUser = getUser();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [nextEventsUrl, setNextEventsUrl] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const { data: serviceData, error: serviceError, isLoading: serviceLoading, mutate } = 
    useSWR(serviceId ? `/service/${serviceId}/` : null, fetcher);

  // Vérifier si l'utilisateur est le responsable du service
  const isManager = React.useMemo(() => {
    if (!currentUser || !serviceData?.manager_details) return false;
    return currentUser.public_id === serviceData.manager_details.id;
  }, [currentUser, serviceData]);

  // Chargement initial des publications si l'onglet "Publications" est actif
  useEffect(() => {
    if (serviceId && activeTab === 'posts') {
      fetchPosts(true);
    }
  }, [serviceId, activeTab]);

  const handleEmojiClick = (emojiData) => {
    setSelectedPost({
      ...selectedPost,
      content: (selectedPost.content || '') + emojiData.emoji
    });
  };

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

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', selectedPost.title || '');
      formData.append('content', selectedPost.content || '');
      if (selectedPost.imageFile) {
        formData.append('image', selectedPost.imageFile);
      }

      await axiosService.put(`/general_post/${selectedPost.public_id}/`, formData);
      setNotification({ type: 'success', message: 'Publication mise à jour avec succès' });
      setIsModalOpen(false);
      fetchPosts(true);
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Erreur lors de la mise à jour' 
      });
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axiosService.delete(`/general_post/${postId}/`);
      setNotification({ type: 'success', message: 'Publication supprimée avec succès' });
      setIsConfirmDeleteOpen(false);
      fetchPosts(true);
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Erreur lors de la suppression' 
      });
    }
  };

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

  // Charger les événements quand on active l'onglet
  useEffect(() => {
    if (serviceId && activeTab === 'events') {
      fetchEvents(true);
    }
  }, [serviceId, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                       shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiOfficeBuilding className="text-green-500" />
                  Informations
                </h2>
                <div className="space-y-3">
                  {serviceData?.school && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <HiLocationMarker className="text-green-500" />
                      <span>École: {serviceData.school.name}</span>
                    </div>
                  )}
                  {serviceData?.description && (
                    <p className="text-gray-600">
                      <span className="font-medium">Description:</span><br />
                      {serviceData.description}
                    </p>
                  )}
                </div>
              </div>

              {serviceData?.manager_details && (
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Responsable</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={serviceData.manager_details.avatar} 
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800">
                        {serviceData.manager_details.first_name} {serviceData.manager_details.last_name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {serviceData.manager_details.email}
                      </p>
                      {serviceData.can_edit && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                          Responsable du service
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            {/* Feed pour le responsable */}
            {isManager && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                           shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
                <Feed
                  onPostCreated={() => fetchPosts(true)}
                  source="service"
                  serviceId={serviceId}
                  showEventButton={true}
                />
              </div>
            )}

            {/* Liste des publications */}
            <div className="min-h-[50vh]">
              <InfiniteScroll
                dataLength={posts.length}
                next={() => fetchPosts(false)}
                hasMore={!!nextPostsUrl}
                loader={<Loading />}
                endMessage={
                  <p className="text-center text-gray-500 my-4">
                    Plus aucune publication à afficher
                  </p>
                }
              >
                {posts.map(post => (
                  <div key={post.public_id} 
                       className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden
                                shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
                    {post.image && (
                      <div className="h-48 bg-gray-200">
                        <img 
                          src={post.image} 
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.title && (
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {post.title}
                        </h3>
                      )}
                      {post.content && (
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {post.content}
                        </p>
                      )}
                      
                      {isManager && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            color="light"
                            onClick={() => { setSelectedPost(post); setIsModalOpen(true); }}
                          >
                            Modifier
                          </Button>
                          <Button
                            color="failure"
                            onClick={() => { setSelectedPost(post); setIsConfirmDeleteOpen(true); }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>

            {/* Modal de modification */}
            {selectedPost && isModalOpen && (
              <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Modal.Header>Modifier la publication</Modal.Header>
                <Modal.Body>
                  <div className="space-y-4">
                    {selectedPost.title !== null && (
                      <div>
                        <Label htmlFor="title" value="Titre" />
                        <TextInput
                          id="title"
                          value={selectedPost.title}
                          onChange={(e) => setSelectedPost({
                            ...selectedPost,
                            title: e.target.value
                          })}
                        />
                      </div>
                    )}

                    {selectedPost.content !== null && (
                      <div className="relative">
                        <Label htmlFor="content" value="Contenu" />
                        <Textarea
                          id="content"
                          rows={4}
                          value={selectedPost.content}
                          onChange={(e) => setSelectedPost({
                            ...selectedPost,
                            content: e.target.value
                          })}
                        />
                        <Button
                          color="gray"
                          size="sm"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="mt-2"
                        >
                          😊
                        </Button>
                        {showEmojiPicker && (
                          <div className="absolute bottom-full right-0 z-50">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                          </div>
                        )}
                      </div>
                    )}

                    {selectedPost.image !== null && (
                      <div>
                        <Label htmlFor="image" value="Image" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedPost({
                            ...selectedPost,
                            imageFile: e.target.files[0]
                          })}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button color="success" onClick={handleSave}>
                    Enregistrer
                  </Button>
                  <Button color="gray" onClick={() => setIsModalOpen(false)}>
                    Annuler
                  </Button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Modal de confirmation de suppression */}
            {isConfirmDeleteOpen && (
              <Modal show={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)}>
                <Modal.Header>Confirmer la suppression</Modal.Header>
                <Modal.Body>
                  <p>Êtes-vous sûr de vouloir supprimer cette publication ?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button color="failure" onClick={() => handleDelete(selectedPost.public_id)}>
                    Supprimer
                  </Button>
                  <Button color="gray" onClick={() => setIsConfirmDeleteOpen(false)}>
                    Annuler
                  </Button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Notifications */}
            {notification && (
              <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg z-50
                            ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {notification.message}
              </div>
            )}
          </div>
        );

      case 'events':
        return (
          <EventsTab 
            sourceType="service"
            sourceId={serviceId}
            isManager={isManager}
          />
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
            <div className="flex overflow-x-auto scrollbar-hide">
              <TabButton 
                active={activeTab === 'info'}
                onClick={() => setActiveTab('info')}
                icon={<HiInformationCircle className="w-5 h-5" />}
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
              <TabButton 
                active={activeTab === 'events'}
                onClick={() => setActiveTab('events')}
                icon={<HiCalendar className="w-5 h-5" />}
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