import React, { useState } from 'react';
import InfoTab from '../components/profile/InfoTab'; 
import InfoINPTab from '../components/profile/InfoINPTab';
import PublicationsTab from '../components/profile/PublicationsTab'; 
import Layout from './Layout';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import Loading from '../components/assets/Loading';
import NavBox from '../components/assets/NavBox';
import { HiUser, HiAcademicCap, HiNewspaper, HiCalendar } from 'react-icons/hi';

const tabs = [
  { id: 'info', label: 'Info', icon: HiUser },
  { id: 'infoINP', label: 'Info INP', icon: HiAcademicCap },
  { id: 'publications', label: 'Publications', icon: HiNewspaper },
];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('info');
  const { profileId } = useParams();

  const { data: user, error, mutate } = useSWR(`/user/${profileId}`, fetcher);

  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <Loading />;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoTab user={user} mutate={mutate} />;
      case 'infoINP':
        return <InfoINPTab user={user} mutate={mutate} />;
      case 'publications':
        return <PublicationsTab user={user} />;
      default:
        return <InfoTab user={user} mutate={mutate} />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Header Profile */}
        <div className="bg-gradient-to-b from-green-500 to-green-400 p-4 md:p-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={`${user.first_name} ${user.last_name}`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-400 rounded-full border-2 border-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-white/80 mb-2">{user.email}</p>
              <span className="inline-block px-3 py-1 bg-orange-400 text-white rounded-full text-sm">
                {user.status_choice}
              </span>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Navigation Desktop */}
          <div className="hidden lg:block w-64 min-h-screen sticky top-0 p-4">
            <NavBox className="bg-white rounded-2xl border-2 border-green-200 
                             shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)]" />
          </div>

          {/* Contenu principal */}
          <div className="flex-1 w-full">
            {/* Navigation des onglets */}
            <div className="sticky top-0 bg-white shadow-md z-10 overflow-x-auto hide-scrollbar">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 md:px-6 py-4 whitespace-nowrap
                        ${activeTab === tab.id 
                          ? 'border-b-4 border-green-500 text-green-600 font-bold'
                          : 'text-gray-500 hover:text-green-500'
                        }`}
                    >
                      <tab.icon className="text-xl" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
              <div className="bg-white rounded-2xl border-2 border-green-200 
                          shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)] 
                          transition-all duration-200 overflow-hidden">
                <div className="p-4 md:p-6 overflow-x-auto">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <NavBox />
        </div>
      </div>
    </Layout>
  );
}
