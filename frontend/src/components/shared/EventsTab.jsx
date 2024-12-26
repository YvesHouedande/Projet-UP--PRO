import React, { useState, useEffect } from 'react';
import { HiCalendar, HiLocationMarker, HiInformationCircle, HiX } from 'react-icons/hi';
import { IoAddCircle } from "react-icons/io5";
import { Modal } from 'flowbite-react';
import CreateEvent from '../events/CreateEvent';
import axiosService from '../../helpers/axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../assets/Loading';

export default function EventsTab({ sourceType, sourceId, isManager }) {
  const [events, setEvents] = useState([]);
  const [nextEventsUrl, setNextEventsUrl] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async (reset = false) => {
    if (loadingEvents) return;
    setLoadingEvents(true);

    try {
      const url = reset 
        ? `/${sourceType}/${sourceId}/event/` 
        : nextEventsUrl;
      const response = await axiosService.get(url);
      
      setEvents(reset ? response.data.results : [...events, ...response.data.results]);
      setNextEventsUrl(response.data.next);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents(true);
  }, [sourceId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };

  const EventCard = ({ event }) => (
    <div 
      onClick={() => setSelectedEvent(event)}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden
                shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]
                hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]
                transition-all duration-200 cursor-pointer"
    >
      {event.cover && (
        <div className="relative h-48 w-full">
          <img 
            src={event.cover} 
            alt={event.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <div className="p-4 space-y-3">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
          {event.label}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-gray-600 bg-gray-50 
                        rounded-full px-3 py-1.5 text-sm">
            <HiCalendar className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{event.moment ? formatDate(event.moment) : 'Date à définir'}</span>
            <span className="sm:hidden">
              {event.moment ? new Date(event.moment).toLocaleDateString() : '---'}
            </span>
          </div>
          
          {event.place && (
            <div className="flex items-center gap-1 text-gray-600 bg-gray-50 
                          rounded-full px-3 py-1.5 text-sm">
              <HiLocationMarker className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline line-clamp-1">{event.place}</span>
              <span className="sm:hidden">Lieu</span>
            </div>
          )}
        </div>
        
        {event.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mt-2">
            {event.description}
          </p>
        )}

        <button className="w-full mt-2 text-sm text-green-600 hover:text-green-700 
                        flex items-center justify-center gap-1 py-2 border-t">
          <HiInformationCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Voir les détails</span>
          <span className="sm:hidden">Détails</span>
        </button>
      </div>
    </div>
  );

  const EventDetailModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
      <Modal show={!!event} onClose={onClose} size="xl">
        <Modal.Header className="border-b">
          <h3 className="text-xl font-bold text-gray-800">{event.label}</h3>
        </Modal.Header>
        <Modal.Body className="space-y-6">
          {event.cover && (
            <div className="rounded-xl overflow-hidden">
              <img 
                src={event.cover} 
                alt={event.label}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-gray-700">
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
                <HiCalendar className="w-5 h-5 text-green-600" />
                <span>{event.moment ? formatDate(event.moment) : 'Date à définir'}</span>
              </div>

              {event.place && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
                  <HiLocationMarker className="w-5 h-5 text-green-600" />
                  <span>{event.place}</span>
                </div>
              )}

              {event.description && (
                <div className="prose max-w-none">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="relative min-h-[50vh]">
      <div className="space-y-4">
        <InfiniteScroll
          dataLength={events.length}
          next={() => fetchEvents(false)}
          hasMore={!!nextEventsUrl}
          loader={<Loading />}
          endMessage={
            <p className="text-center text-gray-500 my-4">
              Plus aucun événement à afficher
            </p>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.public_id} event={event} />
            ))}
          </div>
        </InfiniteScroll>
      </div>

      <EventDetailModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />

      {isManager && (
        <button
          onClick={() => setIsCreateEventOpen(true)}
          className="fixed bottom-8 right-8 bg-green-500 text-white rounded-full p-4
                   shadow-lg hover:bg-green-600 transition-all duration-200
                   flex items-center justify-center group z-50"
        >
          <IoAddCircle className="w-8 h-8" />
          <span className="absolute right-full mr-4 bg-green-500 text-white px-4 py-2 
                        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                        whitespace-nowrap hidden md:block">
            Créer un événement
          </span>
        </button>
      )}

      {isCreateEventOpen && (
        <CreateEvent
          show={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          sourceId={sourceId}
          sourceType={sourceType}
          onEventCreated={() => {
            fetchEvents(true);
            setIsCreateEventOpen(false);
          }}
        />
      )}
    </div>
  );
} 