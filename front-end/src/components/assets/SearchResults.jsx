import React from 'react';
import { getStateTime } from '../../hooks/utils';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
        navigate(`/profile/${user.public_id}/`);
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-lg mb-2 text-black">
            <div className="flex items-center">
                <img 
                    src={user.avatar} 
                    alt={`${user.first_name} ${user.last_name}`} 
                    className="w-16 h-16 object-cover rounded-full mr-4" 
                />
                <div>
                    <h3 className="font-bold text-lg">
                        {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-600">{user.status_choice}</p>
                    <button 
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                        onClick={handleNavigateToProfile}
                    >
                        Voir Profil
                    </button>
                </div>
            </div>
        </div>
    );
};

const SchoolCard = ({ school }) => (
  <div className="p-4 border border-gray-300 rounded-lg shadow-lg mb-2">
    <h3 className="font-bold text-lg">{school.name}</h3>
    <p className="text-gray-600">{school.description}</p>
    <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">Voir École</button>
  </div>
);

const PublicationCard = ({ publication }) => (
  <div className="p-4 border border-gray-300 rounded-lg shadow-lg mb-2">
    <h3 className="font-bold text-lg">{publication.title}</h3>
    <p className="text-gray-600">Par {publication.author}</p>
    <p>{publication.content}</p>
    <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">Lire Plus</button>
  </div>
);

const EventCard = ({ event }) => {
  const { status, formattedDate } = getStateTime(event.moment);

  // Choisir une couleur en fonction de l'état de l'événement
  const statusColor = status === "passé" ? "bg-red-500" : status === "en cours" ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-lg mb-2 text-black">
      <h3 className="font-bold text-lg">{event.label}</h3>
      <p className="text-gray-600">Service: {event.service_label}</p>
      
      <div className="flex items-center">
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${statusColor}`}></span>
        <p>Moment: {formattedDate} ({status})</p>
      </div>
      
      <p>Lieu: {event.place}</p>
      <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">Voir Événement</button>
    </div>
  );
};

const PeerCard = ({ peer }) => {
  const navigate = useNavigate();

  const handleNavigateToPeer = () => {
    navigate(`/peer/${peer.public_id}`);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-lg mb-2 text-black hover:bg-gray-50">
      <div className="flex items-center">
        {peer.cover && (
          <img 
            src={peer.cover} 
            alt={peer.label}
            className="w-16 h-16 object-cover rounded-lg mr-4" 
          />
        )}
        <div className="flex-1">
          <h3 className="font-bold text-lg">{peer.label}</h3>
          <div className="text-gray-600">
            <p>Filière: {peer.study_label}</p>
            <p>École: {peer.school_label}</p>
            <p>Année: {new Date(peer.year).getFullYear()}</p>
          </div>
          <button 
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            onClick={handleNavigateToPeer}
          >
            Voir la promotion
          </button>
        </div>
      </div>
    </div>
  );
};

const SearchResults = ({ searchType, results }) => {
  if (!results.length) return (
    <p className="text-gray-600 p-4 text-center">
      Aucun résultat trouvé.
      {searchType === 'promotions' && (
        <span className="block text-sm mt-2">
          Recherchez par le nom de la promotion (ex: STIC22)
        </span>
      )}
    </p>
  );

  switch (searchType) {
    case 'users':
      return results.map(user => <UserCard key={user.public_id} user={user} />);
    case 'schools':
      return results.map(school => <SchoolCard key={school.public_id} school={school} />);
    case 'publications':
      return results.map(publication => <PublicationCard key={publication.public_id} publication={publication} />);
    case 'events':
      return results.map(event => <EventCard key={event.public_id} event={event} />);
    case 'promotions':
      return results.map(peer => <PeerCard key={peer.public_id} peer={peer} />);
    default:
      return null;
  }
};

export default SearchResults;
