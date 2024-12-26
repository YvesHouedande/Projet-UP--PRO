import React, { useState, useContext } from 'react';
import { CartoonModal, CartoonButton } from '../shared/Modal';
import { Context } from '../../pages/Layout';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';
import EmojiPicker from 'emoji-picker-react';

export default function CreateComment({ openModal, setOpenModal, postId, post }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { showInfo, setShowInfo } = useContext(Context);
  const user = getUser();

  const handleEmojiClick = (emojiObject) => {
    setComment(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosService.post(
        `/general_post/${postId}/comment/`,
        { 
          post: postId,
          description: comment,
          author: user.public_id
        }
      );
      
      if (response.status === 201) {
        setComment('');
        setOpenModal(false);
        if (post && typeof post.updateCommentCount === 'function') {
          post.updateCommentCount(prev => prev + 1);
        }
      }
    } catch (error) {
      setShowInfo({
        showMessage: true,
        message: error.response?.data?.error || "Erreur lors de la création du commentaire",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CartoonModal
      show={openModal}
      onClose={() => {
        setOpenModal(false);
        setComment('');
        setShowEmojiPicker(false);
      }}
      title="Ajouter un commentaire"
    >
      <CartoonModal.Body>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-2xl p-3">
                <p className="font-semibold text-sm text-gray-900">
                  {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.first_name}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Écrivez votre commentaire..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                       focus:ring-2 focus:ring-green-500 focus:border-transparent
                       bg-gray-50 resize-none min-h-[100px]"
              disabled={isSubmitting}
            />
            <div className="absolute bottom-3 right-3">
              <CartoonButton
                variant="secondary"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="!p-2"
              >
                😊
              </CartoonButton>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 z-50">
                  <div 
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-lg shadow-lg"
                  >
                    <EmojiPicker 
                      onEmojiClick={handleEmojiClick}
                      width={300}
                      height={400}
                      lazyLoadEmojis={false}
                      searchDisabled={false}
                      skinTonesDisabled={true}
                      emojiStyle="native"
                      previewConfig={{
                        showPreview: false
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CartoonModal.Body>

      <CartoonModal.Footer>
        <CartoonButton
          variant="secondary"
          onClick={() => {
            setOpenModal(false);
            setComment('');
            setShowEmojiPicker(false);
          }}
          disabled={isSubmitting}
        >
          Annuler
        </CartoonButton>
        <CartoonButton
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || !comment.trim()}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Publication...</span>
            </div>
          ) : (
            'Publier'
          )}
        </CartoonButton>
      </CartoonModal.Footer>
    </CartoonModal>
  );
}
