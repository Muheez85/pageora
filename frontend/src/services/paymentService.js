import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const initializePayment = async (orderId) => {
  const response = await api.post(
    "/payments/initialize",
    { orderId },
    getAuthConfig()
  );

  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await api.post(
    "/payments/verify",
    { reference },
    getAuthConfig()
  );

  return response.data;
};