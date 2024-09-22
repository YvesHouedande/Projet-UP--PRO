// import React, { useState } from 'react';
// import { TiThumbsUp } from "react-icons/ti";
// import { FaComment } from "react-icons/fa";
// import { Badge, Button } from 'flowbite-react';
// import { Avatar } from 'flowbite-react';
// import CommentList from '../comments/CommentList';
// import CreateComment from '../comments/CreateComment';
// import axiosService from '../../helpers/axios';

// export default function Post({ post }) {
//     const [openModal, setOpenModal] = useState(false);
//     const [openModalComment, setOpenModalComment] = useState(false);
//     const [liked, setLiked] = useState(false);
//     const [likeCount, setLikeCount] = useState(post.likes_count);

//     // Calcul du temps écoulé
//     const timeAgo = getTimeAgo(post.created);

//     // Fonction pour gérer le like
//     const handleLike = async () => {
//         try {
//             if (liked) {
//                 await axiosService.get(`/general_post/${post.public_id}/remove_like`);
//                 setLikeCount(likeCount - 1);
//             } else {
//                 await axiosService.get(`/general_post/${post.public_id}/like`);
//                 setLikeCount(likeCount + 1);
//             }
//             setLiked(!liked);
//         } catch (error) {
//             console.error("Erreur lors du like/unlike:", error);
//         }
//     };

//     return (
//         <div className='my-4 border p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto'>
//             <div className="post_header flex items-center mb-4">
//                 <Avatar img={post.author.avatar} rounded bordered className="w-12 h-12" />
//                 <div className="text_info ml-4">
//                     <p className='font-semibold text-lg'>{post.author.first_name}</p>
//                     <p className='text-sm text-gray-500'>{post.author.last_name || 'Sans role'}</p>
//                 </div>
//                 <div className="ml-auto text-right">
//                     <Badge color="success" size="sm">{post.author.status_choice || 'Sans role'}</Badge>
//                     <p className='text-gray-600 mt-1'>{timeAgo}</p>
//                 </div>
//             </div>
//             <hr className="my-2" />
//             <div className="post_content mb-4">
//                 <h2 className='text-xl font-bold'>{post.title}</h2>
//                 {post.image && <img src={post.image} alt="Post content" className="w-full mt-2 rounded-lg" />}
//                 <p className='mt-2'>{post.content}</p>
//             </div>
//             <hr className="my-2" />
//             <div className="post_footer flex flex-col">
//                 <div className="stat flex justify-between mb-2">
//                     <p className='text-gray-700 underline cursor-pointer'>{likeCount} likes</p>
//                     <p className='text-gray-700 underline cursor-pointer' onClick={() => setOpenModal(true)}>
//                         commentaires
//                     </p>
//                     {openModal &&
//                         <CommentList  openModal={openModal} postId={post.public_id} setOpenModal={setOpenModal} />
//                     }
//                 </div>
//                 <hr className="my-2" />
//                 <div className="post_actions flex space-x-2">
//                     <Button
//                         color='gray'
//                         pill
//                         onClick={handleLike}
//                         className="flex items-center"
//                     >
//                         {liked ? 'Unlike' : 'Like'} <TiThumbsUp className="ml-1"/>
//                     </Button>
//                     <Button
//                         color='gray'
//                         pill
//                         onClick={() => setOpenModalComment(true)}
//                         className="flex items-center"
//                     >
//                         Commenter <FaComment className="ml-1"/>
//                     </Button>
//                     <Button
//                         color="gray"
//                         pill
//                         onClick={() => alert('Unsubscribed')}
//                         className="flex items-center"
//                     >
//                         Désabonner
//                     </Button>
//                 </div>
//             {openModalComment && <CreateComment postId={post.public_id} openModal={openModalComment} setOpenModal={setOpenModalComment} />}
//             </div>
//         </div>
//     );
// }

// // Fonction utilitaire pour calculer le temps écoulé
// function getTimeAgo(date) {
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - new Date(date)) / 60000); // Convertit la différence en minutes

//     if (diffInMinutes < 1) {
//         return "à l'instant";
//     } else if (diffInMinutes < 60) {
//         return `il y a ${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}`;
//     } else if (diffInMinutes < 1440) { // Moins de 24 heures
//         return `il y a ${Math.floor(diffInMinutes / 60)} heure${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''}`;
//     } else {
//         return new Date(date).toLocaleDateString('fr-FR', {
//             weekday: 'short', // Exemple : "lun."
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     }
// }


// import React, { useState } from 'react';
// import { TiThumbsUp } from "react-icons/ti";
// import { FaComment } from "react-icons/fa";
// import { Badge, Button } from 'flowbite-react';
// import { Avatar } from 'flowbite-react';
// import CommentList from '../comments/CommentList';
// import CreateComment from '../comments/CreateComment';
// import axiosService from '../../helpers/axios';

// export default function Post({ post }) {
//     const [openModal, setOpenModal] = useState(false);
//     const [openModalComment, setOpenModalComment] = useState(false);
//     const [liked, setLiked] = useState(false);
//     const [likeCount, setLikeCount] = useState(post.likes_count);
//     const [isExpanded, setIsExpanded] = useState(false); // État pour gérer l'extension du texte

//     // Calcul du temps écoulé
//     const timeAgo = getTimeAgo(post.created);

//     // Fonction pour gérer le like
//     const handleLike = async () => {
//         try {
//             if (liked) {
//                 await axiosService.get(`/general_post/${post.public_id}/remove_like`);
//                 setLikeCount(likeCount - 1);
//             } else {
//                 await axiosService.get(`/general_post/${post.public_id}/like`);
//                 setLikeCount(likeCount + 1);
//             }
//             setLiked(!liked);
//         } catch (error) {
//             console.error("Erreur lors du like/unlike:", error);
//         }
//     };

//     // Fonction pour tronquer le contenu
//     const truncateContent = (content) => {
//         if (content.length <= 300) {
//             return content;
//         }
//         return isExpanded ? content : content.slice(0, 300) + "...";
//     };

//     return (
//         <div className='my-4 border p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto'>
//             <div className="post_header flex items-center mb-4">
//                 <Avatar img={post.author.avatar} rounded bordered className="w-12 h-12" />
//                 <div className="text_info ml-4">
//                     <p className='font-semibold text-lg'>{post.author.first_name}</p>
//                     <p className='text-sm text-gray-500'>{post.author.last_name || 'Sans role'}</p>
//                 </div>
//                 <div className="ml-auto text-left">
//                     <Badge color="success" size="sm">{post.author.status_choice || 'Sans role'}</Badge>
//                     <p className='text-gray-600 mt-1'>{timeAgo}</p>
//                 </div>
//             </div>
//             <hr className="my-2" />
//             <div className="post_content mb-4">
//                 <h2 className='text-xl font-bold'>{post.title}</h2>
//                 {post.image && <img src={post.image} alt="Post content" className="w-full mt-2 rounded-lg" />}
//                 {post.content && (
//                     <>
//                         <p className='mt-2'>{truncateContent(post.content)}</p>
//                         {post.content.length > 300 && (
//                             <Button
//                                 size="sm"
//                                 color="light"
//                                 onClick={() => setIsExpanded(!isExpanded)}
//                                 className="mt-2"
//                             >
//                                 {isExpanded ? "Lire moins" : "Lire plus"}
//                             </Button>
//                         )}
//                     </>
//                 )}
//             </div>
//             <hr className="my-2" />
//             <div className="post_footer flex flex-col">
//                 <div className="stat flex justify-between mb-2">
//                     <p className='text-gray-700 underline cursor-pointer'>{likeCount} likes</p>
//                     <p className='text-gray-700 underline cursor-pointer' onClick={() => setOpenModal(true)}>
//                         commentaires
//                     </p>
//                     {openModal &&
//                         <CommentList  openModal={openModal} postId={post.public_id} setOpenModal={setOpenModal} />
//                     }
//                 </div>
//                 <hr className="my-2" />
//                 <div className="post_actions flex space-x-2">
//                     <Button
//                         color='gray'
//                         pill
//                         onClick={handleLike}
//                         className="flex items-center"
//                     >
//                         {liked ? 'Unlike' : 'Like'} <TiThumbsUp className="ml-1"/>
//                     </Button>
//                     <Button
//                         color='gray'
//                         pill
//                         onClick={() => setOpenModalComment(true)}
//                         className="flex items-center"
//                     >
//                         Commenter <FaComment className="ml-1"/>
//                     </Button>
//                     <Button
//                         color="gray"
//                         pill
//                         onClick={() => alert('Unsubscribed')}
//                         className="flex items-center"
//                     >
//                         Désabonner
//                     </Button>
//                 </div>
//             {openModalComment && <CreateComment postId={post.public_id} openModal={openModalComment} setOpenModal={setOpenModalComment} />}
//             </div>
//         </div>
//     );
// }

// // Fonction utilitaire pour calculer le temps écoulé
// function getTimeAgo(date) {
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - new Date(date)) / 60000); // Convertit la différence en minutes

//     if (diffInMinutes < 1) {
//         return "à l'instant";
//     } else if (diffInMinutes < 60) {
//         return `il y a ${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}`;
//     } else if (diffInMinutes < 1440) { // Moins de 24 heures
//         return `il y a ${Math.floor(diffInMinutes / 60)} heure${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''}`;
//     } else {
//         return new Date(date).toLocaleDateString('fr-FR', {
//             weekday: 'short', // Exemple : "lun."
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     }
// }


import React, { useState } from 'react';
import { TiThumbsUp } from "react-icons/ti";
import { FaComment } from "react-icons/fa";
import { Badge, Button } from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import CommentList from '../comments/CommentList';
import CreateComment from '../comments/CreateComment';
import axiosService from '../../helpers/axios';
import {getTimeAgo} from '../../hooks/utils';

export default function Post({ post }) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalComment, setOpenModalComment] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes_count);
    const [isExpanded, setIsExpanded] = useState(false);

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

    return (
        <div className='my-4 border p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto'>
            <div className="post_header flex items-center mb-4">
                <Avatar img={post.author.avatar} rounded bordered className="w-12 h-12" />
                <div className="text_info ml-4">
                    <p className='font-semibold text-lg'>{post.author.first_name}</p>
                    <p className='text-sm text-gray-500'>{post.author.last_name || 'Sans role'}</p>
                </div>
                <div className="ml-auto text-left">
                    <Badge color="success" size="sm">{post.author.status_choice || 'Sans role'}</Badge>
                    <p className='text-gray-600 mt-1'>{timeAgo}</p>
                </div>
            </div>
            <hr className="my-2" />
            <div className="post_content mb-4">
                <h2 className='text-xl font-bold'>{post.title}</h2>
                {post.image && <img src={post.image} alt="Post content" className="w-full mt-2 rounded-lg" />}
                
                {/* Partie avec fond vert et texte blanc */}
                {post.content && (
                    <div 
                        className='mt-2 p-4 bg-green-500 text-white min-h-[120px] flex items-center justify-center rounded-lg text-base leading-relaxed' 
                        style={{ minHeight: '100px', whiteSpace: 'pre-wrap' }} // Pour s'assurer que le texte garde ses sauts de ligne
                    >
                        <p>{truncateContent(post.content)}</p>
                    </div>
                )}

                {/* Bouton pour lire plus/moins */}
                {post.content && post.content.length > 300 && (
                    <Button
                        size="sm"
                        color="light"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2"
                    >
                        {isExpanded ? "Lire moins" : "Lire plus"}
                    </Button>
                )}
            </div>
            <hr className="my-2" />
            <div className="post_footer flex flex-col">
                <div className="stat flex justify-between mb-2">
                    <p className='text-gray-700 underline cursor-pointer'>{likeCount} likes</p>
                    <p className='text-gray-700 underline cursor-pointer' onClick={() => setOpenModal(true)}>
                        commentaires
                    </p>
                    {openModal && 
                        <CommentList openModal={openModal} postId={post.public_id} setOpenModal={setOpenModal} />
                    }
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
                </div>
                {openModalComment && <CreateComment postId={post.public_id} openModal={openModalComment} setOpenModal={setOpenModalComment} />}
            </div>
        </div>
    );
}



