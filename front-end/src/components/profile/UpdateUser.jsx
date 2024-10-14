import React, { useState } from 'react';
import { useUserActions } from '../../hooks/user.actions';

export default function UpdateUser({ user, handleCloseEdit }) {
  const userActions = useUserActions();
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    first_name: user.first_name,
    last_name: user.last_name,
    bio: user.bio || '',
    email: user.email,
    status_choice: user.status_choice,
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithFile = new FormData();

    Object.keys(formData).forEach(key => {
      formDataWithFile.append(key, formData[key]);
    });

    if (avatarFile) {
      formDataWithFile.append('avatar', avatarFile);
    }

    try {
      await userActions.edit(formDataWithFile, user.public_id);
      handleCloseEdit();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations de l'utilisateur", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-2">
        <input type="file" onChange={handleFileChange} className="p-2 border rounded w-full" />
      </div>
      <input name="username" value={formData.username} onChange={handleChange} placeholder="Nom d'utilisateur" className="p-2 border rounded" />
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom complet" className="p-2 border rounded" />
      <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Prénom" className="p-2 border rounded" />
      <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Nom de famille" className="p-2 border rounded" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
      <input name="status_choice" value={formData.status_choice} onChange={handleChange} placeholder="Statut" className="p-2 border rounded" />
      <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className="p-2 border rounded col-span-2" rows="4" />
      <div className="col-span-2 flex justify-end space-x-2 mt-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Enregistrer</button>
        <button type="button" onClick={handleCloseEdit} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Annuler</button>
      </div>
    </form>
  );
}
