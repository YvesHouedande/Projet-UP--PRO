import React, { useState, useEffect } from 'react';
import axiosService from '../../helpers/axios';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';
import { getUser } from '../../hooks/user.actions';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function PublicationsTab({ user }) {
  const [publications, setPublications] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const currentUser = getUser();

  useEffect(() => {
    fetchMorePublications();
  }, []);

  const fetchMorePublications = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosService.get(nextUrl || `/user/${user.public_id}/general_post/`);
      const newPublications = response.data.results;
      setPublications((prevPublications) => [...prevPublications, ...newPublications]);
      setNextUrl(response.data.next);
    } catch (err) {
      setError(err);
      setNotification({ type: 'error', message: 'Erreur lors du chargement des publications' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      let postToSave = {};

      if (selectedPost.title) {
        postToSave.title = selectedPost.title;
      }
      if (selectedPost.content) {
        postToSave.content = selectedPost.content;
      }
      if (selectedPost.imageFile) {
        const formData = new FormData();
        formData.append('title', postToSave.title || '');
        formData.append('content', postToSave.content || '');
        formData.append('image', selectedPost.imageFile);
        postToSave = formData;
      }

      const response = await axiosService.patch(`/general_post/${selectedPost.public_id}/`, postToSave);
      const updatedPost = response.data;

      setPublications((prevPublications) => 
        prevPublications.map(post => 
          post.public_id === updatedPost.public_id ? updatedPost : post
        )
      );

      setIsModalOpen(false);
      setSelectedPost(null);
      setNotification({ type: 'success', message: 'Publication mise à jour avec succès' });
    } catch (err) {
      console.error("Erreur lors de la sauvegarde", err);
      setNotification({ type: 'error', message: 'Erreur lors de la mise à jour de la publication' });
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axiosService.delete(`/general_post/${postId}/`);
      setPublications(publications.filter((post) => post.public_id !== postId));
      setNotification({ type: 'success', message: 'Publication supprimée avec succès' });
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setNotification({ type: 'error', message: 'Erreur lors de la suppression de la publication' });
    }
    setIsConfirmDeleteOpen(false);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Mes Publications</h2>
      
      <div className="min-h-[50vh]">
        <InfiniteScroll
          dataLength={publications.length}
          next={fetchMorePublications}
          hasMore={nextUrl !== null}
          loader={
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
            </div>
          }
          endMessage={
            <p className="text-center my-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              Plus de publications disponibles
            </p>
          }
        >
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {publications.map((post) => (
              <div
                key={post.public_id}
                className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-gray-200 
                          shadow-lg hover:shadow-xl transition-shadow duration-500 transform hover:scale-105"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt="Publication"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  {post.title && (
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {truncateText(post.title, 50)}
                    </h3>
                  )}
                  {post.content && (
                    <p className="text-gray-600 mb-4">
                      {truncateText(post.content, 120)}
                    </p>
                  )}
                  
                  {post.author.public_id === currentUser.public_id && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => { setSelectedPost(post); setIsModalOpen(true); }}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg
                                 hover:bg-blue-600 transition-colors duration-200
                                 border border-blue-500"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => { setSelectedPost(post); setIsConfirmDeleteOpen(true); }}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg
                                 hover:bg-red-600 transition-colors duration-200
                                 border border-red-500"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {isModalOpen && selectedPost && (
        <Modal show={isModalOpen} onClose={handleCloseModal}>
          <Modal.Header className="border-b-2 border-green-200 bg-green-50">
            <h3 className="text-xl font-bold text-green-700">
              Modifier la publication
            </h3>
          </Modal.Header>
          <Modal.Body className="bg-green-50">
            <div className="my-4">
              {selectedPost.title !== null && (
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Titre de la publication" />
                  <TextInput
                    id="title"
                    type="text"
                    sizing="sm"
                    value={selectedPost.title}
                    onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              )}

              {selectedPost.content !== null && (
                <div className="relative my-4">
                  <div className="mb-2 block">
                    <Label htmlFor="content" value="Contenu de la publication" />
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Description"
                    required
                    rows={4}
                    value={selectedPost.content}
                    onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <div className="mt-2 flex items-center relative">
                    <Button
                      color="gray"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="mr-2"
                    >
                      😊
                    </Button>
                    {showEmojiPicker && (
                      <div className="absolute top-12 z-50">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedPost.image !== null && (
                <div className='my-4'>
                  <div className="mb-2 block">
                    <Label htmlFor="imageUpload" value="Télécharger une image" />
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedPost({ ...selectedPost, imageFile: e.target.files[0] })}
                    className="mb-2 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-green-50">
            <Button color={"green"} onClick={handleSave}>Enregistrer</Button>
            <Button color={"gray"} onClick={handleCloseModal}>Annuler</Button>
          </Modal.Footer>
        </Modal>
      )}

      {isConfirmDeleteOpen && (
        <Modal show={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)}>
          <Modal.Header className="border-b-2 border-red-200 bg-red-50">
            <h3 className="text-xl font-bold text-red-700">
              Confirmer la suppression
            </h3>
          </Modal.Header>
          <Modal.Body className="bg-red-50">
            <p>Êtes-vous sûr de vouloir supprimer cette publication ?</p>
          </Modal.Body>
          <Modal.Footer className="bg-red-50">
            <Button color={"red"} onClick={() => handleDelete(selectedPost.public_id)}>Supprimer</Button>
            <Button color={"gray"} onClick={() => setIsConfirmDeleteOpen(false)}>Annuler</Button>
          </Modal.Footer>
        </Modal>
      )}

      {notification && (
        <Modal show={!!notification} onClose={() => setNotification(null)}>
          <Modal.Header className={`border-b-2 ${notification.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <h3 className={`text-xl font-bold ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {notification.type === 'success' ? 'Succès' : 'Erreur'}
            </h3>
          </Modal.Header>
          <Modal.Body className={notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'}>
            <p>{notification.message}</p>
          </Modal.Body>
          <Modal.Footer className={notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'}>
            <Button color={"gray"} onClick={() => setNotification(null)}>Fermer</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

