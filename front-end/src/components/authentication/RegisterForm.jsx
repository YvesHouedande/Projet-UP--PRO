import React, { useState } from 'react';
import { useUserActions } from '../../hooks/user.actions';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ErrorModal from '../assets/MessageModal';

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    status_choice: "etudiant", // Valeur par défaut
  });
  const [errors, setErrors] = useState({}); // État pour stocker les erreurs spécifiques
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'affichage du modal d'erreur
  const [modalError, setModalError] = useState(""); // État pour stocker les erreurs générales

  const userActions = useUserActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: form.username,
      email: form.email,
      password: form.password,
      status_choice: form.status_choice,
    };

    try {
      // Réinitialiser les erreurs avant une nouvelle tentative
      setErrors({});
      setModalError("");
      
      

      await userActions.register(data);
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data); // Stocker les erreurs spécifiques
      } else {
        setModalError("Une erreur inattendue s'est produite. Veuillez réessayer."); // Afficher un message d'erreur général
        setIsModalOpen(true); // Ouvrir le modal
      }
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      await userActions.googleLogin(response);
    } catch (err) {
      setModalError("Google registration failed.");
      setIsModalOpen(true);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    setModalError("Google registration was unsuccessful. Please try again.");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              {errors.username && <p className="text-red-500">{errors.username[0]}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Adresse email</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              {errors.email && <p className="text-red-500">{errors.email[0]}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="status_choice" className="block text-gray-700">Statut</label>
              <select
                id="status_choice"
                value={form.status_choice}
                onChange={(e) => setForm({ ...form, status_choice: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                required
              >
                <option value="etudiant">Étudiant</option>
                <option value="professeur">Professeur</option>
                <option value="administration">Administration</option>
                <option value="autre">Autre</option>
              </select>
              {errors.status_choice && <p className="text-red-500">{errors.status_choice[0]}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              {errors.password && <p className="text-red-500">{errors.password[0]}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              S'inscrire
            </button>
          </form>

          <div className="mt-6 text-center">
            <GoogleLogin
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              buttonText="S'inscrire avec Google"
              onSuccess={handleGoogleLoginSuccess}
              onFailure={handleGoogleLoginFailure}
              cookiePolicy={'single_host_origin'}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Modal pour les erreurs générales */}
      <ErrorModal message={modalError} onClose={handleCloseModal} isOpen={isModalOpen} />
    </GoogleOAuthProvider>
  );
}
