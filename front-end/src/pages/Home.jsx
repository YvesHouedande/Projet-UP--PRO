import React, { useState, useCallback, useEffect, useRef } from 'react';
import NavBox from '../components/assets/NavBox';
import UserBox from '../components/assets/UserBox';
import Feed from '../components/assets/Feed';
import MeetBox from '../components/assets/MeetBox';  
import Post from '../components/posts/Post';
import { getUser } from '../hooks/user.actions';
import Loading from '../components/assets/Loading';
import MessageModal from '../components/assets/MessageModal';
import Layout from './Layout';
import InfiniteScroll from 'react-infinite-scroll-component';
import { HiMenuAlt2 } from 'react-icons/hi';
import { usePosts } from '../hooks/posts.actions';
import { IoRefresh } from "react-icons/io5";
import axiosService from '../helpers/axios';

export default function Home() {
  const user = getUser();
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);
  const [refreshComplete, setRefreshComplete] = useState(false);

  const getSourceFromStatus = () => {
    return user.status_choice || 'etudiant';
  };

  const source = getSourceFromStatus();
  const { posts: apiPosts, error, isLoading, mutate, createPost } = usePosts(source);

  const handleNewPost = useCallback(() => {
    mutate();
  }, [mutate]);

  // Fonction pour charger les posts initiaux
  const loadInitialPosts = async () => {
    try {
      const response = await axiosService.get('/general_post/');
      setPosts(response.data.results);
      setNextUrl(response.data.next);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    }
  };

  // Fonction pour charger plus de posts
  const loadMorePosts = async () => {
    if (loading || !nextUrl) return;
    
    setLoading(true);
    try {
      const response = await axiosService.get(nextUrl);
      setPosts(prev => [...prev, ...response.data.results]);
      setNextUrl(response.data.next);
    } catch (error) {
      console.error('Erreur lors du chargement des posts supplémentaires:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaire de rafraîchissement
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await axiosService.get('/general_post/');
      setPosts(response.data.results);
      setNextUrl(response.data.next);
      setRefreshComplete(true);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Configuration de l'Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && nextUrl) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [nextUrl]);

  // Chargement initial
  useEffect(() => {
    loadInitialPosts();
  }, []);

  useEffect(() => {
    if (refreshComplete) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setRefreshComplete(false);
    }
  }, [refreshComplete]);

  if (isLoading) return <Loading />;
  if (error) return <MessageModal message={"Erreur de chargement"} />;

  return (
    <Layout>
      <div className="fixed bottom-20 right-4 z-50 flex gap-2">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`bg-green-500 text-white p-3 rounded-full shadow-lg 
                     hover:bg-green-600 transition-all duration-300
                     ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <IoRefresh className="w-6 h-6" />
        </button>
      </div>

      <div className="lg:hidden fixed top1-10 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <HiMenuAlt2 className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 py-2 lg:py-3 px-1 lg:px-2 max-w-[1000px] mx-auto">
        {/* Sidebar gauche */}
        <aside className={`
          lg:w-[280px] lg:sticky lg:top-20 lg:self-start
          fixed lg:relative inset-0 bg-white z-40
          transform transition-transform duration-300 ease-in-out
          ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setShowLeftSidebar(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <UserBox 
              name={user.username}
              email={user.email}
              role={"TS INFO2"}
              school={"ESI"}
              AvatarImg={user.avatar}
            />
            <NavBox />
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 max-w-[380px] mx-auto w-full pb-20 lg:pb-0">
          <div className="space-y-2">
            <Feed 
              onPostCreated={handleNewPost}
              source={source}
              createPost={createPost}
            />
            <InfiniteScroll
              dataLength={posts.length || 0}
              next={loadMorePosts}
              hasMore={!!nextUrl}
              loader={<div className="text-center py-2">Chargement...</div>}
              endMessage={
                <p className="text-center text-gray-500 py-2">
                  Plus de publications disponibles.
                </p>
              }
            >
              <div className="space-y-2">
                {posts.map((post) => (
                  <Post 
                    key={post.public_id} 
                    post={post}
                    onPostUpdated={() => mutate()}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </main>

        {/* Sidebar droite */}
        <aside className="hidden lg:block lg:w-[280px] lg:sticky lg:top-20 lg:self-start">
          <MeetBox />
        </aside>

        {/* NavBox mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-50">
          <NavBox />
        </div>

        {/* Overlay mobile */}
        {showLeftSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowLeftSidebar(false)}
          />
        )}
      </div>
    </Layout>
  );
}
