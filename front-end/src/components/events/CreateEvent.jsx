import React, { useState, useEffect } from 'react';
import { Button, Modal, Label, Textarea, TextInput, FileInput } from 'flowbite-react';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';

export default function CreateEvent({ onEventCreated }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    label: "",
    moment: "",
    description: "",
    service: "",
    peer: "",
    cover: null,
    place: ""
  });
  const [services, setServices] = useState([]);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = getUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.status_choice === 'service_manager') {
          const response = await axiosService.get(`/user/${user.public_id}/service/`);
          setServices(response.data.results);
        } else if (user.status_choice === 'etudiant') {
          const response = await axiosService.get(`/user/${user.public_id}/managed_peers/`);
          setPeers(response.data.results);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== "" && form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    try {
      await axiosService.post('/event/', formData);
      setShowModal(false);
      setForm({
        label: "",
        moment: "",
        description: "",
        service: "",
        peer: "",
        cover: null,
        place: ""
      });
      if (onEventCreated) onEventCreated();
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)} className="w-full">
        Créer un événement
      </Button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Créer un nouvel événement</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champs du formulaire... */}
            {user.status_choice === 'service_manager' && (
              <div>
                <Label>Service organisateur</Label>
                <select
                  className="w-full rounded-lg border-gray-300"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  <option value="">Sélectionner un service</option>
                  {services.map(service => (
                    <option key={service.public_id} value={service.public_id}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {user.status_choice === 'etudiant' && (
              <div>
                <Label>Promotion organisatrice</Label>
                <select
                  className="w-full rounded-lg border-gray-300"
                  value={form.peer}
                  onChange={(e) => setForm({ ...form, peer: e.target.value })}
                >
                  <option value="">Sélectionner une promotion</option>
                  {peers.map(peer => (
                    <option key={peer.public_id} value={peer.public_id}>
                      {peer.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Autres champs... */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}