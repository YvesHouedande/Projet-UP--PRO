import React, { useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';

export default function CreateImagePost({ show, onClose }) {
  const [form, setForm] = useState({
    title: "",
    content_type: "IMAGE POST",
    image: null,
  });

  const user = getUser();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title) {
      alert('Le titre est requis.');
      return;
    }

    const formData = new FormData();
    formData.append('author', user.id);
    formData.append('title', form.title);
    formData.append('content_type', form.content_type);
    if (form.image) {
      formData.append('image', form.image);
    }

    axiosService
      .post('/post_user/', formData)
      .then(() => {
        console.log('Post created 🚀');
        setForm({
          title: "",
          image: null,
        });
        onClose();
      })
      .catch((error) => {
        console.log('Error:', error);
        alert('Une erreur s\'est produite lors de l\'envoi du formulaire.');
      });
  };

  return (
    <Modal dismissible show={show} onClose={onClose}>
      <Modal.Header>Poster une image</Modal.Header>
      <Modal.Body>
        <div className='my-4'>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Titre de votre Image..." />
          </div>
          <TextInput
            id="title"
            type="text"
            sizing="sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className='my-4'>
          <div className="mb-2 block">
            <Label htmlFor="imageUpload" value="Télécharger une image..." />
          </div>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-2"
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between">
        <Button onClick={onClose}>Fermer</Button>
        <Button onClick={handleSubmit}>Envoyer</Button>
      </Modal.Footer>
    </Modal>
  );
}
