import React, { useEffect, useState, useCallback } from 'react';
import { Label, Textarea, Modal, Button } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';

export default function CreateComment({ openModal, setOpenModal, postId }) {
  const [commentForm, setCommentForm] = useState({
    description: "",
    author: getUser().public_id,
    post: postId
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmojiClick = useCallback((emojiObject) => {
    setCommentForm(prevForm => ({
      ...prevForm,
      description: prevForm.description + emojiObject.emoji
    }));
    setShowEmojiPicker(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommentForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axiosService.post(`general_post/${postId}/comment/`, commentForm);
      setCommentForm({
        description: "",
        author: "",
        post: postId
      });
      setOpenModal(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      dismissible 
      show={openModal} 
      onClose={() => setOpenModal(false)}
      className="rounded-2xl"
    >
      <Modal.Header className="border-b-2 border-gray-100 bg-gradient-to-r from-green-50 to-white">
        <span className="text-lg font-semibold text-gray-800">
          Ajouter un commentaire
        </span>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="relative space-y-4">
          {/* Zone de texte */}
          <div className="relative">
            <Textarea 
              id="description" 
              name="description"
              placeholder="Partagez vos pensées..." 
              required 
              rows={4} 
              value={commentForm.description}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 
                        border-2 border-gray-200 rounded-xl
                        focus:border-green-400 focus:ring-4 focus:ring-green-50
                        transition-all duration-300 resize-none"
            />
          </div>

          {/* Bouton emoji et picker */}
          <div className="flex items-center relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 
                         text-gray-600 transition-colors duration-300
                         border-2 border-transparent hover:border-gray-300"
            >
              <span className="text-xl">😊</span>
            </button>

            {showEmojiPicker && (
              <div className="absolute top-12 z-50 shadow-xl rounded-xl overflow-hidden
                             transform transition-all duration-300 origin-top-left">
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick}
                  theme="light"
                  searchPlaceholder="Rechercher un emoji..."
                />
              </div>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="flex justify-end gap-3 border-t-2 border-gray-100 bg-gray-50">
        {/* Bouton Fermer */}
        <button
          onClick={() => setOpenModal(false)}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-600 
                     bg-white border-2 border-gray-200 rounded-xl
                     hover:border-gray-300 hover:bg-gray-50
                     transition-all duration-300 disabled:opacity-50"
        >
          Annuler
        </button>

        {/* Bouton Envoyer */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || commentForm.description.trim() === ''}
          className={`px-4 py-2 text-sm font-medium rounded-xl
                     transition-all duration-300
                     ${isSubmitting || commentForm.description.trim() === ''
                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                       : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                     }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>Envoi en cours...</span>
            </div>
          ) : (
            'Publier'
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
