import React from 'react';
import InpBan from '../../assets/inpBan.png';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../hooks/user.actions';

export default function UserBox({name, email, role, school}) {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
      {/* Bannière avec style cartoon */}
      <div className="relative h-16 overflow-hidden rounded-t-xl bg-gradient-to-r from-green-400 to-blue-400">
        <img 
          src={InpBan} 
          alt="INP-HB Banner" 
          className="w-full h-16 object-contain mix-blend-multiply"
        />
        {/* Effet de vague décoratif */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-white" 
             style={{
               clipPath: "polygon(0 100%, 100% 100%, 100% 0, 75% 50%, 50% 0, 25% 50%, 0 0)"
             }}
        />
      </div>

      {/* Informations utilisateur */}
      <div className="px-4 pb-4 -mt-4 relative">
        {/* Avatar amélioré */}
        <div className="flex justify-center">
          <div className="p-1 bg-white rounded-full shadow-md">
            <img
              src={user?.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-green-400
                         transform hover:rotate-6 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Infos principales avec style ludique */}
        <div className="text-center mt-3">
          <h3 className="font-bold text-sm text-gray-800 hover:text-green-600 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-gray-600 hover:text-blue-500 transition-colors">
            {email}
          </p>
        </div>

        {/* Badges avec style cartoon */}
        <div className="flex justify-center mt-2 gap-2">
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-200 to-green-300 
                          text-green-800 rounded-full transform hover:scale-105 transition-transform 
                          shadow-sm border border-green-400">
            {role}
          </span>
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-200 to-blue-300 
                          text-blue-800 rounded-full transform hover:scale-105 transition-transform 
                          shadow-sm border border-blue-400">
            {school}
          </span>
        </div>

        {/* Bouton profil stylisé */}
        <button
          onClick={() => navigate(`/profile/${user?.public_id}`)}
          className="w-full mt-3 px-4 py-2 text-sm font-medium text-white
                     bg-gradient-to-r from-green-500 to-green-600 
                     rounded-xl transition-all duration-300
                     hover:from-green-600 hover:to-green-700
                     transform hover:scale-105 hover:shadow-md
                     flex items-center justify-center gap-2"
        >
          <span>Voir mon profil</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
