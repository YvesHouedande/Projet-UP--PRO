import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/assets/Hero';
import ProfileNavBox from '../components/assets/ProfileNavBox';
import ProfilFeed from '../components/assets/ProfilFeed';
import PostImage from '../components/assets/PostImage';
import axiosService from '../helpers/axios';
import logo from "../assets/logo.png";
import { getUser } from '../hooks/user.actions';

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosService.get(`/user/${user.public_id}/post`);
        // const response = await axiosService.get(`/post_peer/`);

        setPosts(response.data); 
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user.public_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <div className="text-blue-600 text-lg font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Error: {error.message}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Hero />
      <div className="content p-2">
        <ProfileNavBox />
        <ProfilFeed />
        <div className="main p-4 flex flex-wrap">
          {posts.map((post) => (
            <PostImage key={post.public_id} image={post.file || logo} description={post.title} />
          ))}
        </div>
        <div className="posts">
          {/* Ajouter du contenu ici si nécessaire */}
        </div>
        <a href="#" className="px-4 py-1 inline-block m-auto cursor-pointer text-xl bg-green-700 font-bold text-white h-min rounded-full"> plus</a>
      </div>
    </>
  );
}
