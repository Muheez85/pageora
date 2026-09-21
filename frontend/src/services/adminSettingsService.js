import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminSettings = async () => {
  const response = await api.get(
    "/admin/settings",
    getAuthConfig()
  );

  return response.data;
};

export const updateAdminSettings = async (data) => {
  const response = await api.put(
    "/admin/settings",
    data,
    getAuthConfig()
  );

  return response.data;
};