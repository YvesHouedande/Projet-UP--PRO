import React, { useState } from 'react';
import useSWR from 'swr';
import { MdEdit } from 'react-icons/md';
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

  if (error) return <div className="text-red-500">Erreur lors du chargement des informations INP</div>;
  if (!inpInfoResponse) return <Loading />;

  const inpInfo = inpInfoResponse.results[0] || null;
  const isNewProfile = !inpInfo;

  const handleEdit = () => setIsEditing(true);
  const handleCloseEdit = () => setIsEditing(false);

  return (
    <div className="info-inp-tab p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Informations INP</h2>
        {canEdit && !isEditing && (
          <button 
            className="flex items-center text-blue-500 hover:underline"
            onClick={handleEdit}
          >
            <MdEdit size={20} className="mr-2" />
            {isNewProfile ? "Créer le profil" : "Modifier les informations"}
          </button>
        )}
      </div>
      {isEditing ? (
        <UpdateINPInfo user={user} inpInfo={inpInfo} handleCloseEdit={handleCloseEdit} mutate={mutate} />
      ) : (
        isNewProfile ? (
          <p>Aucun profil INP n'a été créé pour cet utilisateur.</p>
        ) : (
          <InfoInpDisplay user={user} inpInfo={inpInfo} />
        )
      )}
    </div>
  );
}
