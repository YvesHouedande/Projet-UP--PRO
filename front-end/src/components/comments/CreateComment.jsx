import React, { useState } from 'react';
import { Label, Textarea, Modal, Button } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';

export default function CreateComment({ openModal, setOpenModal }) {
  const [comment, setComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setComment(comment + emojiObject.emoji);
  };

  return (
    <>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Commenter</Modal.Header>
        <Modal.Body>
          <div className="relative">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Your message" />
            </div>
            <Textarea 
              id="comment" 
              placeholder="Leave a comment..." 
              required 
              rows={4} 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Fermer
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Envoyer
          </Button>                  
        </Modal.Footer>
      </Modal>
    </>
  );
}
