import React, { useState } from 'react';
import { useUserActions } from '../../hooks/user.actions';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const userActions = useUserActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: form.username,
      password: form.password,
    };

    try {
      await userActions.basicLogin(data);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      await userActions.googleLogin(response);
    } catch (err) {
      setError("Google login failed.");
      console.error("Google login error:", err);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    setError("Google login was unsuccessful. Please try again.");
    console.error("Google login failure:", error);
  };

  return (
     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Se connecter
              </button>
            </form>

            <div className="mt-6 text-center">
              <GoogleLogin
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                buttonText="Se connecter avec Google"
                onSuccess={handleGoogleLoginSuccess}
                onFailure={handleGoogleLoginFailure}
                cookiePolicy={'single_host_origin'}
                className="w-full"
              />
            </div>
          </div>
        </div>
    </GoogleOAuthProvider>
  );
}
