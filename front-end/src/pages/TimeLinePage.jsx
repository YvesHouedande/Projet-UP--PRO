import React from 'react'
import Layout from './Layout';
import UserBox from '../components/assets/UserBox';
import { Button, Timeline } from "flowbite-react";
import { getUser } from '../hooks/user.actions';
import NavBox from '../components/assets/NavBox';
import Loading from '../components/assets/Loading';
import MeetBox from '../components/assets/MeetBox';
import TimeLineItem from '../components/assets/TimeLineItem';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';



const testEvents = [
  {
    label: "Conférence sur l'IA",
    moment: "2024-09-20T10:30:00",
    place: "Université de Côte d'Ivoire",
    description: "Une conférence intéressante sur l'avenir de l'intelligence artificielle et son impact sur différents secteurs.",
    cover: "https://images.pexels.com/photos/6831511/pexels-photo-6831511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    service: { name: "Service Informatique" },
  },
  {
    label: "Hackathon Blockchain",
    moment: "2024-10-15T09:00:00",
    place: "Tech Hub Abidjan",
    description: "Participez à un hackathon pour explorer les nouvelles possibilités offertes par la blockchain.",
    cover: "https://images.pexels.com/photos/6831511/pexels-photo-6831511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    service: { name: "Service Développement" },
  },
  {
    label: "Séminaire Sécurité",
    moment: "2024-11-10T14:00:00",
    place: "Palais des Congrès",
    description: "Un séminaire dédié à la cybersécurité et aux meilleures pratiques pour protéger les données en entreprise.",
    cover: "https://images.pexels.com/photos/8919231/pexels-photo-8919231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    service: { name: "Service Sécurité" },
  },
];


export default function TimeLinePage() {
  const user = getUser();

  const { data, error, isLoading } = useSWR('/event', fetcher, {
  });

  // if (isLoading) return <Loading />;
  // if (error) return <MessageModal message={"Erreur de chargement"} />;
  return (
    <Layout>
      <div className="content flex justify-center mx-auto space-x-5 lg:py-10 p-5">
        {/* Sidebar - hidden on small screens, sticky on larger screens */}
        {/* <div className="SiberBar w-max sticky top-10 hidden lg:block">
          <UserBox 
            name={user.username}
            lastPub={"25 février 2025"}
            role={"TS INFO2"}
            school={"ESI"}
            AvatarImg={user.avatar}
          />
          <NavBox />
        </div> */}
        
        {/* Main Content Area */}
        <div className="lg:w-2/6 overflow-hidden shrink-0 mx-auto p-5">
        <Timeline>
          {data?.results?.map((event, index) => (
            <TimeLineItem key={index} timeline={event} />
          ))}
        </Timeline>
        </div>

      </div>
    </Layout>
  );
}
