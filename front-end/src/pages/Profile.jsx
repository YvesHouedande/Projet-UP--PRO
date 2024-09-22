// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import Hero from '../components/assets/Hero';
// import ProfileNavBox from '../components/assets/ProfileNavBox';
// import ProfilFeed from '../components/assets/ProfilFeed';
// import PostImage from '../components/assets/PostImage';
// import axiosService from '../helpers/axios';
// import logo from "../assets/logo.png";
// import { getUser } from '../hooks/user.actions';
// import Loading from '../components/assets/Loading';

// export default function Profile() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const user = getUser();

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axiosService.get(`/user/${user.public_id}/post`);
//         // const response = await axiosService.get(`/post_peer/`);

//         setPosts(response.data);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, [user.public_id]);

//   if (loading) {
//     return <Loading/>
//   }

//   if (error) {
//     return (
//       <div>
//         Error: {error.message}
//         <button onClick={() => window.location.reload()}>Retry</button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <Hero />
//       <div className="content p-2">
//         <ProfileNavBox />
//         <ProfilFeed />
//         <div className="main p-4 flex flex-wrap">
//           {posts.map((post) => (
//             <PostImage key={post.public_id} image={post.file || logo} description={post.title} />
//           ))}
//         </div>
//         <div className="posts">
//           {/* Ajouter du contenu ici si nécessaire */}
//         </div>
//         <a href="#" className="px-4 py-1 inline-block m-auto cursor-pointer text-xl bg-green-700 font-bold text-white h-min rounded-full"> plus</a>
//       </div>
//     </>
//   );
// }


import React, { useState } from 'react';
import UserBox from '../components/assets/UserBox';
import InfoTab from '../components/profile/InfoTab'; // À créer
import PublicationsTab from '../components/profile/PublicationsTab'; // À créer
import EventsTab from '../components/profile/EventsTab'; // À créer
import ContactTab from '../components/profile/ContactTab'; // À créer
import Layout from './Layout';
import { getUser } from '../hooks/user.actions';

const tabs = [
  { id: 'info', label: 'Info' },
  { id: 'publications', label: 'Publications' },
  { id: 'events', label: 'Événements' },
  { id: 'contact', label: 'Contact' }
];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('info');
  
  // Dummy user data (replace with actual data)
  const user = getUser()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoTab user={user} />;
      case 'publications':
        return <PublicationsTab />;
      case 'events':
        return <EventsTab />;
      case 'contact':
        return <ContactTab />;
      default:
        return <InfoTab user={user} />;
    }
  };

  return (
    <Layout>
      <div className="content flex flex-col lg:flex-row justify-center mx-auto space-x-3 lg:py-10 p-5">
        {/* Sidebar */}
        {/* <div className="sidebar w-max lg:w-1/4 lg:sticky lg:top-10">
          <UserBox 
            name={user.username}
            email={user.email}
            role={user.role}
            school={user.school}
            AvatarImg={user.avatar}
          />
        </div> */}

        {/* Main Content Area */}
        <div className="main-content lg:w-3/4 p-5">
          {/* Tabs */}
          <div className="tabs flex border-b border-gray-300 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-item p-2 border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'} transition-colors duration-300`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}
