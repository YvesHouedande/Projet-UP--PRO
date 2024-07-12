import { React, useState } from 'react'
import { Datepicker } from "flowbite-react";
import { Button, Modal, Label, Textarea, TextInput} from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';

export default function CreateEvent({ show, onClose }) {
    const [des, setDes] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setDes(des + emojiObject.emoji);
    };
    
  return (
        <Modal dismissible show={show} onClose={onClose}>
        <Modal.Header>Creer un Evenement</Modal.Header>
          <Modal.Body>
            <div className='my-4'>
                <div className="mb-2 block">
                <Label htmlFor="small" value="Titre de votre evenement..." />
                </div>
                <TextInput id="small" type="text" sizing="sm" />
            </div>
            <Datepicker language="fr-fr" labelTodayButton="Aujourd'hui" labelClearButton="vider" />
          <div className="relative my-4">
            <div className="mb-2 block">
              <Label htmlFor="des" value="Decrivez votre evenement" />
            </div>
            <Textarea 
              id="des" 
              placeholder="Decrire l'evenement" 
              required 
              rows={4} 
              value={des}
              onChange={(e) => setDes(e.target.value)}
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
          <Button onClick={onClose}>Fermer</Button>
           <Button>Envoyer</Button>                
        </Modal.Footer>
      </Modal>
      
  )
}
