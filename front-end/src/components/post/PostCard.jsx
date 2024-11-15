import React, { useState } from 'react';
import { Avatar } from 'flowbite-react';
import { TiThumbsUp } from "react-icons/ti";
import { FaComment } from "react-icons/fa";
import { getTimeAgo } from '../../hooks/utils';

export default function PostCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderPostContent = () => {
    switch (post.content_type) {
      case 'IMAGE POST':
        return (
          <div className="space-y-4">
            {post.title && (
              <h3 className="text-xl font-semibold text-gray-800">
                {post.title}
              </h3>
            )}
            {post.image && (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200
                            shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]
                            hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]
                            transition-all duration-200">
                <img
                  src={post.image}
                  alt={post.title || "Image du post"}
                  className="w-full object-cover max-h-[400px]"
                />
              </div>
            )}
          </div>
        );

      case 'RICH POST':
        return (
          <div className="space-y-4">
            {post.title && (
              <h3 className="text-xl font-semibold text-gray-800">
                {post.title}
              </h3>
            )}
            {post.content && (
              <div className="prose prose-green max-w-none">
                <p className="text-gray-600">
                  {isExpanded ? post.content : post.content.slice(0, 300)}
                  {post.content.length > 300 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-green-600 hover:text-green-700 font-medium ml-2"
                    >
                      {isExpanded ? "Voir moins" : "Voir plus"}
                    </button>
                  )}
                </p>
              </div>
            )}
            {post.image && (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200
                            shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]">
                <img
                  src={post.image}
                  alt={post.title || "Image du post"}
                  className="w-full object-cover max-h-[400px]"
                />
              </div>
            )}
          </div>
        );

      case 'SIMPLE POST':
        return (
          <div className="prose prose-green max-w-none">
            <p className="text-gray-600">
              {isExpanded ? post.content : post.content.slice(0, 300)}
              {post.content.length > 300 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-green-600 hover:text-green-700 font-medium ml-2"
                >
                  {isExpanded ? "Voir moins" : "Voir plus"}
                </button>
              )}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <article className="bg-white rounded-2xl border-2 border-gray-200 p-6 
                     shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]
                     hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]
                     transition-all duration-200">
      {/* En-tête du post */}
      <div className="flex items-center space-x-4 mb-6">
        <Avatar 
          img={post.author?.avatar}
          rounded
          size="md"
          className="border-2 border-gray-200"
        />
        <div>
          <h4 className="font-semibold text-gray-800">
            {post.author?.name || 'Utilisateur'}
          </h4>
          <p className="text-sm text-gray-500">
            {getTimeAgo(post.created)}
          </p>
        </div>
      </div>

      {/* Contenu du post */}
      {renderPostContent()}

      {/* Footer avec interactions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-gray-100">
        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 
                        transition-colors duration-200">
          <TiThumbsUp className="w-6 h-6" />
          <span>{post.likes_count || 0}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 
                        transition-colors duration-200">
          <FaComment className="w-5 h-5" />
          <span>{post.comments_count || 0}</span>
        </button>
      </div>
    </article>
  );
} 