import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getWishlist = async () => {
  const response = await api.get(
    "/wishlist",
    getAuthConfig()
  );

  return response.data.wishlist;
};

export const addToWishlist = async (bookId) => {
  const response = await api.post(
    `/wishlist/${bookId}`,
    {},
    getAuthConfig()
  );

  return response.data;
};

export const removeFromWishlist = async (bookId) => {
  const response = await api.delete(
    `/wishlist/${bookId}`,
    getAuthConfig()
  );

  return response.data;
};