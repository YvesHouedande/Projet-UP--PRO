import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { TfiWrite } from 'react-icons/tfi';
import { FaCalendarAlt } from 'react-icons/fa';
import { AiTwotoneAudio } from 'react-icons/ai';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import CreateEvent from '../events/CreateEvent';
import RichPost from '../posts/CreateRichPost';
import { CiText } from "react-icons/ci";
import CreateImagePost from '../posts/CreateImagePost';
import MessageModal from './MessageModal';
import CreateSimplePost from '../posts/CreateSimplePost';


export default function Feed({refresh}) {
  const [IsEventOpen, setIsEventOpen] = useState(false);
  const [IsCreateSimplePostOpen, setIsCreateSimplePostOpen] = useState(false);
  const [IsRichPostOpen, setIsRichPostOpen] = useState(false);
  const [IsCreateImagePostOpen, setIsCreateImagePostOpen] = useState(false);

  return (
    <div className='w-full'>
      <div className="feed border-2 border-gray-300 rounded-2xl bg-white shadow-lg 
                      transform hover:-translate-y-1 transition-all duration-300">
        {/* Zone de saisie */}
        <div className="p-3 border-b-2 border-gray-200">
          <div 
            onClick={() => setIsCreateSimplePostOpen(true)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100
                       rounded-xl text-sm text-gray-600 cursor-pointer 
                       hover:shadow-inner transition-all duration-300
                       border-2 border-gray-200 hover:border-green-400"
          >
            Que voulez-vous partager ?
          </div>
        </div>

        {/* Actions */}
        <div className="px-3 py-2">
          <div className="grid grid-cols-4 gap-2">
            {/* Post simple */}
            <button 
              onClick={() => setIsCreateSimplePostOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl
                         bg-gradient-to-r from-gray-50 to-gray-100
                         hover:from-green-50 hover:to-green-100
                         border-2 border-gray-200 hover:border-green-400
                         transform hover:scale-105 transition-all duration-300
                         group"
            >
              <CiText className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
              <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-green-600">
                Texte
              </span>
            </button>

            {/* Similaire pour les autres boutons */}
            <button 
              onClick={() => setIsCreateImagePostOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl
                         bg-gradient-to-r from-gray-50 to-gray-100
                         hover:from-green-50 hover:to-green-100
                         border-2 border-gray-200 hover:border-green-400
                         transform hover:scale-105 transition-all duration-300
                         group"
            >
              <FaImage className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
              <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-green-600">
                Photo
              </span>
            </button>

            <button 
              onClick={() => setIsRichPostOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl
                         bg-gradient-to-r from-gray-50 to-gray-100
                         hover:from-green-50 hover:to-green-100
                         border-2 border-gray-200 hover:border-green-400
                         transform hover:scale-105 transition-all duration-300
                         group"
            >
              <TfiWrite className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
              <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-green-600">
                Article
              </span>
            </button>

            <button 
              onClick={() => setIsEventOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl
                         bg-gradient-to-r from-gray-50 to-gray-100
                         hover:from-green-50 hover:to-green-100
                         border-2 border-gray-200 hover:border-green-400
                         transform hover:scale-105 transition-all duration-300
                         group"
            >
              <FaCalendarAlt className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
              <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-green-600">
                Événement
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {IsEventOpen && (
        <CreateEvent 
          show={IsEventOpen} 
          onClose={() => setIsEventOpen(false)} 
        />
      )}
      {IsCreateSimplePostOpen && (
        <CreateSimplePost 
          show={IsCreateSimplePostOpen} 
          onClose={() => setIsCreateSimplePostOpen(false)} 
        />
      )}
      {IsRichPostOpen && (
        <RichPost 
          show={IsRichPostOpen} 
          onClose={() => setIsRichPostOpen(false)} 
        />
      )}
      {IsCreateImagePostOpen && (
        <CreateImagePost 
          refresh={refresh} 
          show={IsCreateImagePostOpen} 
          onClose={() => setIsCreateImagePostOpen(false)}
        />
      )}
    </div>
  );
}
