import React from 'react';
import Layout from './Layout';
import UserBox from '../components/assets/UserBox';
import { Timeline } from "flowbite-react";
import { getUser } from '../hooks/user.actions';
import NavBox from '../components/assets/NavBox';
import Loading from '../components/assets/Loading';
import TimeLineItem from '../components/assets/TimeLineItem';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import CreateEvent from '../components/events/CreateEvent';

export default function TimeLinePage() {
  const user = getUser();
  const { data, error, isLoading, mutate } = useSWR('/event', fetcher);

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row justify-center mx-auto space-y-5 lg:space-y-0 lg:space-x-5 p-5">
        {/* Sidebar gauche - masqué sur mobile */}
        <div className="hidden lg:block w-1/4 max-w-xs">
          <div className="sticky top-20">
            <UserBox 
              name={user?.username}
              email={user?.email}
              role={user?.status_choice}
              school={user?.school}
            />
            <NavBox />
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="w-full lg:w-1/2 max-w-2xl">
          {/* Bouton de création d'événement */}
          {(user?.status_choice === 'service_manager' || 
            (user?.status_choice === 'etudiant' && user?.is_peer_manager)) && (
            <div className="mb-5">
              <CreateEvent onEventCreated={() => mutate()} />
            </div>
          )}

          {/* Timeline */}
          {isLoading ? (
            <Loading />
          ) : error ? (
            <div className="text-center text-red-500">
              Une erreur est survenue lors du chargement des événements
            </div>
          ) : (
            <Timeline>
              {data?.results?.map((event) => (
                <TimeLineItem 
                  key={event.public_id} 
                  timeline={event}
                  onEventUpdated={() => mutate()}
                />
              ))}
            </Timeline>
          )}
        </div>

        {/* Sidebar droite - masqué sur mobile */}
        <div className="hidden lg:block w-1/4 max-w-xs">
          <div className="sticky top-20">
            <MeetBox />
          </div>
        </div>
      </div>
    </Layout>
  );
}
