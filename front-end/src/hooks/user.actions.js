import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosService from "../helpers/axios";

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL;

  return {
    basicLogin,
    googleLogin,
    register,
    logout,
    edit,
  };

  // Connexion classique
  async function basicLogin(data) {
    try {
      const res = await axios.post(`${baseURL}/auth/login/`, data);
      if (isValidUserData(res.data)) {
        setUserData(res.data);
        navigate("/");
      } else {
        throw new Error("Invalid data structure from login response");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Connexion via Google
  async function googleLogin(response) {
      console.log("Google login response:", response); // Vérifiez si la réponse est correcte
      const { credential: tokenId } = response; // Récupérer le token d'identité Google
      console.log("Token ID:", tokenId);

      try {
          const res = await axios.post(`${baseURL}/auth/google/login/`, {
              token: tokenId,
          });

          const { access, refresh, user } = res.data;
          localStorage.setItem('auth', JSON.stringify({ access, refresh, user }));

          axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          navigate("/");
      } catch (err) {
          console.error('Google Login Failed:', err); // Afficher les erreurs
          throw err;
      }
  }

  // Enregistrement de l'utilisateur
  async function register(data) {
    try {
      const res = await axios.post(`${baseURL}/auth/register/`, data);
      if (isValidUserData(res.data)) {
        setUserData(res.data);
        navigate("/");
      } else {
        throw new Error("Invalid data structure from register response");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  // Modification des données utilisateur
  // function edit(data, userId) {
  //   try {
  //     const res = axiosService.patch(`${baseURL}/user/${userId}/`, data, {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     });
  //     if (res.data) {
  //       console.log(res.data)
  //       localStorage.setItem(
  //         "auth",
  //         JSON.stringify({
  //           access: getAccessToken(),
  //           refresh: getRefreshToken(),
  //           user: res.data,
  //         })
  //       );
  //     } else {
  //       throw new Error("Invalid data structure from edit response");
  //     }
  //   } catch (error) {
  //     console.error("Edit error:", error);
  //     throw error;
  //   }
  // }
  function edit(data, userId) {
    return axiosService
      .patch(`${baseURL}/user/${userId}/`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        // Registering the account in the store
        localStorage.setItem(
          "auth",
          JSON.stringify({
            access: getAccessToken(),
            refresh: getRefreshToken(),
            user: res.data,
          })
        );
      });
  }

  

  // Déconnexion de l'utilisateur
  async function logout() {
    try {
      await axios.post(`${baseURL}/auth/logout/`, { refresh: getRefreshToken() });
      localStorage.removeItem("auth");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}

// Validation de la structure des données utilisateur
function isValidUserData(data) {
  return data && data.access && data.refresh && data.user;
}

// Récupérer l'utilisateur
function getUser() {
  const auth = JSON.parse(localStorage.getItem("auth")) || null;
  return auth ? auth.user : null;
}

// Récupérer le token d'accès
function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth ? auth.access : null;
}

// Récupérer le token de rafraîchissement
function getRefreshToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth ? auth.refresh : null;
}

// Enregistrer les données utilisateur
function setUserData(data) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    })
  );
}

export {
  useUserActions,
  getUser,
  getAccessToken,
  getRefreshToken,
  setUserData,
};
