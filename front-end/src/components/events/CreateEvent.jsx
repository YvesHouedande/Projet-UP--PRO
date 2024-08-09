import React, { useState, useEffect } from 'react';
import { Button, Modal, Label, Textarea, TextInput } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';

export default function CreateEvent({ show, onClose }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [form, setForm] = useState({
    label: "",
    moment: "",
    description: "",
    service: null,
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getUser();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosService.get(`/user/${user.id}/service/`);
        setServices(response.data.results); // Assume response.data.results contains the list of services
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchServices();
  }, [user.id]);

  const handleEmojiClick = (emojiObject) => {
    setForm({ ...form, description: form.description + emojiObject.emoji });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      moment: form.moment, // Directly use the date string
      label: form.label || '',
      description: form.description || '',
      service: form.service || '',
    };

    try {
      await axiosService.post("/event/", formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Post created 🚀");
      setForm({
        label: "",
        moment: "",
        description: "",
        service: "",
      });
      onClose();
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <Modal dismissible show={show} onClose={onClose}>
      <Modal.Header>Créer un Événement</Modal.Header>
      <Modal.Body>
        <div className='my-4'>
          <div className="mb-2 block">
            <Label htmlFor="label" value="Titre de votre événement..." />
          </div>
          <TextInput
            id="label"
            type="text"
            sizing="sm"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
        </div>
        <form className="my-4">
          <label htmlFor="service" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Le service à l'origine
          </label>
          <select
            id="service"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
          >
            <option value="">Choisir un service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.label}</option>
            ))}
          </select>
        </form>
        <div className="my-4">
          <div className="mb-2 block">
            <Label htmlFor="moment" value="Date et Heure de l'événement" />
          </div>
          <input
            id="moment"
            type="datetime-local" // Use datetime-local for date and time
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={form.moment}
            onChange={(e) => setForm({ ...form, moment: e.target.value })}
          />
        </div>
        <div className="relative my-4">
          <div className="mb-2 block">
            <Label htmlFor="description" value="Décrivez votre événement" />
          </div>
          <Textarea
            id="description"
            placeholder="Décrire l'événement"
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="mt-2 flex items-center relative">
            <Button
              color="gray"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="mr-2"
            >
              😊
            </Button>
            {showEmojiPicker && (
              <div className="absolute top-12 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between">
        <Button onClick={onClose}>Fermer</Button>
        <Button onClick={handleSubmit}>Envoyer</Button>
      </Modal.Footer>
    </Modal>
  );
}
