import React, { useState } from 'react';
import { HiAcademicCap, HiOfficeBuilding, HiUserGroup } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import CreateComment from '../comments/CreateComment';
import CommentList from '../comments/CommentList';
import axiosService from '../../helpers/axios';

// Constantes pour éviter la répétition
const SOURCE_CONFIG = {
  etudiant: {
    icon: <HiAcademicCap className="w-5 h-5" />,
    label: 'Étudiant',
    styles: 'bg-blue-100 text-blue-600'
  },
  service: {
    icon: <HiOfficeBuilding className="w-5 h-5" />,
    label: 'Service',
    styles: 'bg-purple-100 text-purple-600'
  },
  promotion: {
    icon: <HiUserGroup className="w-5 h-5" />,
    label: 'Promotion',
    styles: 'bg-green-100 text-green-600'
  }
};

const STATUS_LABELS = {
  etudiant: 'Étudiant',
  professeur: 'Professeur',
  personnel: 'Personnel'
};

export default function Post({ post, isOptimistic = false, user }) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [liked, setLiked] = useState(post.liked_by_user);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openCommentListModal, setOpenCommentListModal] = useState(false);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } else if (days > 0) {
      return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return 'à l\'instant';
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await axiosService.delete(`/general_post/${post.public_id}/unlike/`);
        setLikesCount(prev => prev - 1);
      } else {
        await axiosService.post(`/general_post/${post.public_id}/like/`);
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const sourceConfig = SOURCE_CONFIG[post.source] || SOURCE_CONFIG.etudiant;

  const handleCommentClick = () => {
    if (commentsCount > 0) {
      // S'il y a des commentaires, ouvrir la liste
      setOpenCommentListModal(true);
    } else {
      // S'il n'y a pas de commentaires, ouvrir le formulaire de création
      setOpenCreateModal(true);
    }
  };

  return (
    <div className={`
      relative bg-white rounded-2xl border-2 border-gray-200 p-6 
      shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]
      ${isOptimistic ? 'opacity-70' : ''}
    `}>
      {/* En-tête du post */}
      <div className="flex items-center justify-between mb-4">
        {/* Partie gauche : Avatar et infos utilisateur */}
        <div className="flex items-center space-x-3">
          <img
            src={post.author?.avatar || '/default-avatar.png'}
            alt={`${post.author?.first_name} ${post.author?.last_name}`}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900">
              {post.author?.last_name}
            </h3>
            <h4 className="text-sm text-gray-700">
              {post.author?.first_name}
            </h4>
 
          </div>
        </div>

        {/* Partie droite : Badge et temps écoulé */}
        <div className="flex flex-col items-end">
          {/* Badge */}
          <div className={`
            flex items-center px-3 py-1 rounded-full text-sm mb-1
            ${sourceConfig.styles}
          `}>
            <span className="mr-1">{sourceConfig.icon}</span>
            <span>{sourceConfig.label}</span>
          </div>

          {/* Temps écoulé */}
          <time 
            className="text-xs text-gray-500"
            title={new Date(post.created).toLocaleString('fr-FR')}
          >
            {getTimeAgo(post.created)}
          </time>
        </div>
      </div>

      {/* Contenu du post */}
      <div className="space-y-4">
        {post.title && (
          <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
        )}
        
        {post.content && (
          <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
        )}

        {post.image && (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={post.image}
              alt={post.title || "Image du post"}
              className="w-full object-cover max-h-96"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Footer - Interactions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors
              ${liked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
          >
            <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likesCount}</span>
          </button>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleCommentClick}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{commentsCount}</span>
            </button>
            {commentsCount > 0 && (
              <button 
                onClick={() => setOpenCreateModal(true)}
                className="text-sm text-blue-500 hover:underline"
              >
                Ajouter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateComment 
        openModal={openCreateModal}
        setOpenModal={setOpenCreateModal}
        postId={post.public_id}
        post={{
          updateCommentCount: setCommentsCount
        }}
      />

      <CommentList 
        openModal={openCommentListModal}
        setOpenModal={setOpenCommentListModal}
        postId={post.public_id}
      />

      {/* Indicateur de chargement */}
      {isOptimistic && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-2xl">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            <span className="text-sm text-gray-500">Publication en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
}



