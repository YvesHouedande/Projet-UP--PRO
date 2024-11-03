import React, { useState, useCallback } from 'react';
import NavBox from '../components/assets/NavBox';
import UserBox from '../components/assets/UserBox';
import Feed from '../components/assets/Feed';
import MeetBox from '../components/assets/MeetBox';  
import Post from '../components/posts/Post';
import { getUser } from '../hooks/user.actions';
import { fetcher } from '../helpers/axios';
import useSWR from 'swr';
import Loading from '../components/assets/Loading';
import MessageModal from '../components/assets/MessageModal';
import Layout from './Layout';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const user = getUser();
  const [posts, setPosts] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);

  const { data, error, isLoading } = useSWR('/general_post', fetcher, {
    revalidateOnFocus: false, 
    onSuccess: (data) => {
      if (data.results) {
        setPosts(data.results);
        setNextUrl(data.next);
      }
    },
  });

  const fetchMorePosts = useCallback(async () => {
    if (!nextUrl) return; 
    try {
      const newData = await fetcher(nextUrl);
      setPosts((prevPosts) => [...prevPosts, ...newData.results]);
      setNextUrl(newData.next);
    } catch (err) {
      console.error('Erreur lors de la récupération des publications:', err);
    }
  }, [nextUrl]);

  if (isLoading) return <Loading />;
  if (error) return <MessageModal message={"Erreur de chargement"} />;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-2 py-2 lg:py-3 px-1 lg:px-2 max-w-[1000px] mx-auto">
        {/* Sidebar gauche - Largeur augmentée */}
        <aside className="lg:w-[280px] lg:sticky lg:top-20 lg:self-start">
          <div className="hidden lg:block space-y-2">
            <UserBox 
              name={user.username}
              email={user.email}
              role={"TS INFO2"}
              school={"ESI"}
              AvatarImg={user.avatar}
            />
            <NavBox />
          </div>
          {/* Version mobile du NavBox */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-50">
            <NavBox />
          </div>
        </aside>

        {/* Contenu principal - Plus compact */}
        <main className="flex-1 max-w-[380px] mx-auto w-full pb-20 lg:pb-0">
          <div className="space-y-2">
            <Feed />
            <InfiniteScroll
              dataLength={posts.length}
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
                {posts.map(post => (
                  <Post key={post.public_id} post={post} />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </main>

        {/* Sidebar droite - Largeur augmentée */}
        <aside className="hidden lg:block lg:w-[280px] lg:sticky lg:top-20 lg:self-start">
          <MeetBox />
        </aside>
      </div>
    </Layout>
  );
}
