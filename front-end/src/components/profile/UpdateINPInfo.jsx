import React, { useState } from 'react';
import axiosService from '../../helpers/axios';

export default function UpdateINPInfo({ user, inpInfo, handleCloseEdit, mutate }) {
  const [formData, setFormData] = useState(inpInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosService.patch(`/user/${user.public_id}/${user.status_choice}/`, formData);
      mutate(response.data);
      handleCloseEdit();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations INP", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {user.status_choice === 'etudiant' && (
        <>
          <input name="study" value={formData.study || ''} onChange={handleChange} placeholder="Filière" className="p-2 border rounded" />
          <input name="school" value={formData.school || ''} onChange={handleChange} placeholder="École" className="p-2 border rounded" />
          <input name="level_choices" value={formData.level_choices || ''} onChange={handleChange} placeholder="Niveau" className="p-2 border rounded" />
          <input name="bac_year" value={formData.bac_year || ''} onChange={handleChange} placeholder="Année du bac" className="p-2 border rounded" />
        </>
      )}
      {user.status_choice === 'professeur' && (
        <>
          <input name="subject" value={formData.subject || ''} onChange={handleChange} placeholder="Matière" className="p-2 border rounded" />
          <input name="school" value={formData.school || ''} onChange={handleChange} placeholder="Écoles" className="p-2 border rounded" />
          <input name="study" value={formData.study || ''} onChange={handleChange} placeholder="Filières" className="p-2 border rounded" />
        </>
      )}
      {user.status_choice === 'administration' && (
        <>
          <input name="job" value={formData.job || ''} onChange={handleChange} placeholder="Poste" className="p-2 border rounded" />
          <input name="administration" value={formData.administration || ''} onChange={handleChange} placeholder="Administration" className="p-2 border rounded" />
          <input name="school" value={formData.school || ''} onChange={handleChange} placeholder="École" className="p-2 border rounded" />
          <input name="study" value={formData.study || ''} onChange={handleChange} placeholder="Filières" className="p-2 border rounded" />
        </>
      )}
      <div className="col-span-2 flex justify-end space-x-2 mt-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Enregistrer</button>
        <button type="button" onClick={handleCloseEdit} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Annuler</button>
      </div>
    </form>
  );
}
