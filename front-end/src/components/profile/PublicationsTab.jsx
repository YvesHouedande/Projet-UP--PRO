import React, { useState, useEffect } from 'react';
import axiosService from '../../helpers/axios';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { getUser } from '../../hooks/user.actions';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function PublicationsTab({ user, context = 'user', serviceId = null, peerId = null }) {
  const [publications, setPublications] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  const currentUser = getUser();

  useEffect(() => {
    fetchMorePublications();
  }, []);

  const fetchMorePublications = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let url;
      switch (context) {
        case 'service':
          url = nextUrl || `/service/${serviceId}/general_post/`;
          break;
        case 'peer':
          url = nextUrl || `/peer/${peerId}/general_post/`;
          break;
        default:
          url = nextUrl || `/user/${user.public_id}/general_post/`;
      }

      const response = await axiosService.get(url);
      setPublications((prev) => [...prev, ...response.data.results]);
      setNextUrl(response.data.next);
    } catch (err) {
      setError(err);
      setNotification({ type: 'error', message: 'Erreur lors du chargement des publications' });
    } finally {
      setLoading(false);
    }
  };

  const canEditPost = (post) => {
    if (context === 'service') {
      return currentUser.public_id === post.author.public_id && user.can_edit;
    }
    return currentUser.public_id === post.author.public_id;
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      
      switch (selectedPost.content_type) {
        case 'SIMPLE POST':
          if (formData.content !== selectedPost.content) {
            data.append('content', formData.content);
          }
          break;

        case 'IMAGE POST':
          if (formData.title !== selectedPost.title) {
            data.append('title', formData.title);
          }
          if (formData.image instanceof File) {
            data.append('image', formData.image);
          }
          break;

        case 'RICH POST':
          if (formData.title !== selectedPost.title) {
            data.append('title', formData.title);
          }
          if (formData.content !== selectedPost.content) {
            data.append('content', formData.content);
          }
          if (formData.image instanceof File) {
            data.append('image', formData.image);
          }
          break;
      }

      if ([...data.entries()].length > 0) {
        let url;
        switch (context) {
          case 'service':
            url = `/service/${serviceId}/general_post/${selectedPost.public_id}/`;
            break;
          case 'peer':
            url = `/peer/${peerId}/general_post/${selectedPost.public_id}/`;
            break;
          default:
            url = `/general_post/${selectedPost.public_id}/`;
        }

        const response = await axiosService.patch(url, data);
        
        setPublications(publications.map(post => 
          post.public_id === response.data.public_id ? response.data : post
        ));
        
        setNotification({ type: 'success', message: 'Publication mise à jour avec succès' });
      }
      
      setIsModalOpen(false);
      setSelectedPost(null);
      setFormData({ title: '', content: '', image: null });
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
      setNotification({ type: 'error', message: 'Erreur lors de la mise à jour' });
    }
  };

  const handleDelete = async (postId) => {
    try {
      let url;
      switch (context) {
        case 'service':
          url = `/service/${serviceId}/general_post/${postId}/`;
          break;
        case 'peer':
          url = `/peer/${peerId}/general_post/${postId}/`;
          break;
        default:
          url = `/general_post/${postId}/`;
      }

      await axiosService.delete(url);
      setPublications(publications.filter(post => post.public_id !== postId));
      setIsConfirmDeleteOpen(false);
      setSelectedPost(null);
      setNotification({ type: 'success', message: 'Publication supprimée avec succès' });
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setNotification({ type: 'error', message: 'Erreur lors de la suppression' });
    }
  };

  const handleEmojiClick = (emoji) => {
    setSelectedPost({ ...selectedPost, content: (selectedPost.content || '') + emoji.emoji });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const Notification = ({ type, message, onClose }) => (
    <div 
      className={`fixed bottom-4 right-4 p-4 rounded-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white flex items-center gap-2`}
    >
      {message}
      <button onClick={onClose} className="text-white hover:text-gray-200">×</button>
    </div>
  );

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleEdit = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      image: null
    });
    setIsModalOpen(true);
  };

  const renderEditForm = () => {
    if (!selectedPost) return null;

    return (
      <Modal.Body>
        {(selectedPost.content_type === 'IMAGE POST' || selectedPost.content_type === 'RICH POST') && (
          <div className="mb-4">
            <Label htmlFor="title">Titre</Label>
            <TextInput
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            />
          </div>
        )}

        {(selectedPost.content_type === 'RICH POST' || selectedPost.content_type === 'SIMPLE POST') && (
          <div className="mb-4">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
              rows={4}
            />
          </div>
        )}

        {(selectedPost.content_type === 'IMAGE POST' || selectedPost.content_type === 'RICH POST') && (
          <div className="mb-4">
            <Label htmlFor="image">Image</Label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                image: e.target.files[0] || null
              }))}
              className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100"
            />
            {selectedPost.image && (
              <p className="mt-2 text-sm text-gray-500">
                Image actuelle : {selectedPost.image}
              </p>
            )}
          </div>
        )}
      </Modal.Body>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-700 mb-6">Mes Publications</h2>
      
      <InfiniteScroll
        dataLength={publications.length}
        next={fetchMorePublications}
        hasMore={!!nextUrl}
        loader={<div className="text-center py-4">Chargement...</div>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {publications.map(post => (
            <div key={post.public_id} 
                 className="bg-white rounded-xl border-2 border-gray-200 
                          shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]
                          transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
              {post.image && (
                <div className="relative w-full pt-[56.25%] overflow-hidden rounded-t-xl">
                  <img 
                    src={post.image} 
                    alt="Publication" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {post.title || "Sans titre"}
                </h3>

                {post.content && (
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                    {post.content}
                  </p>
                )}

                {canEditPost(post) && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <Button
                      color="info"
                      onClick={() => handleEdit(post)}
                      className="w-full sm:w-1/2 text-sm"
                    >
                      Modifier
                    </Button>
                    <Button
                      color="failure"
                      onClick={() => { setSelectedPost(post); setIsConfirmDeleteOpen(true); }}
                      className="w-full sm:w-1/2 text-sm"
                    >
                      Supprimer
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Modifier la publication</Modal.Header>
        <Modal.Body>
          {renderEditForm()}
        </Modal.Body>
        <Modal.Footer>
          <Button color="success" onClick={handleSave}>Enregistrer</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>Annuler</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)}>
        <Modal.Header>Confirmer la suppression</Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cette publication ?
        </Modal.Body>
        <Modal.Footer>
          <Button 
            color="failure" 
            onClick={() => handleDelete(selectedPost?.public_id)}
          >
            Supprimer
          </Button>
          <Button 
            color="gray" 
            onClick={() => setIsConfirmDeleteOpen(false)}
          >
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

