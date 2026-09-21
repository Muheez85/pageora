import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminShippingLocations =
  async () => {
    const response = await api.get(
      "/admin/shipping",
      getAuthConfig()
    );

    return response.data;
  };

export const createAdminShippingLocation =
  async (data) => {
    const response = await api.post(
      "/admin/shipping",
      data,
      getAuthConfig()
    );

    return response.data;
  };

export const updateAdminShippingLocation =
  async (id, data) => {
    const response = await api.put(
      `/admin/shipping/${id}`,
      data,
      getAuthConfig()
    );

    return response.data;
  };

export const toggleAdminShippingLocation =
  async (id) => {
    const response = await api.patch(
      `/admin/shipping/${id}/toggle`,
      {},
      getAuthConfig()
    );

    return response.data;
  };

export const deleteAdminShippingLocation =
  async (id) => {
    const response = await api.delete(
      `/admin/shipping/${id}`,
      getAuthConfig()
    );

    return response.data;
  };