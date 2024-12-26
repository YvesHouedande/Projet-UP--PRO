import React, { useState } from 'react';
import { useUserActions } from '../../hooks/user.actions';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ErrorModal from '../assets/MessageModal';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    status_choice: "etudiant",
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");

  const userActions = useUserActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setErrors({ ...errors, confirmPassword: ["Les mots de passe ne correspondent pas"] });
      return;
    }

    const data = {
      email: form.email,
      password: form.password,
      first_name: form.first_name,
      last_name: form.last_name,
      status_choice: form.status_choice,
    };

    try {
      setErrors({});
      setModalError("");
      await userActions.register(data);
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setModalError("Une erreur inattendue s'est produite. Veuillez réessayer.");
        setIsModalOpen(true);
      }
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      await userActions.googleLogin(response);
    } catch (err) {
      setModalError("L'inscription avec Google a échoué.");
      setIsModalOpen(true);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    setModalError("L'inscription avec Google a échoué. Veuillez réessayer.");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4 text-center">Inscription</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="first_name" className="block text-sm text-gray-700">Prénom</label>
              <input
                type="text"
                id="first_name"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 text-sm"
                required
              />
              {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name[0]}</p>}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm text-gray-700">Nom</label>
              <input
                type="text"
                id="last_name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 text-sm"
                required
              />
              {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name[0]}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 text-sm"
                required
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email[0]}</p>}
            </div>

            <div>
              <label htmlFor="status_choice" className="block text-sm text-gray-700">Statut</label>
              <select
                id="status_choice"
                value={form.status_choice}
                onChange={(e) => setForm({ ...form, status_choice: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 text-sm"
                required
              >
                <option value="etudiant">Étudiant</option>
                <option value="professeur">Professeur</option>
                <option value="personnel">Personnel</option>
                <option value="autre">Autre</option>
              </select>
              {errors.status_choice && <p className="text-red-500 text-xs">{errors.status_choice[0]}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 text-sm"
                required
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password[0]}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-gray-700">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 text-sm"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword[0]}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-sm"
            >
              S'inscrire
            </button>
          </form>

          <div className="mt-3 text-center text-sm">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <div className="mt-3">
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
      </div>

      <ErrorModal message={modalError} onClose={handleCloseModal} isOpen={isModalOpen} />
    </GoogleOAuthProvider>
  );
}
