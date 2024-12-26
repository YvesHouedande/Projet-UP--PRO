import React, { useState } from 'react';
import { useUserActions } from '../../hooks/user.actions';
import axiosService from '../../helpers/axios';

export default function CreatePeer() {
  const [formData, setFormData] = useState({
    study: '',
    school: '',
    description: '',
    cover: null
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axiosService.post('/peer/', formDataToSend);
      // Gérer le succès
    } catch (error) {
      setError(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Formulaire de création */}
    </form>
  );
} 