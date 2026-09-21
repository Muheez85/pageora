import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminDashboard = async () => {
  const response = await api.get(
    "/admin/dashboard",
    getAuthConfig()
  );

  return response.data;
};