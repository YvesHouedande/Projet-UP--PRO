import React from 'react'
import { TiThumbsUp } from "react-icons/ti";
import { FaComment } from "react-icons/fa";
import { Badge, Button } from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import AvatarImg from "../../assets/avatar-1.jpg";
import { useState } from "react";
import CommentList from '../comments/CommentList';
import CreateComment from '../comments/CreateComment';

export default function Post({ user, post }) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalComment, setOpenModalComment] = useState(false);

  return (
      <div className='my-2 border p-2 rounded-lg shadow-sm w-auto'>
          <div className="post_header flex justify-between items-center mb-2">
              <div className="header_rigth flex ">
                  <Avatar img={AvatarImg} rounded bordered/>
                  <div className="text_info ml-2">
                      <p className='font-bold text-sm'>Md. Sita Coulibaly</p>
                      <p className='text-xs text-gray-600'>Inspectrice de filiére</p>
                  </div>
              </div>
              <div className="header_left text-right">
                <Badge color="success" size="sm">
                    Administration
                </Badge>
                  <p>8 janvier 2023</p>
                  <p>8H30min</p>
              </div>
          </div>
          <hr className="my-1" />
          <div className="post_content">
              <div className="post_main">
                  
              </div>
              <div className="post_details">
                  
              </div>
          </div>
          <hr className="my-1" />
          <div className="post_footer">
              <div className="stat flex justify-end space-x-2">
                  <p className='underline cursor-pointer'>28 likes</p>
                  <p className='underline cursor-pointer'
                    onClick={() => setOpenModal(true)}
                  >16 commentaires</p>
                  <CommentList openModal={openModal} setOpenModal={setOpenModal} />
              </div>
              <hr className="my-1" />
              <div className="post_actions flex  p-2 justify-between">
                    <Button color='gray' pill onClick={() => alert('Liked')}>
                    Liker <TiThumbsUp  />
                    </Button>
                    <Button color='gray' pill onClick={() => setOpenModalComment(true)}>
                        Commenter <FaComment />
                    </Button>
                  <Button color="gray" pill onClick={() => alert('Unsubscribed')}>
                      Desabonner
                  </Button>
              </div>
              <CreateComment openModal={openModalComment} setOpenModal={setOpenModalComment} />
          </div>
    </div>
  )
}
