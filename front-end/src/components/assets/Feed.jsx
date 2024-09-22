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
import MessageModal from './MessageModal';
import CreateSimplePost from '../posts/CreateSimplePost';


export default function Feed({refresh}) {
  const [IsRichPostOpen, setIsRichPostOpen] = useState(false);
  const [IsEventOpen, setIsEventOpen] = useState(false);
  const [IsCreateImagePostOpen, setIsCreateImagePostOpen] = useState(false);
  const [IsCreateSimplePostOpen, setIsCreateSimplePostOpen] = useState(false);

  

  return (
    <div className=''>
      <div className="feed border border-gray-300 rounded-md p-4 w-auto ">
        <p>Faire Un Post...</p>
        <hr className="my-2" />
        <div className="actions flex justify-between space-x-4">
          <FaImage className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsCreateImagePostOpen(true)} /> 
          <TfiWrite className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsRichPostOpen(true)} />
          <FaCalendarAlt className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsEventOpen(true)}/>
          {/* <AiTwotoneAudio className="w-8 h-8 hover:cursor-pointer" />
          <MdOutlineVideoLibrary className="w-8 h-8 hover:cursor-pointer" /> */}
          <CiText className="w-8 h-8 hover:cursor-pointer" onClick={() => setIsCreateSimplePostOpen(true)}/>
        </div>
      </div>

      {IsEventOpen && (<CreateEvent show={IsEventOpen} onClose={() => setIsEventOpen(false)} />)}
      {IsCreateSimplePostOpen && (<CreateSimplePost show={IsCreateSimplePostOpen} onClose={() => setIsCreateSimplePostOpen(false)} />)}
      {IsRichPostOpen && (<RichPost show={IsRichPostOpen} onClose={() => setIsRichPostOpen(false)} />)}
      {IsCreateImagePostOpen && ( <CreateImagePost refresh={refresh} show={IsCreateImagePostOpen} onClose={() => setIsCreateImagePostOpen(false)}/> )}
       
   </div>
  );
}

    // <>
    //   <Navbar />
    //   <div className="content flex justify-center jus mx-auto space-x-3 lg:py-10 p-5">
    //     {/* Sidebar - hidden on small screens, sticky on larger screens */}
    //     <div className="SiberBar w-max sticky top-10">
    //       <UserBox 
    //         name={user.username}
    //         lastPub={"25 fevrier 2025#"}
    //         role={"TS INFO2#"}
    //         school={"ESI#"}
    //         AvatarImg={user.avatar}
    //       />
    //       <NavBox />
    //     </div>
        
    //     {/* Main Content Area */}
    //     <div className="main lg:w-2/6 overflow-hidden shrink-0 mx-auto">
    //       <Feed />
    //       {/* Map through the posts and render each post */}
    //       {data.results?.map(post => (
    //         <Post key={post.public_id} post={post} />
    //       ))}
    //     </div>

    //     {/* Right Sidebar - hidden on small screens */}
    //     <div className="rightBar hidden md:block">
    //       <SuggestionBox />
    //       <MeetBox />
    //     </div>
    //   </div>
    // </>
