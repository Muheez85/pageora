import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAddresses = async () => {
  const response = await api.get(
    "/users/addresses",
    getAuthConfig()
  );

  return response.data.addresses || [];
};

export const createAddress = async (addressData) => {
  const response = await api.post(
    "/users/addresses",
    addressData,
    getAuthConfig()
  );

  return response.data.address;
};