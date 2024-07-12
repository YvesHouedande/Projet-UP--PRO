import React from 'react'
import { Button, Modal } from 'flowbite-react';
import Comment from './Comment';

export default function CommentList({openModal, setOpenModal}) {
  return (
    <>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Commentaires</Modal.Header>
        <Modal.Body>
            <div className="space-y-6">
                <Comment/>    
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Ferme
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
