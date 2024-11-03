import React, { useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import UpdateUser from './UpdateUser';
import { getUser } from '../../hooks/user.actions';

const InfoItem = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl border-2 border-green-200 
                  shadow-[3px_3px_0px_0px_rgba(34,197,94,0.2)]
                  hover:shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)]
                  transition-all duration-200">
    <h3 className="text-sm font-medium text-green-600 mb-1">{label}</h3>
    <p className="text-gray-800 font-medium">{value || "Non spécifié"}</p>
  </div>
);

export default function InfoTab({ user, mutate }) {
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = getUser();
  const canEdit = currentUser && currentUser.public_id === user?.public_id;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Informations complémentaires</h2>
        {canEdit && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 
                     rounded-xl hover:bg-orange-200 transition-colors duration-200
                     border-2 border-orange-200 shadow-[3px_3px_0px_0px_rgba(251,146,60,0.3)]"
          >
            <HiPencilAlt className="text-xl" />
            Modifier
          </button>
        )}
      </div>

      {isEditing ? (
        <UpdateUser 
          user={user} 
          handleCloseEdit={async () => {
            setIsEditing(false);
            await mutate();
          }}
          mutate={mutate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Contact" value={"+225 "+user?.number} />
          <InfoItem label="Publications" value={user?.posts_count} />
          <InfoItem label="Email INP" value={user?.inp_mail} />
          <InfoItem label="De INP" value={user?.from_inp ? "Oui" : "Non"} />
          <InfoItem 
            label="Créé le" 
            value={new Date(user?.created).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} 
          />
          <InfoItem 
            label="Mis à jour le" 
            value={new Date(user?.updated).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} 
          />
        </div>
      )}
    </div>
  );
}
