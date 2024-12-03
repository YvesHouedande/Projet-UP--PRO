import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import { getUser } from '../hooks/user.actions';
import axiosService from '../helpers/axios';
import Layout from './Layout';
import Loading from '../components/assets/Loading';
import StudentCard from '../components/StudentCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MdOutlineSwapHoriz } from "react-icons/md";
import { HiUserGroup, HiNewspaper, HiUsers } from "react-icons/hi";
import { usePeerPosts } from '../hooks/peer.actions';
import Feed from '../components/assets/Feed';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';
import PublicationsTab from '../components/profile/PublicationsTab';


export default function PeerPage() {
  const { peerId } = useParams();
  const [activeTab, setActiveTab] = useState('info');
  const [students, setStudents] = useState([]);
  const [nextStudentsUrl, setNextStudentsUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [nextPostsUrl, setNextPostsUrl] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const currentUser = getUser();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { data: peerData, error: peerError, isLoading: peerLoading, mutate } = 
    useSWR(peerId ? `/peer/${peerId}/` : null, fetcher);

  const isManager = React.useMemo(() => {
    if (!currentUser || !peerData?.manager) return false;
    return currentUser.public_id === peerData.manager.user;
  }, [currentUser, peerData]);

  // Fonction pour transférer le rôle
  const handleTransferRole = async (studentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir transférer le rôle de délégué à cet étudiant ?')) {
      return;
    }

    try {
      await axiosService.post(`/peer/${peerId}/delegate-manager/`, {
        new_manager: studentId
      });
      await mutate(); // Met à jour les données après le transfert
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      alert('Erreur lors du transfert du rôle');
    }
  };

  // Chargement initial des étudiants si l'onglet "Membres" est actif
  useEffect(() => {
    if (peerId && activeTab === 'members') {
      fetchStudents('', true);
    }
  }, [peerId, activeTab]);

  // Chargement initial des publications si l'onglet "Publications" est actif
  useEffect(() => {
    if (peerId && activeTab === 'posts') {
      fetchPosts(true);
    }
  }, [peerId, activeTab]);

  // Utiliser useEffect pour la recherche
  useEffect(() => {
    if (activeTab === 'members') {
      const delayDebounceFn = setTimeout(() => {
        fetchStudents(searchTerm, true);
      }, 300); // Délai de 300ms pour éviter trop de requêtes

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, activeTab]);

  // Fonction pour charger les étudiants
  const fetchStudents = async (searchValue = '', reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      let url;
      const params = new URLSearchParams();
      
      if (searchValue) {
        params.append('peer', peerId);
        params.append('search', searchValue);
        url = `/student/?${params.toString()}`;
      } else {
        url = reset ? `/peer/${peerId}/students/` : nextStudentsUrl;
      }

      const response = await axiosService.get(url);
      
      if (reset) {
        setStudents(response.data.results);
      } else {
        setStudents(prev => [...prev, ...response.data.results]);
      }
      
      setNextStudentsUrl(response.data.next);

    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les publications
  const fetchPosts = async (reset = false) => {
    if (loadingPosts) return;
    setLoadingPosts(true);

    try {
      const url = reset ? `/peer/${peerId}/general_post/` : nextPostsUrl;
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

  // Utiliser le hook personnalisé pour les posts de la promo
  const { 
    posts: peerPosts, 
    error: peerPostsError, 
    isLoading: peerPostsLoading, 
    mutate: peerPostsMutate, 
    createPeerPost 
  } = usePeerPosts(peerId);

  const handleNewPost = () => {
    peerPostsMutate();
  };

  // Fonction de mise à jour d'un post
  const handleSave = async () => {
    try {
      let postToSave = {};

      // N'inclure que les champs non nuls qui existaient déjà
      if (selectedPost.title !== null) {
        postToSave.title = selectedPost.title;
      }
      if (selectedPost.content !== null) {
        postToSave.content = selectedPost.content;
      }
      if (selectedPost.imageFile) {
        const formData = new FormData();
        if (postToSave.title) formData.append('title', postToSave.title);
        if (postToSave.content) formData.append('content', postToSave.content);
        formData.append('image', selectedPost.imageFile);
        postToSave = formData;
      }

      const response = await axiosService.patch(
        `/general_post/${selectedPost.public_id}/`,
        postToSave
      );

      // Mettre à jour la liste des posts
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.public_id === response.data.public_id ? response.data : post
        )
      );

      setIsModalOpen(false);
      setSelectedPost(null);
      setNotification({ type: 'success', message: 'Publication mise à jour avec succès' });
    } catch (err) {
      console.error("Erreur lors de la sauvegarde", err);
      setNotification({ type: 'error', message: 'Erreur lors de la mise à jour' });
    }
  };

  // Fonction de suppression
  const handleDelete = async (postId) => {
    try {
      await axiosService.delete(`/general_post/${postId}/`);
      setPosts(posts.filter(post => post.public_id !== postId));
      setNotification({ type: 'success', message: 'Publication supprimée avec succès' });
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setNotification({ type: 'error', message: 'Erreur lors de la suppression' });
    }
    setIsConfirmDeleteOpen(false);
  };

  // Gestion des emojis
  const handleEmojiClick = (emoji) => {
    setSelectedPost({ 
      ...selectedPost, 
      content: (selectedPost.content || '') + emoji.emoji 
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiUserGroup className="text-green-500" />
                  Informations
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-600">Filière: {peerData?.study_label}</p>
                  <p className="text-gray-600">École: {peerData?.school_label}</p>
                  <p className="text-gray-600">
                    Année: {new Date(peerData?.year).getFullYear()}
                  </p>
                  <p className="text-gray-600">
                    Effectif total: {peerData?.students_count} étudiants
                  </p>
                </div>
              </div>
              {peerData?.manager && (
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Délégué</h2>
                  <StudentCard student={peerData.manager} />
                </div>
              )}
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            {/* Feed pour le délégué uniquement */}
            {isManager && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                           shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
                <Feed
                  onPostCreated={() => mutate()}
                  source="promotion"
                  peerId={peerId}
                />
              </div>
            )}

            {/* Liste des publications via PublicationsTab */}
            <PublicationsTab 
              user={peerData}
              context="peer"
              peerId={peerId}
            />
          </div>
        );

      case 'members':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                         shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un étudiant..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                           focus:outline-none focus:border-green-400 
                           shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loading size="sm" />
                  </div>
                )}
              </div>
            </div>

            <InfiniteScroll
              dataLength={students.length}
              next={() => !searchTerm && fetchStudents()}
              hasMore={!searchTerm && nextStudentsUrl !== null}
              loader={<Loading />}
              endMessage={
                <p className="text-center text-gray-500 py-4">
                  {students.length === 0 
                    ? searchTerm 
                      ? "Aucun étudiant trouvé"
                      : "Aucun étudiant dans cette promotion"
                    : "Plus d'étudiants à afficher"
                  }
                </p>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <div key={student.public_id} 
                       className="bg-white rounded-2xl border-2 border-gray-200 p-4 
                                shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]
                                hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]
                                transition-all duration-200 relative group">
                    <StudentCard student={student} />
                    {isManager && student.public_id !== peerData.manager.public_id && (
                      <button
                        onClick={() => handleTransferRole(student.public_id)}
                        title="Transférer le rôle de délégué"
                        className="absolute top-3 right-3 p-2 bg-white rounded-xl
                                 border-2 border-gray-200 opacity-0 group-hover:opacity-100
                                 hover:border-green-400 hover:text-green-500
                                 transition-all duration-200
                                 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                      >
                        <MdOutlineSwapHoriz size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        );
    }
  };

  if (peerLoading) return <Loading />;
  if (peerError) return <div>Erreur de chargement des données</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* En-tête avec titre et tabs */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 
                     shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {peerData?.label}
            </h1>
          </div>
          
          <div className="border-t-2 border-gray-200">
            <div className="flex overflow-x-auto">
              <TabButton 
                active={activeTab === 'info'}
                onClick={() => setActiveTab('info')}
                icon={<HiUserGroup />}
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
                active={activeTab === 'members'}
                onClick={() => setActiveTab('members')}
                icon={<HiUsers />}
              >
                Membres
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

// Composant TabButton avec style cartoon
const TabButton = ({ children, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-6 py-4 font-medium text-sm
      transition-all duration-200
      ${active 
        ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }
    `}
  >
    {icon}
    {children}
  </button>
);

// Fonction utilitaire pour tronquer le texte
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
