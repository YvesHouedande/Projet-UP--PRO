import React, { useState } from 'react';
import { Modal, Button, FileInput } from 'flowbite-react';
import { getUser, useUserActions } from '../../hooks/user.actions';

export default function UpdateUser({ isModalOpen, handleCloseModal }) {
    const user = getUser();
    const userActions = useUserActions();
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    first_name: user.first_name,
    last_name: user.last_name,
    bio: user.bio || '', // Initialisation vide si aucune bio
    email: user.email,
    status_choice: user.status_choice,
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithFile = new FormData();

    // Ajout des données de l'utilisateur
    Object.keys(formData).forEach(key => {
      formDataWithFile.append(key, formData[key]);
    });

    // Ajout du fichier avatar si disponible
    if (avatarFile) {
      formDataWithFile.append('avatar', avatarFile);
    }

    try {
      // Assurez-vous que vous avez l'ID utilisateur
      userActions.edit(formDataWithFile, user.public_id); // Assurez-vous que votre fonction prend les deux paramètres
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations de l'utilisateur", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  return (
    <Modal show={isModalOpen} onClose={handleCloseModal}>
      <Modal.Header>
        Modifier les Informations
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">Avatar</label>
            <FileInput
              onChange={handleFileChange}
              className="w-full"
              id="avatar"
              name="avatar"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">Nom complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">Prénom</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">Nom de famille</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">Choix de statut</label>
            <input
              type="text"
              name="status_choice"
              value={formData.status_choice}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              color="gray"
              onClick={handleCloseModal}
            >
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
