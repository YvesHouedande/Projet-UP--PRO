// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
// import axiosService from '../../helpers/axios';
// import { getUser } from '../../hooks/user.actions';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import CreateEvent from '../events/CreateEvent';

// export default function EventsTab({ user }) {
//   const [IsEventOpen, setIsEventOpen] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [nextUrl, setNextUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const currentUser = getUser();

//   // Fonction pour récupérer plus d'événements
//   const fetchMoreEvents = useCallback(async () => {
//     // if (loading) return;
//     // setLoading(true);

//     try {
//       const response = await axiosService.get(nextUrl || `/user/${user?.public_id}/event/`);
//       const newEvents = response.data.results;
//       setEvents((prevEvents) => [...prevEvents, ...newEvents]);
//       setNextUrl(response.data.next);
//     } catch (err) {
//       setError(err.message || "Une erreur s'est produite");
//     } finally {
//       setLoading(false);
//     }
//   }, [nextUrl, user?.public_id]);

//   useEffect(() => {
//     fetchMoreEvents(); // Récupération initiale
//   }, [fetchMoreEvents]);

//   // Ouverture du modal pour ajouter/modifier un événement
//   const openModal = useCallback((event = null) => {
//     setSelectedEvent(event);
//     setIsModalOpen(true);
//   }, []);

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedEvent(null);
//   };

//   // Gestion de la sauvegarde (ajout ou modification)
//   const handleSave = async () => {
//     if (!selectedEvent) return;
//     try {
//       const formData = new FormData();
//       formData.append('label', selectedEvent.label || '');
//       formData.append('place', selectedEvent.place || '');
//       formData.append('moment', selectedEvent.moment || '');
//       formData.append('description', selectedEvent.description || '');
//       if (selectedEvent.imageFile) {
//         formData.append('cover', selectedEvent.imageFile);
//       }

//       let response;
//       if (selectedEvent.public_id) {
//         // Modifier un événement existant
//         response = await axiosService.patch(`/event/${selectedEvent.public_id}/`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         // Ajouter un nouvel événement
//         response = await axiosService.post('/event/', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }

//       const updatedEvent = response.data;

//       // Mettre à jour la liste des événements
//       setEvents((prevEvents) =>
//         selectedEvent.public_id
//           ? prevEvents.map((event) =>
//               event.public_id === updatedEvent.public_id ? updatedEvent : event
//             )
//           : [updatedEvent, ...prevEvents]
//       );

//       closeModal();
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde:', error);
//     }
//   };

//   // Fonction pour supprimer un événement
//   const handleDelete = useCallback(async (public_id) => {
//     try {
//       await axiosService.delete(`/event/${public_id}/`);
//       setEvents((prevEvents) => prevEvents.filter((event) => event.public_id !== public_id));
//     } catch (error) {
//       console.error('Erreur lors de la suppression:', error);
//     }
//   }, []);

//   const handleImageChange = (e) => {
//     setSelectedEvent((prevEvent) => ({
//       ...prevEvent,
//       imageFile: e.target.files[0],
//     }));
//   };

//   // Fonction pour tronquer la description
//   const truncateDescription = (description, maxLength = 100) => {
//     return description.length > maxLength
//       ? description.substring(0, maxLength) + '...'
//       : description;
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Mes Événements</h2>

//     <Button  onClick={() => setIsEventOpen(true)} className="mb-4">
//         Ajouter un Événement
//       </Button>

//       <div style={{ height: '100vh' }}>
//         <InfiniteScroll
//           dataLength={events.length}
//           next={fetchMoreEvents}
//           hasMore={!!nextUrl}
//           loader={<h4>Chargement...</h4>}
//           endMessage={<p className="text-center my-4">Plus d'événements disponibles.</p>}
//         >
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {events.map((event) => (
//               <div
//                 key={event.public_id}
//                 className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
//               >
//                 {event.cover && (
//                   <img
//                     src={event.cover}
//                     alt={event.label}
//                     className="w-full h-48 object-cover rounded-lg mb-4"
//                   />
//                 )}
//                 <h3 className="text-lg font-semibold mb-2">{event.label}</h3>
//                 <p className="text-sm text-gray-600">{event.place}</p>
//                 <p className="text-sm text-gray-500 mb-2">
//                   Date: {new Date(event.moment).toLocaleDateString()} à{' '}
//                   {new Date(event.moment).toLocaleTimeString()}
//                 </p>
//                 <p className="text-sm">{truncateDescription(event.description)}</p>
//                 <div className="mt-4 flex justify-between">
//                   <Button color="gray" onClick={() => openModal(event)}>
//                     Modifier
//                   </Button>
//                   <Button color="failure" onClick={() => handleDelete(event.public_id)}>
//                     Supprimer
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </InfiniteScroll>
//       </div>

//       {/* Modal pour ajouter */}
//       {IsEventOpen && (<CreateEvent show={IsEventOpen} onClose={() => setIsEventOpen(false)} />)}
//     </div>
//   );
// }

// import React, { useState, useCallback } from 'react';
// import { Button } from 'flowbite-react';
// import { fetcher } from '../../helpers/axios';
// import { getUser } from '../../hooks/user.actions';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import useSWR, { mutate } from 'swr';
// import Loading from '../assets/Loading';
// import MessageModal from '../assets/MessageModal';

// export default function EventsTab({ user }) {
//   const [IsEventOpen, setIsEventOpen] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [nextUrl, setNextUrl] = useState(null);

//   const currentUser = getUser();

//   // SWR pour récupérer les événements
//   const { data, error, isLoading } = useSWR(`/user/${user?.public_id}/event/`, fetcher, {
//     revalidateOnFocus: false,
//     onSuccess: (data) => {
//       if (data.results) {
//         setEvents(data.results);
//         setNextUrl(data.next);
//       }
//     },
//   });


//   // Fonction pour récupérer plus d'événements
//   const fetchMoreEvents = useCallback(async () => {
//     if (!nextUrl) return; // Pas plus d'événements à charger
//     try {
//       const response = await fetcher(nextUrl);
//       setEvents((prevEvents) => [...prevEvents, ...response.results]);
//       setNextUrl(response.next);
//     } catch (err) {
//       console.error('Erreur lors de la récupération des événements:', err);
//     }
//   }, [nextUrl]);

//   // Vérification des états de chargement et d'erreur
//   if (isLoading) return <Loading />;
//   if (error) return <MessageModal message={"Erreur de chargement des événements"} />;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Mes Événements</h2>

//       <div style={{ height: '100vh' }} >
//         <InfiniteScroll
//           dataLength={events.length}
//           next={fetchMoreEvents}
//           hasMore={!!nextUrl}
//           loader={<h4>Chargement...</h4>}
//           endMessage={<p className="text-center my-4">Plus d'événements disponibles.</p>}
//         >
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {events.map((event) => (
//               <div
//                 key={event.public_id}
//                 className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
//               >
//                 {event.cover && (
//                   <img
//                     src={event.cover}
//                     alt={event.label}
//                     className="w-full h-48 object-cover rounded-lg mb-4"
//                   />
//                 )}
//                 <h3 className="text-lg font-semibold mb-2">{event.label}</h3>
//                 <p className="text-sm text-gray-600">{event.place}</p>
//                 <p className="text-sm text-gray-500 mb-2">
//                   Date: {new Date(event.moment).toLocaleDateString()} à{' '}
//                   {new Date(event.moment).toLocaleTimeString()}
//                 </p>
//                 <p className="text-sm">{event.description}</p>
//                 <div className="mt-4 flex justify-between">
//                   <Button color="gray">Modifier</Button>
//                   <Button color="failure">Supprimer</Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </InfiniteScroll>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useCallback } from 'react';
// import { Button, Modal } from 'flowbite-react';
// import { fetcher } from '../../helpers/axios';
// import { getUser } from '../../hooks/user.actions';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import useSWR, { mutate } from 'swr';
// import Loading from '../assets/Loading';
// import MessageModal from '../assets/MessageModal';

// export default function EventsTab({ user }) {
//   const [isEventOpen, setIsEventOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [nextUrl, setNextUrl] = useState(null);

//   const currentUser = getUser();

//   // SWR pour récupérer les événements
//   const { data, error, isLoading } = useSWR(`/user/${user?.public_id}/event/`, fetcher, {
//     revalidateOnFocus: false,
//     onSuccess: (data) => {
//       if (data.results) {
//         setEvents(data.results);
//         setNextUrl(data.next);
//       }
//     },
//   });

//   // Fonction pour récupérer plus d'événements
//   const fetchMoreEvents = useCallback(async () => {
//     if (!nextUrl) return; // Pas plus d'événements à charger
//     try {
//       const response = await fetcher(nextUrl);
//       setEvents((prevEvents) => [...prevEvents, ...response.results]);
//       setNextUrl(response.next);
//     } catch (err) {
//       console.error('Erreur lors de la récupération des événements:', err);
//     }
//   }, [nextUrl]);

//   // Fonction pour ouvrir le modal avec les détails de l'événement
//   const openEventModal = (event) => {
//     setSelectedEvent(event);
//     setIsEventOpen(true);
//   };

//   // Fonction pour fermer le modal
//   const closeModal = () => {
//     setIsEventOpen(false);
//     setSelectedEvent(null);
//   };

//   // Fonction pour gérer la suppression d'un événement
//   const deleteEvent = async (eventId) => {
//     try {
//       await fetcher(`/event/${eventId}/`, { method: 'DELETE' });
//       setEvents((prevEvents) => prevEvents.filter(event => event.public_id !== eventId));
//       mutate(`/user/${user?.public_id}/event/`); // Mettre à jour les événements après suppression
//     } catch (error) {
//       console.error('Erreur lors de la suppression:', error);
//     }
//   };

//   // Limiter le texte de description à un certain nombre de caractères
//   const truncateDescription = (description, length = 90) => {
//     return description.length > length
//       ? `${description.substring(0, length)}...`
//       : description;
//   };

//   // Vérification des états de chargement et d'erreur
//   if (isLoading) return <Loading />;
//   if (error) return <MessageModal message={"Erreur de chargement des événements"} />;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Mes Événements</h2>

//       <div style={{ height: '100vh' }}>
//         <InfiniteScroll
//           dataLength={events.length}
//           next={fetchMoreEvents}
//           hasMore={!!nextUrl}
//           loader={<h4>Chargement...</h4>}
//           endMessage={<p className="text-center my-4">Plus d'événements disponibles.</p>}
//         >
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {events.map((event) => (
//               <div
//                 key={event.public_id}
//                 className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
//               >
//                 {event.cover && (
//                   <img
//                     src={event.cover}
//                     alt={event.label}
//                     className="w-full h-48 object-cover rounded-lg mb-4"
//                   />
//                 )}
//                 <h3 className="text-lg font-semibold mb-2">{event.label}</h3>
                
//                 {/* Lieu et Date */}
//                 <p className="text-sm text-gray-600">Lieu : {event.place}</p>
//                 <p className="text-sm text-gray-500 mb-2">
//                   Date : {new Date(event.moment).toLocaleDateString()} à {new Date(event.moment).toLocaleTimeString()}
//                 </p>

//                 {/* Description */}
//                 <p className="text-sm">
//                   {event.description.length <= 90? (
//                     event.description
//                   ) : (
//                     <>
//                       {truncateDescription(event.description, 90)}
//                       <span
//                         className="text-green-600 underline cursor-pointer ml-1"
//                         onClick={() => openEventModal(event)}
//                       >
//                         Voir les détails
//                       </span>
//                     </>
//                   )}
//                 </p>
                
//                 <div className="mt-4 flex justify-between">
//                   <Button color="gray">Modifier</Button>
//                   <Button color="failure" onClick={() => deleteEvent(event.public_id)}>
//                     Supprimer
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </InfiniteScroll>
//       </div>

//       {/* Modal pour afficher les détails complets de l'événement */}
//       <Modal show={isEventOpen} onClose={closeModal}>
//         <Modal.Header>{selectedEvent?.label}</Modal.Header>
//         <Modal.Body>
//           {selectedEvent?.description ? (
//             <p>{selectedEvent.description}</p>
//           ) : (
//             <p>Aucun détail supplémentaire disponible pour cet événement.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button color="gray" onClick={closeModal}>
//             Fermer
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }



// import React, { useState, useCallback } from 'react';
// import { Button, Modal } from 'flowbite-react';
// import { fetcher } from '../../helpers/axios';
// import { getUser } from '../../hooks/user.actions';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import useSWR, { mutate } from 'swr';
// import Loading from '../assets/Loading';
// import MessageModal from '../assets/MessageModal';
// import axiosService from '../../helpers/axios';

// export default function EventsTab({ user }) {
//   const [isEventOpen, setIsEventOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [nextUrl, setNextUrl] = useState(null);

//   const currentUser = getUser();

//   // SWR pour récupérer les événements
//   const { data, error, isLoading } = useSWR(`/user/${user?.public_id}/event/`, fetcher, {
//     revalidateOnFocus: false,
//     onSuccess: (data) => {
//       if (data.results) {
//         setEvents(data.results);
//         setNextUrl(data.next);
//       }
//     },
//   });

//   // Fonction pour récupérer plus d'événements
//   const fetchMoreEvents = useCallback(async () => {
//     if (!nextUrl) return; // Pas plus d'événements à charger
//     try {
//       const response = await fetcher(nextUrl);
//       setEvents((prevEvents) => [...prevEvents, ...response.results]);
//       setNextUrl(response.next);
//     } catch (err) {
//       console.error('Erreur lors de la récupération des événements:', err);
//     }
//   }, [nextUrl]);

//   // Fonction pour ouvrir le modal avec les détails de l'événement
//   const openEventModal = (event) => {
//     setSelectedEvent(event);
//     setIsEventOpen(true);
//   };

//   // Fonction pour fermer le modal
//   const closeModal = () => {
//     setIsEventOpen(false);
//     setSelectedEvent(null);
//   };

//   // Fonction pour gérer la suppression d'un événement
//   const handleDelete = async (eventId) => {
//     try {
//       await axiosService.delete(`/event/${eventId}/`);
//       setEvents((prevEvents) => prevEvents.filter((event) => event.public_id !== eventId));
//     } catch (err) {
//       console.error("Erreur lors de la suppression", err);
//     }
//   };

//   // Fonction pour gérer la mise à jour d'un événement
//   const handleUpdate = async (eventId, updatedEvent) => {
//     try {
//       await axiosService.patch(`/event/${eventId}/`, updatedEvent);
//       setEvents((prevEvents) =>
//         prevEvents.map((event) =>
//           event.public_id === eventId ? { ...event, ...updatedEvent } : event
//         )
//       );
//       closeModal();
//     } catch (err) {
//       console.error("Erreur lors de la mise à jour", err);
//     }
//   };

//   // Limiter le texte de description à un certain nombre de caractères
//   const truncateDescription = (description, length = 200) => {
//     return description.length > length
//       ? `${description.substring(0, length)}...`
//       : description;
//   };

//   // Vérification des états de chargement et d'erreur
//   if (isLoading) return <Loading />;
//   if (error) return <MessageModal message={"Erreur de chargement des événements"} />;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Mes Événements</h2>

//       <div style={{ height: '100vh' }}>
//         <InfiniteScroll
//           dataLength={events.length}
//           next={fetchMoreEvents}
//           hasMore={!!nextUrl}
//           loader={<h4>Chargement...</h4>}
//           endMessage={<p className="text-center my-4">Plus d'événements disponibles.</p>}
//         >
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {events.map((event) => (
//               <div
//                 key={event.public_id}
//                 className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
//               >
//                 {event.cover && (
//                   <img
//                     src={event.cover}
//                     alt={event.label}
//                     className="w-full h-48 object-cover rounded-lg mb-4"
//                   />
//                 )}
//                 <h3 className="text-lg font-semibold mb-2">{event.label}</h3>
                
//                 {/* Lieu et Date */}
//                 <p className="text-sm text-gray-600">Lieu : {event.place}</p>
//                 <p className="text-sm text-gray-500 mb-2">
//                   Date : {new Date(event.moment).toLocaleDateString()} à {new Date(event.moment).toLocaleTimeString()}
//                 </p>

//                 {/* Description */}
//                 <p className="text-sm">
//                   {event.description.length <= 200 ? (
//                     event.description
//                   ) : (
//                     <>
//                       {truncateDescription(event.description, 200)}
//                       <span
//                         className="text-green-600 underline cursor-pointer ml-1"
//                         onClick={() => openEventModal(event)}
//                       >
//                         Voir les détails
//                       </span>
//                     </>
//                   )}
//                 </p>
                
//                 <div className="mt-4 flex justify-between">
//                   <Button color="gray" onClick={() => handleUpdate(event.public_id, { /* données modifiées */ })}>
//                     Modifier
//                   </Button>
//                   <Button color="failure" onClick={() => handleDelete(event.public_id)}>
//                     Supprimer
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </InfiniteScroll>
//       </div>

//       {/* Modal pour afficher les détails complets de l'événement */}
//       <Modal show={isEventOpen} onClose={closeModal}>
//         <Modal.Header>{selectedEvent?.label}</Modal.Header>
//         <Modal.Body>
//           {selectedEvent?.description ? (
//             <p>{selectedEvent.description}</p>
//           ) : (
//             <p>Aucun détail supplémentaire disponible pour cet événement.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button color="gray" onClick={closeModal}>
//             Fermer
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }



import React, { useState, useCallback } from 'react';
import { Button } from 'flowbite-react';
import { fetcher } from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSWR from 'swr';
import Loading from '../assets/Loading';
import MessageModal from '../assets/MessageModal';
import EditEvent from '../events/EditEvent';
import axiosService from '../../helpers/axios';

export default function EventsTab({ user }) {
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const currentUser = getUser();

  // SWR pour récupérer les événements
  const { data, error, isLoading } = useSWR(`/user/${user?.public_id}/event/`, fetcher, {
    revalidateOnFocus: false,
    onSuccess: (data) => {
      if (data.results) {
        setEvents(data.results);
        setNextUrl(data.next);
      }
    },
  });

  // Fonction pour récupérer plus d'événements
  const fetchMoreEvents = useCallback(async () => {
    if (!nextUrl) return; // Pas plus d'événements à charger
    try {
      const response = await fetcher(nextUrl);
      setEvents((prevEvents) => [...prevEvents, ...response.results]);
      setNextUrl(response.next);
    } catch (err) {
      console.error('Erreur lors de la récupération des événements:', err);
    }
  }, [nextUrl]);

  // Gestion de la suppression d'un événement
  const handleDelete = async (eventId) => {
    try {
      await axiosService.delete(`/event/${eventId}/`);
      setEvents(events.filter((event) => event.public_id !== eventId));
    } catch (err) {
      console.error("Erreur lors de la suppression de l'événement", err);
    }
  };

  // Gestion de la mise à jour d'un événement
  const handleUpdate = (eventId, updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.public_id === eventId ? { ...event, ...updatedEvent } : event
      )
    );
  };

  // Ouverture du modal d'édition
  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsEventOpen(true);
  };

  // Vérification des états de chargement et d'erreur
  if (isLoading) return <Loading />;
  if (error) return <MessageModal message={"Erreur de chargement des événements"} />;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mes Événements</h2>

      <div style={{ height: '100vh' }}>
        <InfiniteScroll
          dataLength={events.length}
          next={fetchMoreEvents}
          hasMore={!!nextUrl}
          loader={<h4>Chargement...</h4>}
          endMessage={<p className="text-center my-4">Plus d'événements disponibles.</p>}
        >
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.public_id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
              >
                {event.cover && (
                  <img
                    src={event.cover}
                    alt={event.label}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2">{event.label}</h3>
                <p className="text-sm text-gray-600">Lieu: {event.place}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Date: {new Date(event.moment).toLocaleDateString()} à{' '}
                  {new Date(event.moment).toLocaleTimeString()}
                </p>
                <p className="text-sm">
                  {event.description.length < 200 ? event.description : (
                    <>
                      {event.description.substring(0, 200)}...
                      <span
                        className="text-green-600 cursor-pointer underline"
                        onClick={() => alert(event.description)} 
                      >
                        Voir les détails
                      </span>
                    </>
                  )}
                </p>
                <div className="mt-4 flex justify-between">
                  <Button color="success" onClick={() => openEditModal(event)}>
                    Modifier
                  </Button>
                  <Button color="failure" onClick={() => handleDelete(event.public_id)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      <EditEvent
        isOpen={isEventOpen}
        onClose={() => setIsEventOpen(false)}
        eventToEdit={selectedEvent}
        onUpdate={handleUpdate}
      />
    </div>
  );
}



