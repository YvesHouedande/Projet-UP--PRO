import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import Comment from './Comment';
import axiosService from '../../helpers/axios';
import { HiOutlineChatAlt } from 'react-icons/hi';

export default function CommentList({ openModal, setOpenModal, postId}) {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (!openModal || !postId) return;
      
      setIsLoading(true);
      try {
        const response = await axiosService.get(`/general_post/${postId}/comment`);
        setComments(response.data.results);
        setCommentCount(response.data.count);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [openModal, postId]); 

  return (
    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>
        <div className="flex items-center gap-2">
          <HiOutlineChatAlt className="text-xl" />
          <span>Commentaires ({commentCount})</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment key={comment.public_id} comment={comment} />
              ))
            ) : (
              <p className="text-center text-gray-500">Aucun commentaire disponible.</p>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
