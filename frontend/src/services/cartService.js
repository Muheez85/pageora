import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const addToCart = async (bookId, quantity) => {
  const response = await api.post(
    "/cart",
    {
      bookId,
      quantity,
    },
    getAuthConfig()
  );

  return response.data;
};

export const getCart = async () => {
  const response = await api.get(
    "/cart",
    getAuthConfig()
  );

  return response.data.cart;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.patch(
    `/cart/${itemId}`,
    {
      quantity,
    },
    getAuthConfig()
  );

  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(
    `/cart/${itemId}`,
    getAuthConfig()
  );

  return response.data;
};