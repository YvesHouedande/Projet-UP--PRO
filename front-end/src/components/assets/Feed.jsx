import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { TfiWrite } from 'react-icons/tfi';
import { FaCalendarAlt } from 'react-icons/fa';
import { AiTwotoneAudio } from 'react-icons/ai';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import CreateEvent from '../events/CreateEvent';
import CKEditorComponent from './CKEditorComponent';
import { CiText } from "react-icons/ci";

export default function Feed() {
  const [IsCkEditorOpen, setIsCkEditorOpen] = useState(false);
  const [IsEventOpen, setIsEventOpen] = useState(false);

  return (
    <div className=''>
      <div className="feed border border-gray-300 rounded-md p-4 w-auto ">
        <p>Faire Un Post...</p>
        <hr className="my-2" />
        <div className="actions flex justify-between space-x-4">
          <FaImage className="w-8 h-8 hover:cursor-pointer" />
          <TfiWrite className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsCkEditorOpen(true)} />
          <FaCalendarAlt className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsEventOpen(true)}/>
          <AiTwotoneAudio className="w-8 h-8 hover:cursor-pointer" />
          <MdOutlineVideoLibrary className="w-8 h-8 hover:cursor-pointer" />
          <CiText className="w-8 h-8 hover:cursor-pointer"/>
        </div>
      </div>

      {IsCkEditorOpen && (<CKEditorComponent show={IsCkEditorOpen} onClose={() => setIsCkEditorOpen(false)} />)}
      {IsEventOpen && ( <CreateEvent show={IsEventOpen} onClose={() => setIsEventOpen(false)}/> )}
      
   </div>
  );
}
