import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { TfiWrite } from 'react-icons/tfi';
import { FaCalendarAlt } from 'react-icons/fa';
import CreateEvent from '../events/CreateEvent';
import RichPost from '../posts/CreateRichPost';
import { CiText } from "react-icons/ci";
import CreateImagePost from '../posts/CreateImagePost';
import CreateSimplePost from '../posts/CreateSimplePost';


export default function Feed({ onPostCreated, peerId, serviceId, source }) {
  const [IsEventOpen, setIsEventOpen] = useState(false);
  const [IsCreateSimplePostOpen, setIsCreateSimplePostOpen] = useState(false);
  const [IsRichPostOpen, setIsRichPostOpen] = useState(false);
  const [IsCreateImagePostOpen, setIsCreateImagePostOpen] = useState(false);

  // Déterminer le placeholder selon le contexte
  const getPlaceholder = () => {
    switch(source) {
      case 'promotion':
        return "Publier une annonce pour la promotion...";
      case 'service':
        return "Publier une annonce pour le service...";
      default:
        return "Que voulez-vous partager ?";
    }
  };

  // Déterminer si on doit afficher le bouton événement
  const showEventButton = source === 'service';

  // Fonction de callback pour la création réussie
  const handlePostCreated = (newPost) => {
    if (onPostCreated) {
      onPostCreated(newPost);
    }
  };

  // Déterminer la source en fonction du contexte
  const getPostSource = () => {
    if (serviceId) return 'service';
    if (peerId) return 'promotion';
    return source;
  };

  return (
    <div className='w-full'>
      <div className="feed border-2 border-gray-300 rounded-2xl bg-white shadow-lg">
        {/* Zone de saisie */}
        <div className="p-3 border-b-2 border-gray-200">
          <div 
            onClick={() => setIsCreateSimplePostOpen(true)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100
                     rounded-xl text-sm text-gray-600 cursor-pointer"
          >
            {getPlaceholder()}
          </div>
        </div>

        {/* Actions */}
        <div className="px-3 py-2">
          <div className={`grid ${showEventButton ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
            {/* Boutons existants avec props de contexte */}
            <button 
              onClick={() => setIsCreateSimplePostOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50"
            >
              <CiText className="w-6 h-6" />
              <span className="text-xs mt-1">Texte</span>
            </button>

            <button 
              onClick={() => setIsCreateImagePostOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50"
            >
              <FaImage className="w-6 h-6" />
              <span className="text-xs mt-1">Photo</span>
            </button>

            <button 
              onClick={() => setIsRichPostOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50"
            >
              <TfiWrite className="w-6 h-6" />
              <span className="text-xs mt-1">Article</span>
            </button>

            {showEventButton && (
              <button 
                onClick={() => setIsEventOpen(true)}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50"
              >
                <FaCalendarAlt className="w-6 h-6" />
                <span className="text-xs mt-1">Événement</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals avec le nouveau callback */}
      {IsCreateSimplePostOpen && (
        <CreateSimplePost 
          show={IsCreateSimplePostOpen} 
          onClose={() => setIsCreateSimplePostOpen(false)}
          onPostCreated={handlePostCreated}
          peerId={peerId}
          serviceId={serviceId}
          source={getPostSource()}
        />
      )}
      {IsRichPostOpen && (
        <RichPost 
          show={IsRichPostOpen} 
          onClose={() => setIsRichPostOpen(false)}
          onPostCreated={handlePostCreated}
          peerId={peerId}
          serviceId={serviceId}
          source={getPostSource()}
        />
      )}
      {IsCreateImagePostOpen && (
        <CreateImagePost 
          show={IsCreateImagePostOpen} 
          onClose={() => setIsCreateImagePostOpen(false)}
          onPostCreated={handlePostCreated}
          peerId={peerId}
          serviceId={serviceId}
          source={getPostSource()}
        />
      )}
      {IsEventOpen && source === 'service' && (
        <CreateEvent 
          show={IsEventOpen} 
          onClose={() => setIsEventOpen(false)}
          serviceId={serviceId}
        />
      )}
    </div>
  );
}
