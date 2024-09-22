import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import Comment from './Comment';
import axiosService from '../../helpers/axios';

export default function CommentList({ openModal, setOpenModal, postId}) {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState("");


  useEffect(() => {
    const fetchComments = async () => {
      if (openModal && postId) {
        try {
          const response = await axiosService.get(`/general_post/${postId}/comment`);
          setComments(response.data.results);
          setCommentCount(response.data.count);

        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    fetchComments();

  }, [openModal, postId]); 

  return (
    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Commentaire - {commentCount} </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment key={comment.public_id} comment={comment} />
            ))
          ) : (
            <p>Aucun commentaire disponible.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
