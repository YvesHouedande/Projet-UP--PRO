import React, { useState } from 'react';
import { TiThumbsUp } from "react-icons/ti";
import { FaComment } from "react-icons/fa";
import { Badge, Button } from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import CommentList from '../comments/CommentList';
import CreateComment from '../comments/CreateComment';
import axiosService from '../../helpers/axios'

export default function Post({ post }) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalComment, setOpenModalComment] = useState(false);
    const [liked, setLiked] = useState(false);

    // Formatage de l'heure
    const formattedTime = new Date(post.created).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(':', 'h') + 'min';

    // Calcul du temps écoulé
    const timeAgo = getTimeAgo(post.created);

    // Fonction pour gérer le like
    const handleLike = async () => {
        try {
            const response = liked
                ? await axiosService.get(post.like_links.unlike_link)
                : await axiosService.get(post.like_links.like_link);
            setLiked(!liked);
            // Mettez à jour le nombre de likes si nécessaire
            console.log(response.data);
        } catch (error) {
            console.error("Erreur lors du like/unlike:", error);
        }
    };

    return (
        <div className='my-4 border p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto'>
            <div className="post_header flex items-center mb-4">
                <Avatar img={post.author.avatar} rounded bordered className="w-12 h-12"/>
                <div className="text_info ml-4">
                    <p className='font-semibold text-lg'>{post.author.name}</p>
                    <p className='text-sm text-gray-500'>{post.author.bio || 'Sans bio'}</p>
                </div>
                <div className="ml-auto text-right">
                    <Badge color="success" size="sm">Administration</Badge>
                    <p className='text-gray-600 mt-1'>{timeAgo}</p>
                </div>
            </div>
            <hr className="my-2" />
            <div className="post_content mb-4">
                <h2 className='text-xl font-bold'>{post.title}</h2>
                <p className='mt-2'>{post.content}</p>
                {post.image && <img src={post.image} alt="Post content" className="w-full mt-2 rounded-lg"/>}
            </div>
            <hr className="my-2" />
            <div className="post_footer flex flex-col">
                <div className="stat flex justify-between mb-2">
                    <p className='text-gray-700 underline cursor-pointer'>{post.likes_count} likes</p>
                    <p className='text-gray-700 underline cursor-pointer' onClick={() => setOpenModal(true)}>
                        {post.comments_count} commentaires
                    </p>
                    <CommentList openModal={openModal} setOpenModal={setOpenModal} />
                </div>
                <hr className="my-2" />
                <div className="post_actions flex space-x-2">
                    <Button 
                        color='gray' 
                        pill 
                        onClick={handleLike} 
                        className="flex items-center"
                    >
                        {liked ? 'Unlike' : 'Like'} <TiThumbsUp className="ml-1"/>
                    </Button>
                    <Button 
                        color='gray' 
                        pill 
                        onClick={() => setOpenModalComment(true)} 
                        className="flex items-center"
                    >
                        Commenter <FaComment className="ml-1"/>
                    </Button>
                    <Button 
                        color="gray" 
                        pill 
                        onClick={() => alert('Unsubscribed')} 
                        className="flex items-center"
                    >
                        Désabonner
                    </Button>
                </div>
                <CreateComment openModal={openModalComment} setOpenModal={setOpenModalComment} />
            </div>
        </div>
    );
}

// Fonction utilitaire pour calculer le temps écoulé
function getTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / 60000); // Convertit la différence en minutes

    if (diffInMinutes < 1) {
        return "à l'instant";
    } else if (diffInMinutes < 60) {
        return `il y a ${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) { // Moins de 24 heures
        return `il y a ${Math.floor(diffInMinutes / 60)} heure${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''}`;
    } else {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'short', // Exemple : "lun."
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}
