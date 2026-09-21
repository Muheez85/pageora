import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all categories
export const getAdminCategories = async () => {
  const response = await api.get(
    "/categories",
    getAuthConfig()
  );

  return response.data;
};

// Create category
export const createAdminCategory = async (formData) => {
  const response = await api.post(
    "/categories",
    formData,
    getAuthConfig()
  );

  return response.data;
};

// Update category
export const updateAdminCategory = async (id, formData) => {
  const response = await api.put(
    `/categories/${id}`,
    formData,
    getAuthConfig()
  );

  return response.data;
};

// Delete category
export const deleteAdminCategory = async (id) => {
  const response = await api.delete(
    `/categories/${id}`,
    getAuthConfig()
  );

  return response.data;
};