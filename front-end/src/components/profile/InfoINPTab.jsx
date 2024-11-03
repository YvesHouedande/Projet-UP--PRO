import React, { useState } from 'react';
import useSWR from 'swr';
import { HiPencilAlt } from 'react-icons/hi';
import axiosService, { fetcher } from '../../helpers/axios';
import Loading from '../assets/Loading';
import { getUser } from '../../hooks/user.actions';
import UpdateINPInfo from './UpdateINPInfo';
import InfoInpDisplay from './InfoInpDisplay';

export default function InfoINPTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = getUser();
  const canEdit = currentUser && currentUser.public_id === user?.public_id;

  const getEndpoint = (status) => {
    switch(status) {
      case 'etudiant': return 'student';
      case 'professeur': return 'professor';
      case 'personnel': return 'personnel';
      default: return '';
    }
  };

  const { data: inpInfoResponse, error, mutate } = useSWR(
    () => `/user/${user.public_id}/${getEndpoint(user.status_choice)}/`,
    fetcher
  );

  if (error) return (
    <div className="p-6 text-center">
      <p className="text-red-500 bg-red-50 p-4 rounded-xl border-2 border-red-200">
        Erreur lors du chargement des informations INP
      </p>
    </div>
  );
  
  if (!inpInfoResponse) return <Loading />;

  const inpInfo = inpInfoResponse.results[0] || null;
  const isNewProfile = !inpInfo;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Informations INP</h2>
        {canEdit && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 
                     rounded-xl hover:bg-orange-200 transition-colors duration-200
                     border-2 border-orange-200 shadow-[3px_3px_0px_0px_rgba(251,146,60,0.3)]"
          >
            <HiPencilAlt className="text-xl" />
            {isNewProfile ? "Créer le profil" : "Modifier"}
          </button>
        )}
      </div>

      {isEditing ? (
        <UpdateINPInfo 
          user={user} 
          inpInfo={inpInfo} 
          handleCloseEdit={() => setIsEditing(false)} 
          mutate={mutate} 
        />
      ) : (
        isNewProfile ? (
          <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
            <p className="text-gray-600">
              Aucun profil INP n'a été créé pour cet utilisateur.
            </p>
          </div>
        ) : (
          <InfoInpDisplay user={user} inpInfo={inpInfo} />
        )
      )}
    </div>
  );
}
