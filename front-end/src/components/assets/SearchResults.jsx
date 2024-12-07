import React from 'react';
import { getStateTime } from '../../hooks/utils';
import { useNavigate } from 'react-router-dom';

const CardWrapper = ({ children, onClick, className = "" }) => (
  <div 
    onClick={onClick}
    className={`p-5 bg-white rounded-2xl border-2 border-green-200 
                shadow-[5px_5px_0px_0px_rgba(34,197,94,0.2)] 
                hover:shadow-[7px_7px_0px_0px_rgba(34,197,94,0.2)] 
                transition-all duration-200 ease-in-out cursor-pointer mb-4
                ${className}`}
  >
    {children}
  </div>
);

// const Button = ({ children, onClick, className = "" }) => (
//   <button 
//     onClick={onClick}
//     className={`mt-3 px-4 py-2 bg-green-500 text-white rounded-xl
//                 hover:bg-green-600 transition-colors duration-200
//                 font-medium ${className}`}
//   >
//     {children}
//   </button>
// );

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <CardWrapper onClick={() => navigate(`/profile/${user.public_id}/`)}>
      <div className="flex items-center">
        <img 
          src={user.avatar} 
          alt={`${user.first_name} ${user.last_name}`} 
          className="w-16 h-16 object-cover rounded-full border-2 border-orange-200" 
        />
        <div className="ml-4 flex-1">
          <h3 className="font-bold text-lg text-green-700">
            {user.first_name} {user.last_name}
          </h3>
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
            {user.status_choice}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};

// const EventCard = ({ event }) => {
//   const { status, formattedDate } = getStateTime(event.moment);
//   const statusStyles = {
//     passé: "bg-red-100 text-red-600",
//     "en cours": "bg-orange-100 text-orange-600",
//     "à venir": "bg-green-100 text-green-600"
//   };

//   return (
//     <CardWrapper>
//       <h3 className="font-bold text-lg text-green-700 mb-2">{event.label}</h3>
//       <div className="space-y-2">
//         <div className="flex items-center">
//           <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status]}`}>
//             {status}
//           </span>
//           <span className="ml-2 text-gray-600 text-sm">{formattedDate}</span>
//         </div>
//         <p className="text-gray-600">
//           <span className="font-medium">Service:</span> {event.service_label}
//         </p>
//         <p className="text-gray-600">
//           <span className="font-medium">Lieu:</span> {event.place}
//         </p>
//       </div>
//     </CardWrapper>
//   );
// };

const PeerCard = ({ peer }) => {
  const navigate = useNavigate();

  return (
    <CardWrapper onClick={() => navigate(`/peer/${peer.public_id}`)}>
      <div className="flex items-center">
        {peer.cover && (
          <img 
            src={peer.cover} 
            alt={peer.label}
            className="w-20 h-20 object-cover rounded-xl border-2 border-green-200" 
          />
        )}
        <div className="ml-4 flex-1">
          <h3 className="font-bold text-lg text-green-700 mb-1">{peer.label}</h3>
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm mr-2">
              {peer.study_label}
            </span>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
              {new Date(peer.year).getFullYear()}
            </span>
          </div>
          <p className="text-gray-600 mt-1 text-sm">{peer.school_label}</p>
        </div>
      </div>
    </CardWrapper>
  );
};

const SearchResults = ({ searchType, results }) => {
  if (!results.length) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border-2 border-green-200">
        <p className="text-gray-600 font-medium">
          Aucun résultat trouvé
          {searchType === 'promotions' && (
            <span className="block text-sm mt-2 text-orange-600">
              Conseil: Recherchez par le nom de la promotion (ex: STIC22)
            </span>
          )}
        </p>
      </div>
    );
  }

  switch (searchType) {
    case 'users':
      return results.map(user => <UserCard key={user.public_id} user={user} />);
    // case 'schools':
    //   return results.map(school => <SchoolCard key={school.public_id} school={school} />);
    // case 'publications':
    //   return results.map(publication => <PublicationCard key={publication.public_id} publication={publication} />);
    // case 'events':
    //   return results.map(event => <EventCard key={event.public_id} event={event} />);
    case 'promotions':
      return results.map(peer => <PeerCard key={peer.public_id} peer={peer} />);
    default:
      return null;
  }
};

export default SearchResults;
