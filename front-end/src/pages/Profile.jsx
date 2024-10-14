import React, { useState } from 'react';
import InfoTab from '../components/profile/InfoTab'; 
import InfoINPTab from '../components/profile/InfoINPTab'; // Ajoutez cette ligne
import PublicationsTab from '../components/profile/PublicationsTab'; 
import EventsTab from '../components/profile/EventsTab'; 
import Layout from './Layout';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import Loading from '../components/assets/Loading';

const tabs = [
  { id: 'info', label: 'Info' },
  { id: 'infoINP', label: 'Info INP' },
  { id: 'publications', label: 'Publications' },
  { id: 'events', label: 'Événements' },
];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('info');
  const { profileId } = useParams();

  const { data: user, error } = useSWR(`/user/${profileId}`, fetcher);

  // Gestion des erreurs et chargement
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <Loading />;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoTab user={user} />;
      case 'infoINP':
        return <InfoINPTab user={user} />;
      case 'publications':
        return <PublicationsTab user={user} />;
      case 'events':
        return <EventsTab user={user} />;
      default:
        return <InfoTab user={user} />;
    }
  };

  return (
    <Layout>
      <div className="content flex flex-col lg:flex-row justify-center mx-auto space-x-3 lg:py-10 p-5">
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
