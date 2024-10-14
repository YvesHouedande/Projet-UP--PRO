// import React, { useState, useEffect } from 'react';
// import axiosService from '../../helpers/axios';
// import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
// import EmojiPicker from 'emoji-picker-react';
// import { getUser } from '../../hooks/user.actions';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import Feed from '../assets/Feed';

// export default function PublicationsTab(user) {
//   const [publications, setPublications] = useState([]);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [nextUrl, setNextUrl] = useState(null);
//   const [error, setError] = useState(null);

//   const user = getUser();

//   useEffect(() => {
//     fetchMorePublications();
//   }, []);

//   const fetchMorePublications = async () => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       const response = await axiosService.get(nextUrl || `/user/${user.public_id}/general_post/`);
//       const newPublications = response.data.results;
//       setPublications((prevPublications) => [...prevPublications, ...newPublications]);
//       setNextUrl(response.data.next);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await axiosService.put(`/post/${selectedPost.public_id}/`, selectedPost);
//       setIsModalOpen(false);
//       setSelectedPost(null);
//     } catch (err) {
//       console.error("Erreur lors de la sauvegarde", err);
//     }
//   };

//   const handleDelete = async (postId) => {
//     try {
//       await axiosService.delete(`/post/${postId}/`);
//       setPublications(publications.filter((post) => post.public_id !== postId));
//     } catch (err) {
//       console.error("Erreur lors de la suppression", err);
//     }
//   };

//   const handleEmojiClick = (emoji) => {
//     setSelectedPost({ ...selectedPost, content: selectedPost.content + emoji.emoji });
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedPost(null);
//   };

//   const truncateText = (text, maxLength) => {
//     return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <Feed />
//       <h2 className="text-2xl font-bold mb-4">Mes Publications</h2>
//       <div style={{ height: '100vh' }}>
//         <InfiniteScroll
//           dataLength={publications.length}
//           next={fetchMorePublications}
//           hasMore={nextUrl !== null}
//           loader={<h4>Chargement...</h4>}
//           endMessage={<p className="text-center my-4">Plus de publications disponibles.</p>}
//         >
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
//             {publications.map((post) => (
//               <div
//                 key={post.public_id}
//                 className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg flex flex-col min-h-auto max-h-80 overflow-auto"
//                 style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
//               >
//                 {post.image && (
//                   <img
//                     src={post.image}
//                     alt="Publication"
//                     className="w-full h-40 object-cover rounded mb-2"
//                     style={{ maxHeight: '150px' }}
//                   />
//                 )}
//                 <div>
//                   {post.title && <h3 className="text-lg font-semibold mb-2">{truncateText(post.title, 50)}</h3>}
//                   {post.content && <p className="text-sm">{truncateText(post.content, 120)}</p>}
//                 </div>
//                 <div className="flex justify-between mt-4">
//                   <Button onClick={() => { setSelectedPost(post); setIsModalOpen(true); }} color="gray" className="w-full mr-2">Modifier</Button>
//                   <Button onClick={() => handleDelete(post.public_id)} color="red" className="w-full">Supprimer</Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </InfiniteScroll>
//       </div>

//       {/* Modal de modification */}
//       {isModalOpen && selectedPost && (
//         <Modal show={isModalOpen} onClose={handleCloseModal}>
//           <Modal.Header>Modifier la publication</Modal.Header>
//           <Modal.Body>
//             <div className="my-4">
//               {selectedPost?.title && (
//                 <div className="mb-2 block">
//                   <Label htmlFor="title" value="Titre de la publication" />
//                   <TextInput
//                     id="title"
//                     type="text"
//                     sizing="sm"
//                     value={selectedPost.title}
//                     onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
//                   />
//                 </div>
//               )}

//               {selectedPost?.content && (
//                 <div className="relative my-4">
//                   <div className="mb-2 block">
//                     <Label htmlFor="content" value="Contenu de la publication" />
//                   </div>
//                   <Textarea
//                     id="content"
//                     placeholder="Description"
//                     required
//                     rows={4}
//                     value={selectedPost.content}
//                     onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
//                   />
//                   <div className="mt-2 flex items-center relative">
//                     <Button
//                       color="gray"
//                       onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                       className="mr-2"
//                     >
//                       😊
//                     </Button>
//                     {showEmojiPicker && (
//                       <div className="absolute top-12 z-50">
//                         <EmojiPicker onEmojiClick={handleEmojiClick} />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {selectedPost?.image && (
//                 <div className='my-4'>
//                   <div className="mb-2 block">
//                     <Label htmlFor="imageUpload" value="Télécharger une image" />
//                   </div>
//                   <input
//                     id="imageUpload"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setSelectedPost({ ...selectedPost, imageFile: e.target.files[0] })}
//                     className="mb-2"
//                   />
//                 </div>
//               )}
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button color={"green"} onClick={handleSave}>Enregistrer</Button>
//             <Button color={"green"} onClick={handleCloseModal}>Annuler</Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </div>
//   );
// }

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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mes Publications</h2>
      <div style={{ height: '100vh' }}>
        <InfiniteScroll
          dataLength={publications.length}
          next={fetchMorePublications}
          hasMore={nextUrl !== null}
          loader={<h4>Chargement...</h4>}
          endMessage={<p className="text-center my-4">Plus de publications disponibles.</p>}
        >
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
            {publications.map((post) => (
              <div
                key={post.public_id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg flex flex-col min-h-auto max-h-80 overflow-auto"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt="Publication"
                    className="w-full h-40 object-cover rounded mb-2"
                    style={{ maxHeight: '150px' }}
                  />
                )}
                <div>
                  {post.title && <h3 className="text-lg font-semibold mb-2">{truncateText(post.title, 50)}</h3>}
                  {post.content && <p className="text-sm">{truncateText(post.content, 120)}</p>}
                </div>
                <div className="flex justify-between mt-4">
                  {post.author.public_id === currentUser.public_id && (
                    <>
                      <Button onClick={() => { setSelectedPost(post); setIsModalOpen(true); }} color="gray" className="w-full mr-2">Modifier</Button>
                      <Button onClick={() => handleDelete(post.public_id)} color="red" className="w-full">Supprimer</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {/* Modal de modification */}
      {isModalOpen && selectedPost && (
        <Modal show={isModalOpen} onClose={handleCloseModal}>
          <Modal.Header>Modifier la publication</Modal.Header>
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

