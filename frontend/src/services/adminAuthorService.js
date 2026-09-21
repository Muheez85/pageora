import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all authors
export const getAdminAuthors = async () => {
  const response = await api.get(
    "/authors",
    getAuthConfig()
  );

  return response.data;
};

// Create author
export const createAdminAuthor = async (authorData) => {
  const response = await api.post(
    "/authors",
    authorData,
    getAuthConfig()
  );

  return response.data;
};

// Update author
export const updateAdminAuthor = async (id, authorData) => {
  const response = await api.put(
    `/authors/${id}`,
    authorData,
    getAuthConfig()
  );

  return response.data;
};

// Delete author
export const deleteAdminAuthor = async (id) => {
  const response = await api.delete(
    `/authors/${id}`,
    getAuthConfig()
  );

  return response.data;
};