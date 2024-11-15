import React, { useState, useEffect } from 'react';
import axiosService from '../../helpers/axios';

export default function UpdateINPInfo({ user, inpInfo, handleCloseEdit, mutate }) {
  const [formData, setFormData] = useState({});
  const [schools, setSchools] = useState([]);
  const [allStudies, setAllStudies] = useState([]);
  const [availableStudies, setAvailableStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewProfile, setIsNewProfile] = useState(true);
  const [error, setError] = useState(null);

  const getEndpoint = (status) => {
    switch(status) {
      case 'etudiant': return 'student';
      case 'professeur': return 'professor';
      case 'personnel': return 'personnel';
      default: return '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [schoolsResponse, studiesResponse] = await Promise.all([
          axiosService.get('/school/'),
          axiosService.get('/study/'),
        ]);
        
        setSchools(schoolsResponse.data.results || []);
        setAllStudies(studiesResponse.data.results || []);

        if (inpInfo) {
          setFormData({
            ...inpInfo,
            school: inpInfo.school?.id,
            study: inpInfo.study?.id
          });
          setIsNewProfile(false);
        } else {
          setIsNewProfile(true);
          setFormData({});
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.public_id, user.status_choice, inpInfo]);

  useEffect(() => {
    if (formData.school) {
      const selectedSchool = schools.find(school => school.public_id === formData.school);
      if (selectedSchool) {
        const filteredStudies = allStudies.filter(study => study.school === selectedSchool.public_id);
        setAvailableStudies(filteredStudies);
      } else {
        setAvailableStudies([]);
      }
    } else {
      setAvailableStudies([]);
    }
  }, [formData.school, schools, allStudies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

    if (name === 'school') {
      setFormData(prevState => ({ ...prevState, study: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let response;
      const endpoint = getEndpoint(user.status_choice);
      
      const dataToSend = {
        ...formData,
        user: user.public_id,
      };
      if (isNewProfile) {
        response = await axiosService.post(`/user/${user.public_id}/${endpoint}/`, dataToSend);
      } else {
        response = await axiosService.put(`/${endpoint}/${inpInfo.public_id}/`, dataToSend);
      }
      console.log("Response:", response.data);
      mutate();
      handleCloseEdit();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations INP", error);
      setError("Une erreur s'est produite lors de la mise à jour des informations.");
    }
  };

  const LEVEL_CHOICES = [
    ['ts1', "TS1"], ['ts2', "TS2"], ['ts3', "TS3"],
    ["eng1", "ING1"], ["eng2", "ING2"], ["eng3", "ING3"],
    ["master1", "Master1"], ["master2", "Master2"],
  ];

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year);
    }
    return years;
  };

  if (isLoading) {
    return <div className="text-center text-green-600">Chargement...</div>;
  }

  const renderStudentFields = () => (
    <>
      <div>
        <label htmlFor="school" className="block text-sm font-medium text-green-700">École *</label>
        <select 
          id="school" 
          name="school" 
          value={formData.school || ''} 
          onChange={handleChange} 
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
          required
        >
          <option value="">Sélectionnez une école</option>
          {schools.map(school => (
            <option key={school.public_id} value={school.public_id}>{school.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="study" className="block text-sm font-medium text-green-700">Filière</label>
        <select 
          id="study" 
          name="study" 
          value={formData.study || ''} 
          onChange={handleChange} 
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
          disabled={!formData.school}
        >
          <option value="">Sélectionnez une filière</option>
          {availableStudies.map(study => (
            <option key={study.public_id} value={study.public_id}>{study.label}</option>
          ))}
        </select>
        {!formData.school && (
          <p className="mt-1 text-sm text-gray-500">Veuillez d'abord sélectionner une école pour voir les filières disponibles.</p>
        )}
      </div>
      <div>
        <label htmlFor="level_choices" className="block text-sm font-medium text-green-700">Niveau</label>
        <select 
          id="level_choices" 
          name="level_choices" 
          value={formData.level_choices || ''} 
          onChange={handleChange} 
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        >
          <option value="">Sélectionnez un niveau</option>
          {LEVEL_CHOICES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="bac_year" className="block text-sm font-medium text-green-700">
          Année du bac
        </label>
        <select
          id="bac_year"
          name="bac_year"
          value={formData.bac_year || ''}
          onChange={handleChange}
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        >
          <option value="">Sélectionnez une année</option>
          {generateYearOptions().map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  const renderProfessorFields = () => (
    <>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-green-700">Matière</label>
        <input 
          type="text" 
          id="subject" 
          name="subject" 
          value={formData.subject || ''} 
          onChange={handleChange} 
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="school" className="block text-sm font-medium text-green-700">École(s)</label>
        <select 
          id="school" 
          name="school" 
          value={formData.school || []} 
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, school: selectedOptions }));
          }}
          multiple
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        >
          {schools.map(school => (
            <option key={school.public_id} value={school.public_id}>{school.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="study" className="block text-sm font-medium text-green-700">Filière(s)</label>
        <select 
          id="study" 
          name="study" 
          value={formData.study || []} 
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, study: selectedOptions }));
          }}
          multiple
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        >
          {allStudies.map(study => (
            <option key={study.public_id} value={study.public_id}>{study.label}</option>
          ))}
        </select>
      </div>
    </>
  );

  const renderPersonnelFields = () => (
    <>
      <div>
        <label htmlFor="job" className="block text-sm font-medium text-green-700">Poste</label>
        <input 
          type="text" 
          id="job" 
          name="job" 
          value={formData.job || ''} 
          onChange={handleChange} 
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="administration" className="block text-sm font-medium text-green-700">Administration</label>
        <input 
          type="text" 
          id="administration" 
          name="administration" 
          value={formData.administration || ''} 
          onChange={handleChange} 
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="school" className="block text-sm font-medium text-green-700">École</label>
        <select 
          id="school" 
          name="school" 
          value={formData.school || ''} 
          onChange={handleChange} 
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        >
          <option value="">Sélectionnez une école</option>
          {schools.map(school => (
            <option key={school.public_id} value={school.public_id}>{school.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="study" className="block text-sm font-medium text-green-700">Filière</label>
        <select 
          id="study" 
          name="study" 
          value={formData.study || ''} 
          onChange={handleChange} 
          className="mt-1 block w-full py-2 px-3 border-2 border-green-300 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
        >
          <option value="">Sélectionnez une filière</option>
          {availableStudies.map(study => (
            <option key={study.public_id} value={study.public_id}>{study.label}</option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white rounded-xl shadow-lg">
      {user.status_choice === 'etudiant' && renderStudentFields()}
      {user.status_choice === 'professeur' && renderProfessorFields()}
      {user.status_choice === 'personnel' && renderPersonnelFields()}
      {error && <div className="col-span-2 text-red-500">{error}</div>}
      <div className="col-span-2 flex justify-end space-x-2 mt-4">
        <button 
          type="submit" 
          className="inline-flex justify-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isNewProfile ? "Créer le profil" : "Mettre à jour"}
        </button>
        <button 
          type="button" 
          onClick={handleCloseEdit} 
          className="inline-flex justify-center py-2 px-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
