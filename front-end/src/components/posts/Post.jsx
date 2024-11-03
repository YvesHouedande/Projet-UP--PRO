import React, { useState } from 'react';
import { TiThumbsUp } from "react-icons/ti";
import { FaComment, FaEllipsisV } from "react-icons/fa";
import { Badge, Button } from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import CommentList from '../comments/CommentList';
import CreateComment from '../comments/CreateComment';
import axiosService from '../../helpers/axios';
import {getTimeAgo} from '../../hooks/utils';
import { useNavigate } from 'react-router-dom';

export default function Post({ post }) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalComment, setOpenModalComment] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes_count);
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    // Calcul du temps écoulé
    const timeAgo = getTimeAgo(post.created);

    // Fonction pour gérer le like
    const handleLike = async () => {
        try {
            if (liked) {
                await axiosService.get(`/general_post/${post.public_id}/remove_like`);
                setLikeCount(likeCount - 1);
            } else {
                await axiosService.get(`/general_post/${post.public_id}/like`);
                setLikeCount(likeCount + 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("Erreur lors du like/unlike:", error);
        }
    };

    // Fonction pour tronquer le contenu
    const truncateContent = (content) => {
        if (!content) return ''; // Vérification si content est null ou undefined
        return content.length <= 300 ? content : isExpanded ? content : content.slice(0, 300) + "...";
    };

    // Fonction pour naviguer vers le profil
    const goToProfile = () => {
        navigate(`/profile/${post.author.public_id}`);
    };

    return (
        <div className='border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow'>
            {/* En-tête du post - Réorganisation du badge et de la date */}
            <div className="post_header flex items-start p-3 border-b">
                <div className="flex items-center">
                    <div 
                        onClick={goToProfile}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <Avatar 
                            img={post.author.avatar} 
                            rounded 
                            bordered 
                            className="w-10 h-10"
                        />
                    </div>
                    <div className="ml-3">
                        <p 
                            onClick={goToProfile}
                            className='font-semibold text-sm text-gray-800 cursor-pointer 
                                     hover:text-green-600 transition-colors'
                        >
                            {post.author.first_name}
                        </p>
                        <p className='text-xs text-gray-500'>
                            {post.author.last_name || 'Sans role'}
                        </p>
                    </div>
                </div>

                {/* Badge et date alignés à droite */}
                <div className="ml-auto flex flex-col items-end">
                    <Badge color="success" size="xs" className="text-left">
                        {post.author.status_choice || 'Sans role'}
                    </Badge>
                    <span className='text-xs text-gray-500 mt-1'>{timeAgo}</span>
                </div>
            </div>

            {/* Contenu du post - Meilleur espacement et présentation */}
            <div className="post_content px-3 py-2">
                {post.title && (
                    <h2 className='text-base font-semibold text-gray-800 mb-2'>{post.title}</h2>
                )}
                
                {post.content && (
                    <div className='mb-3'>
                        <p className='text-sm text-gray-600 leading-relaxed'>
                            {truncateContent(post.content)}
                        </p>
                        {post.content.length > 300 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-xs text-green-600 mt-2 hover:underline font-medium"
                            >
                                {isExpanded ? "Voir moins" : "Voir plus"}
                            </button>
                        )}
                    </div>
                )}

                {post.image && (
                    <div className="relative w-full rounded-lg overflow-hidden">
                        <img 
                            src={post.image} 
                            alt="Post content" 
                            className="w-full object-cover max-h-[400px]" 
                        />
                    </div>
                )}
            </div>

            {/* Footer du post - Interactions mieux stylisées */}
            <div className="post_footer px-3 py-2 border-t">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{likeCount} likes</span>
                    <button 
                        className="text-xs text-gray-500 hover:text-green-600"
                        onClick={() => setOpenModal(true)}
                    >
                        Voir les commentaires
                    </button>
                </div>
                
                <div className="flex gap-2 pt-1">
                    <Button 
                        size="xs" 
                        color={liked ? 'success' : 'gray'} 
                        pill 
                        onClick={handleLike}
                        className="flex-1"
                    >
                        <div className="flex items-center justify-center gap-1">
                            <TiThumbsUp className="w-4 h-4"/>
                            <span>{liked ? 'Aimé' : 'Aimer'}</span>
                        </div>
                    </Button>
                    
                    <Button 
                        size="xs" 
                        color='gray' 
                        pill 
                        onClick={() => setOpenModalComment(true)}
                        className="flex-1"
                    >
                        <div className="flex items-center justify-center gap-1">
                            <FaComment className="w-4 h-4"/>
                            <span>Commenter</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Modals */}
            {openModal && (
                <CommentList 
                    openModal={openModal} 
                    postId={post.public_id} 
                    setOpenModal={setOpenModal} 
                />
            )}
            {openModalComment && (
                <CreateComment 
                    postId={post.public_id} 
                    openModal={openModalComment} 
                    setOpenModal={setOpenModalComment} 
                />
            )}
        </div>
    );
}



