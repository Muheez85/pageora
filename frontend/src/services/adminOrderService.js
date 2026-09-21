import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all admin orders
export const getAdminOrders = async (params = {}) => {
  const response = await api.get(
    "/admin/orders",
    {
      ...getAuthConfig(),
      params,
    }
  );

  return response.data;
};

// Get one admin order
export const getAdminOrderById = async (id) => {
  const response = await api.get(
    `/admin/orders/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// Update order status
export const updateAdminOrderStatus = async (
  id,
  status
) => {
  const response = await api.put(
    `/admin/orders/${id}/status`,
    { status },
    getAuthConfig()
  );

  return response.data;
};
