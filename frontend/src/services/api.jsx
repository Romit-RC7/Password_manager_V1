import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// 🔥 PUBLIC ROUTES (NO TOKEN)
const publicRoutes = ["login/", "register/"];

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  // Skip token for public routes
  const isPublic = publicRoutes.some(route =>
    config.url.includes(route)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (HANDLE EXPIRED TOKEN)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized → logging out");

      // 🔥 Clear everything
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      sessionStorage.removeItem("isUnlocked");

      // 🔥 Redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;