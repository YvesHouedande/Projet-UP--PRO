import React from 'react'
import Navbar from '../components/Navbar'
import NavBox from '../components/assets/NavBox'
import UserBox from '../components/assets/UserBox'
import Feed from '../components/assets/Feed'
import SuggestionBox from '../components/assets/SuggestionBox'
import MeetBox from '../components/assets/MeetBox'
import Post from '../components/posts/Post'


export default function Home() {
  return (
    <>
      <Navbar />
      <div className="content flex justify-center jus mx-auto space-x-3 lg:py-10 p-5">
        {/* Sidebar - hidden on small screens, sticky on larger screens */}
        <div className="SiberBar w-max sticky top-10 ">
          <UserBox 
            name={"Houedande Yves Warice"}
            lastPub={"25 fevrier 2025"}
            role={"TS INFO2"}
            school={"ESI"}
          />
          <NavBox />
        </div>
        
        {/* Main Content Area */}
        <div className="main lg:w-2/6 overflow-hidden shrink-0 mx-auto ">
          <Feed />
          <Post />
        </div>

        {/* Right Sidebar - hidden on small screens */}
        <div className="rightBar hidden md:block ">
          <SuggestionBox />
          <MeetBox />
        </div>
      </div>
    </>
  );
}
