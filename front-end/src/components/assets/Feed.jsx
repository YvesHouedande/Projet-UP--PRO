import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { TfiWrite } from 'react-icons/tfi';
import { FaCalendarAlt } from 'react-icons/fa';
import { AiTwotoneAudio } from 'react-icons/ai';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import CreateEvent from '../events/CreateEvent';
import RichPost from '../posts/CreateRichPost';
import { CiText } from "react-icons/ci";
import CreateImagePost from '../posts/CreateImagePost';


export default function Feed() {
  const [IsRichPostOpen, setIsRichPostOpen] = useState(false);
  const [IsEventOpen, setIsEventOpen] = useState(false);
  const [IsCreateImagePostOpen, setIsCreateImagePostOpen] = useState(false);

  return (
    <div className=''>
      <div className="feed border border-gray-300 rounded-md p-4 w-auto ">
        <p>Faire Un Post...</p>
        <hr className="my-2" />
        <div className="actions flex justify-between space-x-4">
          <FaImage className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsCreateImagePostOpen(true)} /> 
          <TfiWrite className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsRichPostOpen(true)} />
          <FaCalendarAlt className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsEventOpen(true)}/>
          <AiTwotoneAudio className="w-8 h-8 hover:cursor-pointer" />
          <MdOutlineVideoLibrary className="w-8 h-8 hover:cursor-pointer" />
          <CiText className="w-8 h-8 hover:cursor-pointer"/>
        </div>
      </div>

      {IsEventOpen && (<CreateEvent show={IsEventOpen} onClose={() => setIsEventOpen(false)} />)}
      {IsRichPostOpen && (<RichPost show={IsRichPostOpen} onClose={() => setIsRichPostOpen(false)} />)}
      {IsCreateImagePostOpen && ( <CreateImagePost show={IsCreateImagePostOpen} onClose={() => setIsCreateImagePostOpen(false)}/> )}
      
   </div>
  );
}
