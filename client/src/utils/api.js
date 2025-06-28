import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProfile = async (token) => {
  const response = await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProfile = async (token, profileData) => {
  const response = await api.put("/profile", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
