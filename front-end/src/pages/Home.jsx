import React, { useState, useCallback } from 'react';
import NavBox from '../components/assets/NavBox';
import UserBox from '../components/assets/UserBox';
import Feed from '../components/assets/Feed';
import MeetBox from '../components/assets/MeetBox';  
import Post from '../components/posts/Post';
import { getUser } from '../hooks/user.actions';
import { fetcher } from '../helpers/axios';
import Loading from '../components/assets/Loading';
import MessageModal from '../components/assets/MessageModal';
import Layout from './Layout';
import InfiniteScroll from 'react-infinite-scroll-component';
import { HiMenuAlt2 } from 'react-icons/hi';
import { usePosts } from '../hooks/posts.actions';

export default function Home() {
  const user = getUser();
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);

  const getSourceFromStatus = () => {
    return user.status_choice || 'etudiant';
  };

  const source = getSourceFromStatus();
  const { posts, error, isLoading, mutate, createPost } = usePosts(source);

  const handleNewPost = useCallback(() => {
    mutate();
  }, [mutate]);

  const nextUrl = posts?.next;

  // Fonction pour charger plus de posts
  const fetchMorePosts = async () => {
    if (!nextUrl) return;
    try {
      const newData = await fetcher(nextUrl);
      mutate({
        ...posts,
        results: [...posts.results, ...newData.results],
        next: newData.next
      }, false);
    } catch (err) {
      console.error('Erreur lors de la récupération des publications:', err);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <MessageModal message={"Erreur de chargement"} />;

  return (
    <Layout>
      <div className="lg:hidden fixed bottom-4 right-4 z-50 flex gap-2">
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
              next={fetchMorePosts}
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
