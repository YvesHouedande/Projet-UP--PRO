import React, { useContext } from 'react';
import { Button, Modal } from 'flowbite-react';
import { Context } from '../../pages/Layout';

const MessageModal = ({ message, type }) => {
  const messageColor = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    inp_mail: 'text-yellow-500',
    error: 'text-red-500',
  }[type || 'error'];

  const { showInfo, setShowInfo } = useContext(Context);

  const openMail = () => {
    setShowInfo(prev => ({
      ...prev,
      showMailBox: true,
      showMessage: false
    }));
  };

  const closeModal = () => {
    setShowInfo(prev => ({
      ...prev,
      showMessage: false
    }));
  };

  return (
    <Modal show={showInfo?.showMessage} onClose={closeModal}>
      <Modal.Header>Message</Modal.Header>
      <Modal.Body>
        <p className={messageColor}>
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer>
        {type === "inp_mail" && (<Button onClick={openMail}>Valider le mail</Button>)}
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
