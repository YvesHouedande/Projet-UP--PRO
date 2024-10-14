// import React from 'react';
// import NavBox from '../components/assets/NavBox';
// import UserBox from '../components/assets/UserBox';
// import Feed from '../components/assets/Feed';
// import SuggestionBox from '../components/assets/SuggestionBox';
// import MeetBox from '../components/assets/MeetBox';
// import Post from '../components/posts/Post';
// import { getUser } from '../hooks/user.actions';
// import { fetcher } from '../helpers/axios';
// import useSWR from 'swr';
// import Loading from '../components/assets/Loading';
// import MessageModal from '../components/assets/MessageModal';
// import Layout from './Layout';

// export default function Home() {
//   const user = getUser();
//   const { data, error, isLoading } = useSWR('/general_post', fetcher, {
//     refreshInterval: 40000,
//   });

//   if (isLoading) return <Loading />;
//   if (error) return <MessageModal message={"Erreur de chargement"} />;

//   return (
//     <Layout>
//       <div className="content flex justify-center mx-auto space-x-3 lg:py-10 p-5">
//         {/* Sidebar - hidden on small screens, sticky on larger screens */}
//         <div className="SiberBar w-max sticky top-10 hidden lg:block">
//           <UserBox
//             name={user.username}
//             email={user.email}
//             role={"TS INFO2"}
//             school={"ESI"}
//             AvatarImg={user.avatar}
//           />
//           <NavBox />
//         </div>
        
//         {/* Main Content Area */}
//         <div className="main lg:w-2/6 overflow-hidden shrink-0 mx-auto">
//           <Feed />
//           {/* Map through the posts and render each post */}
//           {data.results?.map(post => (
//           <Post key={post.public_id} post={post} />
//           ))}
//         </div>

//         {/* Right Sidebar - hidden on small screens */}
//         <div className="rightBar hidden md:block">
//           <SuggestionBox />
//           <MeetBox />
//         </div>
//       </div>
//     </Layout>
//   );
// }



// import React, { useState, useCallback, useEffect } from 'react';
// import NavBox from '../components/assets/NavBox';
// import UserBox from '../components/assets/UserBox';
// import Feed from '../components/assets/Feed';
// import SuggestionBox from '../components/assets/SuggestionBox';
// import MeetBox from '../components/assets/MeetBox';
// import Post from '../components/posts/Post';
// import { getUser } from '../hooks/user.actions';
// import { fetcher } from '../helpers/axios';
// import useSWR, { mutate } from 'swr';
// import Loading from '../components/assets/Loading';
// import MessageModal from '../components/assets/MessageModal';
// import Layout from './Layout';
// import InfiniteScroll from 'react-infinite-scroll-component';

// export default function Home() {
//   const user = getUser();
//   const [posts, setPosts] = useState([]);
//   const [nextUrl, setNextUrl] = useState(null);

//   // SWR for fetching posts
//   const { data, error, isLoading } = useSWR('/general_post', fetcher, {
//     refreshInterval: 40000, // Auto refresh every 40 seconds
//     revalidateOnFocus: false, // Disable revalidation on window focus
//     onSuccess: (data) => {
//       if (data.results) {
//         // Replace the posts with the most recent ones on success
//         setPosts(data.results);
//         setNextUrl(data.next); // Set the next page URL
//       }
//     },
//   });

//   // Fetch more posts on scroll
//   const fetchMorePosts = useCallback(async () => {
//     if (!nextUrl) return; // If no next URL, stop loading more posts
//     try {
//       const newData = await fetcher(nextUrl);
//       setPosts((prevPosts) => [...prevPosts, ...newData.results]);
//       setNextUrl(newData.next); // Set new next page URL
//     } catch (err) {
//       console.error('Erreur lors de la récupération des publications:', err);
//     }
//   }, [nextUrl]);

//   // Manually refresh data (e.g. after scrolling or at specific times)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       mutate('/general_post'); // Force SWR to revalidate and fetch the latest data
//     }, 40000); // Interval to manually invalidate cache every 40 seconds

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   if (isLoading) return <Loading />;
//   if (error) return <MessageModal message={"Erreur de chargement"} />;

//   return (
//     <Layout>
//       <div className="content flex justify-center mx-auto space-x-3 lg:py-10 p-5">
//         {/* Sidebar - hidden on small screens, sticky on larger screens */}
//         <div className="SiberBar w-max sticky top-10 hidden lg:block">
//           <UserBox
//             name={user.username}
//             email={user.email}
//             role={"TS INFO2"}
//             school={"ESI"}
//             AvatarImg={user.avatar}
//           />
//           <NavBox />
//         </div>
        
//         {/* Main Content Area */}
//         <div className="main lg:w-2/6 overflow-hidden shrink-0 mx-auto">
//           <Feed />
//           {/* Infinite Scroll */}
//           <InfiniteScroll
//             dataLength={posts.length}
//             next={fetchMorePosts}
//             hasMore={!!nextUrl}
//             loader={<h4>Chargement...</h4>}
//             endMessage={<p className="text-center my-4">Plus de publications disponibles.</p>}
//           >
//             {posts.map(post => (
//               <Post key={post.public_id} post={post} />
//             ))}
//           </InfiniteScroll>
//         </div>

//         {/* Right Sidebar - hidden on small screens */}
//         <div className="rightBar hidden md:block">
//           <SuggestionBox />
//           <MeetBox />
//         </div>
//       </div>
//     </Layout>
//   );
// }



// import React, { useState, useCallback, useEffect } from 'react';
// import NavBox from '../components/assets/NavBox';
// import UserBox from '../components/assets/UserBox';
// import Feed from '../components/assets/Feed';
// import SuggestionBox from '../components/assets/SuggestionBox';
// import MeetBox from '../components/assets/MeetBox';
// import Post from '../components/posts/Post';
// import { getUser } from '../hooks/user.actions';
// import { fetcher } from '../helpers/axios';
// import useSWR, { mutate } from 'swr';
// import Loading from '../components/assets/Loading';
// import MessageModal from '../components/assets/MessageModal';
// import Layout from './Layout';
// import InfiniteScroll from 'react-infinite-scroll-component';

// export default function Home() {
//   const user = getUser();
//   const [posts, setPosts] = useState([]);
//   const [nextUrl, setNextUrl] = useState(null);
//   const [newPostsAvailable, setNewPostsAvailable] = useState(false); // Indicateur de nouveaux posts

//   // SWR for fetching posts
//   const { data, error, isLoading } = useSWR('/general_post', fetcher, {
//     refreshInterval: 40000, // Auto refresh every 40 seconds
//     revalidateOnFocus: false, // Disable revalidation on window focus
//     onSuccess: (data) => {
//       if (data.results) {
//         setPosts(data.results);
//         setNextUrl(data.next);
//       }
//     },
//   });

//   // Vérifier si de nouveaux posts sont disponibles
//   useEffect(() => {
//     const checkForNewPosts = async () => {
//       try {
//         const latestData = await fetcher('/general_post');
//         if (latestData.results[0]?.public_id !== posts[0]?.public_id) {
//           setNewPostsAvailable(true); // Afficher l'indicateur de nouveaux posts
//         }
//       } catch (error) {
//         console.error('Erreur lors de la vérification des nouveaux posts:', error);
//       }
//     };

//     const interval = setInterval(() => {
//       checkForNewPosts();
//     }, 40000); // Vérification toutes les 40 secondes

//     return () => clearInterval(interval);
//   }, [posts]);

//   // Charger les nouveaux posts à la demande
//   const loadNewPosts = () => {
//     mutate('/general_post'); // Force SWR à récupérer les nouvelles données
//     setNewPostsAvailable(false); // Masquer la notification après le chargement
//   };

//   // Fetch more posts on scroll
//   const fetchMorePosts = useCallback(async () => {
//     if (!nextUrl) return;
//     try {
//       const newData = await fetcher(nextUrl);
//       setPosts((prevPosts) => [...prevPosts, ...newData.results]);
//       setNextUrl(newData.next);
//     } catch (err) {
//       console.error('Erreur lors de la récupération des publications:', err);
//     }
//   }, [nextUrl]);

//   if (isLoading) return <Loading />;
//   if (error) return <MessageModal message={"Erreur de chargement"} />;

//   return (
//     <Layout>
//       <div className="content flex justify-center mx-auto space-x-3 lg:py-10 p-5">
//         {/* Sidebar - hidden on small screens, sticky on larger screens */}
//                   {/* Indicateur pour les nouveaux posts */}
//           {newPostsAvailable && (
//             <div className="new-posts-notification bg-blue-500 text-white text-center p-2 my-2 rounded cursor-pointer" onClick={loadNewPosts}>
//               Nouveaux posts disponibles ! Cliquez ici pour les charger.
//             </div>
//           )}

//         <div className="SiberBar w-max sticky top-10 hidden lg:block">
//           <UserBox
//             name={user.username}
//             email={user.email}
//             role={"TS INFO2"}
//             school={"ESI"}
//             AvatarImg={user.avatar}
//           />
//           <NavBox />
//         </div>
        
//         {/* Main Content Area */}
//         <div className="main lg:w-2/6 overflow-hidden shrink-0 mx-auto">
//           <Feed />


//           {/* Infinite Scroll */}
//           <InfiniteScroll
//             dataLength={posts.length}
//             next={fetchMorePosts}
//             hasMore={!!nextUrl}
//             loader={<h4>Chargement...</h4>}
//             endMessage={<p className="text-center my-4">Plus de publications disponibles.</p>}
//           >
//             {posts.map(post => (
//               <Post key={post.public_id} post={post} />
//             ))}
//           </InfiniteScroll>
//         </div>

//         {/* Right Sidebar - hidden on small screens */}
//         <div className="rightBar hidden md:block">
//           <SuggestionBox />
//           <MeetBox />
//         </div>
//       </div>
//     </Layout>
//   );
// }



// import React, { useState, useCallback, useEffect } from 'react';
// import NavBox from '../components/assets/NavBox';
// import UserBox from '../components/assets/UserBox';
// import Feed from '../components/assets/Feed';
// import SuggestionBox from '../components/assets/SuggestionBox';
// import MeetBox from '../components/assets/MeetBox';
// import Post from '../components/posts/Post';
// import { getUser } from '../hooks/user.actions';
// import { fetcher } from '../helpers/axios';
// import useSWR, { mutate } from 'swr';
// import Loading from '../components/assets/Loading';
// import MessageModal from '../components/assets/MessageModal';
// import Layout from './Layout';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { FaBell } from 'react-icons/fa'; // Icone de cloche (React Icons)

// export default function Home() {
//   const user = getUser();
//   const [posts, setPosts] = useState([]);
//   const [nextUrl, setNextUrl] = useState(null);
//   const [newPostsCount, setNewPostsCount] = useState(0); // Compteur de nouveaux posts

//   // SWR for fetching posts
//   const { data, error, isLoading } = useSWR('/general_post', fetcher, {
//     refreshInterval: 40000, // Auto refresh every 40 seconds
//     revalidateOnFocus: false, // Disable revalidation on window focus
//     onSuccess: (data) => {
//       if (data.results) {
//         setPosts(data.results);
//         setNextUrl(data.next);
//       }
//     },
//   });

//   // Vérifier si de nouveaux posts sont disponibles
//   useEffect(() => {
//     const checkForNewPosts = async () => {
//       try {
//         const latestData = await fetcher('/general_post');
//         const newCount = latestData.results.filter(
//           (post) => !posts.some((existingPost) => existingPost.public_id === post.public_id)
//         ).length;

//         if (newCount > 0) {
//           setNewPostsCount(newCount); // Mettre à jour le nombre de nouveaux posts
//         }
//       } catch (error) {
//         console.error('Erreur lors de la vérification des nouveaux posts:', error);
//       }
//     };

//     const interval = setInterval(() => {
//       checkForNewPosts();
//     }, 40000); // Vérification toutes les 40 secondes

//     return () => clearInterval(interval);
//   }, [posts]);

//   // Charger les nouveaux posts à la demande
//   const loadNewPosts = () => {
//     mutate('/general_post'); // Force SWR à récupérer les nouvelles données
//     setNewPostsCount(0); // Réinitialiser le compteur après chargement
//   };

//   // Fetch more posts on scroll
//   const fetchMorePosts = useCallback(async () => {
//     if (!nextUrl) return;
//     try {
//       const newData = await fetcher(nextUrl);
//       setPosts((prevPosts) => [...prevPosts, ...newData.results]);
//       setNextUrl(newData.next);
//     } catch (err) {
//       console.error('Erreur lors de la récupération des publications:', err);
//     }
//   }, [nextUrl]);

//   if (isLoading) return <Loading />;
//   if (error) return <MessageModal message={"Erreur de chargement"} />;

//   return (
//     <Layout>
//       <div className="content flex justify-center mx-auto space-x-3 lg:py-10 p-5">
//         {/* Sidebar - hidden on small screens, sticky on larger screens */}
//         <div className="SiberBar w-max sticky top-10 hidden lg:block">
//           <UserBox
//             name={user.username}
//             email={user.email}
//             role={"TS INFO2"}
//             school={"ESI"}
//             AvatarImg={user.avatar}
//           />
//           <NavBox />
//         </div>
        
//         {/* Main Content Area */}
//         <div className="main lg:w-2/6 overflow-hidden shrink-0 mx-auto">
//           <Feed />

//           {/* Infinite Scroll */}
//           <InfiniteScroll
//             dataLength={posts.length}
//             next={fetchMorePosts}
//             hasMore={!!nextUrl}
//             loader={<h4>Chargement...</h4>}
//             endMessage={<p className="text-center my-4">Plus de publications disponibles.</p>}
//           >
//             {posts.map(post => (
//               <Post key={post.public_id} post={post} />
//             ))}
//           </InfiniteScroll>
//         </div>

//         {/* Right Sidebar - hidden on small screens */}
//         <div className="rightBar hidden md:block">
//           <SuggestionBox />
//           <MeetBox />
//         </div>

//         {/* Icône flottante pour les nouveaux posts */}
//         {newPostsCount > 0 && (
//           <div
//             className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full p-4 shadow-lg cursor-pointer flex items-center space-x-2"
//             onClick={loadNewPosts} // Charger les nouveaux posts au clic
//           >
//             <FaBell className="text-2xl" /> {/* Icone de cloche */}
//             <span className="font-bold">{newPostsCount} nouveaux posts</span>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }



import React, { useState, useCallback, useEffect } from 'react';
import NavBox from '../components/assets/NavBox';
import UserBox from '../components/assets/UserBox';
import Feed from '../components/assets/Feed';
import SuggestionBox from '../components/assets/SuggestionBox';
import MeetBox from '../components/assets/MeetBox';  
import Post from '../components/posts/Post';
import { getUser } from '../hooks/user.actions';
import { fetcher } from '../helpers/axios';
import useSWR, { mutate } from 'swr';
import Loading from '../components/assets/Loading';
import MessageModal from '../components/assets/MessageModal';
import Layout from './Layout';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FaBell } from 'react-icons/fa';

export default function Home() {
  const user = getUser();
  const [posts, setPosts] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);

  // SWR for fetching posts
  const { data, error, isLoading } = useSWR('/general_post', fetcher, {
    revalidateOnFocus: false, 
    onSuccess: (data) => {
      if (data.results) {
        setPosts(data.results);
        setNextUrl(data.next);
      }
    },
  });


  // Fetch more posts on scroll
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
      <div className="content flex justify-center mx-auto space-x-3 lg:py-10 p-5">
        {/* Sidebar - hidden on small screens, sticky on larger screens */}
        <div className="SiberBar w-max sticky top-10 hidden lg:block">
          <UserBox 
            name={user.username}
            email={user.email}
            role={"TS INFO2"}
            school={"ESI"}
            AvatarImg={user.avatar}
          />
          <NavBox />
        </div>
        
        {/* Main Content Area */}
        <div className="main lg:w-2/6 overflow-hidden shrink-0 mx-auto">
          <Feed />
          
            {/* Ref pour le conteneur des posts */}
          <div >
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMorePosts}
              hasMore={!!nextUrl}
              loader={<h4>Chargement...</h4>}
              endMessage={<p className="text-center my-4">Plus de publications disponibles.</p>}
            >
              {posts.map(post => (
                <Post key={post.public_id} post={post} />
              ))}
            </InfiniteScroll>
          </div>
        </div>

        {/* Right Sidebar - hidden on small screens */}
        <div className="rightBar hidden md:block">
          {/* <SuggestionBox /> */}
          <MeetBox />
        </div>
      </div>
    </Layout>
  );
}
