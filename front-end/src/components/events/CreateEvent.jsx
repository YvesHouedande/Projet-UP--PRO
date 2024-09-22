import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Label, Textarea, TextInput, FileInput } from 'flowbite-react'; 
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from 'react-router-dom';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';
import { Context } from '../../pages/Layout';

export default function CreateEvent({ show, onClose }) {
  const { showInfo, setShowInfo } = useContext(Context);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [form, setForm] = useState({
    label: "",
    moment: "",
    description: "",
    service: "",
    cover: null, 
    place: ""  
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getUser();
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosService.get(`/user/${user.public_id}/service/`);
        setServices(response.data.results); 
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

  const handleFileChange = (e) => {
    setForm({ ...form, cover: e.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('moment', form.moment);
    formData.append('label', form.label || '');
    formData.append('description', form.description || '');
    formData.append('service', form.service || '');
    formData.append('place', form.place || '');  
    if (form.cover) {
      formData.append('cover', form.cover); 
    }

    try {
      await axiosService.post("/event/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Événement créé 🚀");
      setForm({
        label: "",
        moment: "",
        description: "",
        service: "",
        cover: null,
        place: ""  
      });
      onClose();  
    } catch (error) {
      console.error("Erreur:", error.response ? error.response.data : error.message);
    }
  };

  if (!loading && services.length === 0) {
    return (
      <Modal show={show} onClose={onClose}>
        <Modal.Header>Message</Modal.Header>
        <Modal.Body>
          <p className="text-green-500">
            Vous ne gérez aucun service.
          </p>
        </Modal.Body>
      </Modal>
    );
  }

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
            type="datetime-local"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={form.moment}
            onChange={(e) => setForm({ ...form, moment: e.target.value })}
          />
        </div>
        <div className="my-4">
          <Label htmlFor="cover" value="Image de couverture" />
          <FileInput
            id="cover"
            onChange={handleFileChange}
          />
        </div>
        <div className="my-4">
          <div className="mb-2 block">
            <Label htmlFor="place" value="Lieu de l'événement" />
          </div>
          <TextInput
            id="place"
            type="text"
            placeholder="Saisir le lieu"
            value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
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
        <Button onClick={() => navigate('/timeline')}>Voir les événements</Button>
        <Button onClick={handleSubmit}>Envoyer</Button>
      </Modal.Footer>
    </Modal>
  );
}
