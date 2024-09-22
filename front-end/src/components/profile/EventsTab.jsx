import React, { useState, useEffect } from 'react';
import { Button, Modal, TextInput, Textarea } from 'flowbite-react';
import axiosService from '../../helpers/axios';
import CreateEvent from '../events/CreateEvent';
import { getUser } from '../../hooks/user.actions';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function EventsTab() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const user = getUser();

  // Fonction pour récupérer plus d'événements
  const fetchMoreEvents = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosService.get(nextUrl || `/user/${user.public_id}/event/`);
      const newEvents = response.data.results;
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      setNextUrl(response.data.next);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoreEvents(); // Initial fetch
  }, []);

  // Ouverture du modal pour ajouter/modifier un événement
  const openModal = (event = null) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setShowImageUpload(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Limitation de la longueur de la description
  const truncateDescription = (description, maxLength = 100) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description;
  };

  // Gestion de la sauvegarde (ajout ou modification)
  const handleSave = async () => {
    if (!selectedEvent) return;
    try {
      const formData = new FormData();

      formData.append('label', selectedEvent.label || '');
      formData.append('place', selectedEvent.place || '');
      formData.append('moment', selectedEvent.moment || '');
      formData.append('description', selectedEvent.description || '');
      if (selectedEvent.imageFile) {
        formData.append('cover', selectedEvent.imageFile);
      }

      let response;
      if (selectedEvent.id) {
        // Modifier un événement existant
        response = await axiosService.patch(`/events/${selectedEvent.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Ajouter un nouvel événement
        response = await axiosService.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // Met à jour la liste des événements
      setEvents((prevEvents) =>
        selectedEvent.id
          ? prevEvents.map((event) =>
              event.id === selectedEvent.id ? response.data : event
            )
          : [response.data, ...prevEvents]
      );
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Fonction pour supprimer un événement
  const handleDelete = async (id) => {
    try {
      await axiosService.delete(`/events/${id}`);
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleImageChange = (e) => {
    setSelectedEvent({
      ...selectedEvent,
      imageFile: e.target.files[0],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mes Événements</h2>

      <Button onClick={() => openModal()} className="mb-4">
        Ajouter un Événement
      </Button>

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
                key={event.id}
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
                <p className="text-sm text-gray-600">{event.place}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Date: {new Date(event.moment).toLocaleDateString()} à {new Date(event.moment).toLocaleTimeString()}
                </p>
                <p className="text-sm">{truncateDescription(event.description)}</p>
                <div className="mt-4 flex justify-between">
                  <Button color="gray" onClick={() => openModal(event)}>
                    Modifier
                  </Button>
                  <Button color="failure" onClick={() => handleDelete(event.id)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {/* Modal pour ajouter/modifier un événement */}
      {isModalOpen && (
        <CreateEvent show={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
}
