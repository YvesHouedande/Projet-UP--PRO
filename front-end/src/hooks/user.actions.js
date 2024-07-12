// import { useNavigate } from "react-router-dom";
// import axiosService from "../helpers/axios";
// import axios from "axios";

// function useUserActions() {
//   const navigate = useNavigate();
//   const baseURL = import.meta.env.VITE_REACT_APP_API_URL

//   return {
//     login,
//     register,
//     logout,
//     edit,
//   };

//   // Login the user
//   function login(data) {
//     return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
//       // Registering the account and tokens in the store
//       setUserData(res.data);
//       navigate("/");
//     });
//   }

//   // Register the user
//   function register(data) {
//     return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
//       // Registering the account and tokens in the store
//       setUserData(res.data);
//       navigate("/");
//     });
//   }

//   // Edit the user
//   function edit(data, userId) {
//     return axiosService
//       .patch(`${baseURL}/user/${userId}/`, data, {
//         headers: {
//           "content-type": "multipart/form-data",
//         },
//       })
//       .then((res) => {
//         // Registering the account in the store
//         localStorage.setItem(
//           "auth",
//           JSON.stringify({
//             access: getAccessToken(),
//             refresh: getRefreshToken(),
//             user: res.data,
//           })
//         );
//       });
//   }

//   // Logout the user
//   function logout() {
//     return axiosService
//       .post(`${baseURL}/auth/logout/`, { refresh: getRefreshToken() })
//       .then(() => {
//         localStorage.removeItem("auth");
//         navigate("/login");
//       });
//   }
// }

// // Get the user
// function getUser() {
//   const auth = JSON.parse(localStorage.getItem("auth")) || null;
//   if (auth) {
//     return auth.user;
//   } else {
//     return null;
//   }
// }

// // Get the access token
// function getAccessToken() {
//   const auth = JSON.parse(localStorage.getItem("auth"));
//   return auth.access;
// }

// // Get the refresh token
// function getRefreshToken() {
//   const auth = JSON.parse(localStorage.getItem("auth"));
//   return auth.refresh;
// }

// // Set the access, token and user property
// function setUserData(data) {
//   localStorage.setItem(
//     "auth",
//     JSON.stringify({
//       access: data.access,
//       refresh: data.refresh,
//       user: data.user,
//     })
//   );
// }

// export {
//   useUserActions,
//   getUser,
//   getAccessToken,
//   getRefreshToken,
//   setUserData,
// };


import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios";
import axios from "axios";

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL;

  return {
    login,
    register,
    logout,
    edit,
  };

  // Login the user
  async function login(data) {
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

  // Register the user
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

  // Edit the user
  async function edit(data, userId) {
    try {
      const res = await axiosService.patch(`/user/${userId}/`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      if (res.data && res.data.user) {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            access: getAccessToken(),
            refresh: getRefreshToken(),
            user: res.data,
          })
        );
      } else {
        throw new Error("Invalid data structure from edit response");
      }
    } catch (error) {
      console.error("Edit error:", error);
      throw error;
    }
  }

  // Logout the user
  async function logout() {
    try {
      await axiosService.post(`${baseURL}/auth/logout/`, { refresh: getRefreshToken() });
      localStorage.removeItem("auth");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}

// Helper function to validate user data structure
function isValidUserData(data) {
  return data && data.access && data.refresh && data.user;
}

// Get the user
function getUser() {
  const auth = JSON.parse(localStorage.getItem("auth")) || null;
  return auth ? auth.user : null;
}

// Get the access token
function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth ? auth.access : null;
}

// Get the refresh token
function getRefreshToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth ? auth.refresh : null;
}

// Set the access, token and user property
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
