import api from "../api/axios";

export const getBooks = async () => {
  const response = await api.get("/books");

  return response.data.books;
};