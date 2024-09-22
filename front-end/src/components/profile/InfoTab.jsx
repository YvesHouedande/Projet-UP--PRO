import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import UpdateUser from './UpdateUser';

export default function InfoTab({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="info-tab p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border border-gray-300 mr-4" />
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.username}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="info-item">
          <h3 className="text-lg font-medium mb-2">Nom complet</h3>
          <p className="text-gray-800">{user.first_name} {user.last_name}</p>
        </div>
        <div className="info-item">
          <h3 className="text-lg font-medium mb-2">Statut</h3>
          <p className="text-gray-800">{user.status_choice}</p>
        </div>
        <div className="info-item">
          <h3 className="text-lg font-medium mb-2">Nombre de publications</h3>
          <p className="text-gray-800">{user.posts_count}</p>
        </div>
        <div className="info-item">
          <h3 className="text-lg font-medium mb-2">Email INP</h3>
          <p className="text-gray-800">{user.inp_mail || "Aucun email INP"}</p>
        </div>
        <div className="info-item">
          <h3 className="text-lg font-medium mb-2">Créé le</h3>
          <p className="text-gray-800">{new Date(user.created).toLocaleDateString()}</p>
        </div>
        <div className="info-item">
          <h3 className="text-lg font-medium mb-2">Mis à jour le</h3>
          <p className="text-gray-800">{new Date(user.updated).toLocaleDateString()}</p>
        </div>
        <div className="info-item">
          <h3 className="text-lg font-medium mb-2">De INP</h3>
          <p className="text-gray-800">{user.from_inp ? "Oui" : "Non"}</p>
        </div>
        <div className="info-item">
          <h3 className="text-lg font-medium mb-2">Bio</h3>
          <p className="text-gray-800">{user.bio || "Aucune bio ajoutée"}</p>
        </div>
      </div>

      <button 
        className="flex items-center text-blue-500 hover:underline mt-4"
        onClick={handleOpenModal}
      >
        <MdEdit size={20} className="mr-2" />
        Modifier les informations
      </button>
      {isModalOpen && <UpdateUser isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} /> }

    </div>
  );
}

