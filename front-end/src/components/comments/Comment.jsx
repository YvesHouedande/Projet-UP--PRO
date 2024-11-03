import React from 'react';
import { Avatar } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function Comment({ comment }) {
  const { author, description, created } = comment;
  
  const formatDate = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffTime = Math.abs(now - commentDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `Il y a ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays}j`;
    } else {
      return commentDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border-2 border-green-200 
                    shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)] 
                    hover:shadow-[7px_7px_0px_0px_rgba(34,197,94,0.2)] 
                    transition-all duration-200 ease-in-out">
        <Link to={`/profile/${author.id}`} className="relative">
          <Avatar 
            img={author.avatar}
            alt={`Avatar de ${author.first_name} ${author.last_name}`}
            rounded
            size="md"
            className="hover:ring-2 hover:ring-orange-300 transition-all"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white" />
        </Link>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              to={`/profile/${author.id}`}
              className="font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              {author.first_name} {author.last_name}
            </Link>
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
              {formatDate(created)}
            </span>
          </div>
          
          <div className="bg-green-50 p-3 rounded-xl">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
