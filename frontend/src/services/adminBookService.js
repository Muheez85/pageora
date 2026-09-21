import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all admin books
export const getAdminBooks = async () => {
  const response = await api.get(
    "/admin/books",
    getAuthConfig()
  );

  return response.data;
};

// Create book
export const createAdminBook = async (formData) => {
  const response = await api.post(
    "/admin/books",
    formData,
    getAuthConfig()
  );

  return response.data;
};

// Update book
export const updateAdminBook = async (id, formData) => {
  const response = await api.put(
    `/admin/books/${id}`,
    formData,
    getAuthConfig()
  );

  return response.data;
};

// Delete book
export const deleteAdminBook = async (id) => {
  const response = await api.delete(
    `/admin/books/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// Get categories
export const getBookCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

// Get authors
export const getBookAuthors = async () => {
  const response = await api.get("/authors");

  return response.data;
};