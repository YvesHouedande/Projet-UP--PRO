import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import UpdateUser from './UpdateUser';
import { getUser } from '../../hooks/user.actions';

// Composant pour afficher un élément d'information
const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <h3 className="text-lg font-medium mb-2">{label}</h3>
    <p className="text-gray-800">{value || "Non spécifié"}</p>
  </div>
);

export default function InfoTab({ user, mutate }) {
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = getUser();
  const canEdit = currentUser && currentUser.public_id === user?.public_id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = async () => {
    setIsEditing(false);
    await mutate();
  };

  return (
    <div className="info-tab p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold">Informations de l'utilisateur</h2>
      {isEditing ? (
        <UpdateUser 
          user={user} 
          handleCloseEdit={handleCloseEdit}
          mutate={mutate}
        />
      ) : (
        <>
          <div className="flex items-center mb-4">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border border-gray-300 mr-4" 
            />
            <div>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.username}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoItem label="Nom complet" value={`${user?.first_name} ${user.last_name}`} />
            <InfoItem label="Statut" value={user?.status_choice} />
            <InfoItem label="Contact" value={"+225 "+user?.number} />
            <InfoItem label="Nombre de publications" value={user?.posts_count} />
            <InfoItem label="Email INP" value={user?.inp_mail || "Aucun email INP"} />
            <InfoItem label="Créé le" value={new Date(user?.created).toLocaleDateString()} />
            <InfoItem label="Mis à jour le" value={new Date(user?.updated).toLocaleDateString()} />
            <InfoItem label="De INP" value={user?.from_inp ? "Oui" : "Non"} />
            {/* <InfoItem label="Bio" value={user?.bio || "Aucune bio ajoutée"} /> */}
          </div>
        </>
      )}
           
      {canEdit && !isEditing && (
          <button 
            className="flex items-center text-blue-500 hover:underline"
            onClick={handleEdit}
          >
            <MdEdit size={20} className="mr-2" />
            Modifier les informations
          </button>
        )}
  
    </div>
  );
}
