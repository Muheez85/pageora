import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createOrder = async (shippingData) => {
  const response = await api.post(
    "/orders",
    shippingData,
    getAuthConfig()
  );

  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders", getAuthConfig());

  return response.data.orders;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(
    `/orders/${orderId}`,
    getAuthConfig()
  );

  return response.data.order;
};