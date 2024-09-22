import React, { useState } from 'react';
import { Button, Timeline } from 'flowbite-react';
import { HiCalendar } from 'react-icons/hi';

export default function TimeLineItem({ timeline }) {
  const { label, moment, place, description, cover, service_label } = timeline;
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isZoomed, setZoomed] = useState(false);

  const truncatedDescription = description?.length > 100 
    ? description.slice(0, 100) + '...' 
    : description;

  const handleDescriptionToggle = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleZoomToggle = () => {
    setZoomed(!isZoomed);
  };

  return (
    <Timeline.Item>
      <Timeline.Point icon={HiCalendar} />
      <Timeline.Content>
        {/* Event Date and Time */}
        <Timeline.Time>{new Date(moment).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}</Timeline.Time>

        {/* Event Title */}
        <Timeline.Title className='text-orange-400 font-bold'>{label}</Timeline.Title>

        {/* Service Name */}
        {service_label && (
          <p className="text-sm mb-2">
            <span className="text-green-600 font-bold">Origine:</span> {service_label}
          </p>
        )}

        {/* Thumbnail of the Cover Image with Zoom */}
        {cover && (
          <div className="relative mb-4">
            <img
              src={cover}
              alt={`Cover for ${label}`}
              className={`object-cover rounded-lg transition-all duration-300 ${
                isZoomed ? 'w-full h-auto max-h-screen' : 'w-32 h-32'
              }`}
              onClick={handleZoomToggle}
              style={{ cursor: 'zoom-in' }}
            />
            {/* Button below the image */}
            <Button
              size="xs"
              color="link"
              className="text-blue-600 mt-2"
              onClick={handleZoomToggle}
            >
              {isZoomed ? 'Réduire' : 'Agrandir'}
            </Button>
          </div>
        )}

        {/* Event Description with Read More/Read Less */}
        <Timeline.Body>
          {isDescriptionExpanded ? description : truncatedDescription}
          {description?.length > 100 && (
            <Button
              size="xs"
              color="link"
              className="ml-2 text-blue-600"
              onClick={handleDescriptionToggle}
            >
              {isDescriptionExpanded ? 'Lire moins' : 'Lire plus'}
            </Button>
          )}
        </Timeline.Body>

        {/* Event Place */}
        {place && (
          <p className="mt-2 text-sm">
            <span className="text-green-600 font-bold">Lieu:</span> {place}
          </p>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
}
