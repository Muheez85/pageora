import api from "../api/axios";

export const getShippingLocations = async () => {
  const response = await api.get("/shipping");

  return response.data.locations;
};