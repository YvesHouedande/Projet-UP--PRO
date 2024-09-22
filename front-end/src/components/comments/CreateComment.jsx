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
    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Commenter</Modal.Header>
      <Modal.Body>
        <div className="relative">
          <div className="mb-2 block">
            <Label htmlFor="description" value="Votre message" />
          </div>
          <Textarea 
            id="description" 
            name="description"
            placeholder="Laissez un commentaire..." 
            required 
            rows={4} 
            value={commentForm.description}
            onChange={handleChange}
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
      </Modal.Body>
      <Modal.Footer className="flex justify-between">
        <Button 
          color="gray" 
          onClick={() => setOpenModal(false)}
          disabled={isSubmitting}
        >
          Fermer
        </Button>
        <Button 
          color="gray" 
          onClick={handleSubmit}
          disabled={isSubmitting || commentForm.description.trim() === ''}
        >
          {isSubmitting ? 'Envoi...' : 'Envoyer'}
        </Button>                  
      </Modal.Footer>
    </Modal>
  );
}
