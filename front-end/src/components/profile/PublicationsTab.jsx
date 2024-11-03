import React, { useState, useEffect } from 'react';
import axiosService from '../../helpers/axios';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';
import { getUser } from '../../hooks/user.actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import Feed from '../assets/Feed';

export default function PublicationsTab({ user }) {
  const [publications, setPublications] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [error, setError] = useState(null);
  
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
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      let postToSave = { ...selectedPost };

      // Si une nouvelle image est sélectionnée, on utilise FormData
      if (selectedPost.imageFile) {
        const formData = new FormData();
        formData.append('title', postToSave.title);
        formData.append('content', postToSave.content);
        formData.append('image', postToSave.imageFile);
        postToSave = formData; // Utilise FormData pour l'envoi
      } else {
        // Exclure l'image si aucune nouvelle image n'est sélectionnée
        postToSave = {
          title: postToSave.title,
          content: postToSave.content,
        };
      }

      const response = await axiosService.patch(`/general_post/${selectedPost.public_id}/`, postToSave);
      const updatedPost = response.data;

      // Mettre à jour la liste des publications
      setPublications((prevPublications) => 
        prevPublications.map(post => 
          post.public_id === updatedPost.public_id ? updatedPost : post
        )
      );

      setIsModalOpen(false);
      setSelectedPost(null);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde", err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axiosService.delete(`/post/${postId}/`);
      setPublications(publications.filter((post) => post.public_id !== postId));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  const handleEmojiClick = (emoji) => {
    setSelectedPost({ ...selectedPost, content: selectedPost.content + emoji.emoji });
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
                className="bg-white rounded-xl border-2 border-green-200 
                          shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)]
                          hover:shadow-[7px_7px_0px_0px_rgba(34,197,94,0.2)]
                          transition-all duration-200"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt="Publication"
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-4">
                  {post.title && (
                    <h3 className="text-lg font-bold text-green-700 mb-2">
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
                        className="flex-1 px-4 py-2 bg-orange-100 text-orange-600 rounded-xl
                                 hover:bg-orange-200 transition-colors duration-200
                                 border-2 border-orange-200"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(post.public_id)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-xl
                                 hover:bg-red-200 transition-colors duration-200
                                 border-2 border-red-200"
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

      {/* Modal avec le même style */}
      {isModalOpen && selectedPost && (
        <Modal show={isModalOpen} onClose={handleCloseModal}>
          <Modal.Header className="border-b-2 border-green-200">
            <h3 className="text-xl font-bold text-green-700">
              Modifier la publication
            </h3>
          </Modal.Header>
          <Modal.Body>
            <div className="my-4">
              {selectedPost?.title && (
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Titre de la publication" />
                  <TextInput
                    id="title"
                    type="text"
                    sizing="sm"
                    value={selectedPost.title }
                    onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                  />
                </div>
              )}

              {selectedPost?.content && (
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

              {selectedPost?.image && (
                <div className='my-4'>
                  <div className="mb-2 block">
                    <Label htmlFor="imageUpload" value="Télécharger une image" />
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedPost({ ...selectedPost, imageFile: e.target.files[0] })}
                    className="mb-2"
                  />
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color={"green"} onClick={handleSave}>Enregistrer</Button>
            <Button color={"green"} onClick={handleCloseModal}>Annuler</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

