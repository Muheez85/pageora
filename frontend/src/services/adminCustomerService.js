import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all customers
export const getAdminCustomers = async (
  params = {}
) => {
  const response = await api.get(
    "/admin/customers",
    {
      ...getAuthConfig(),
      params,
    }
  );

  return response.data;
};

// Get one customer
export const getAdminCustomerById =
  async (id) => {
    const response = await api.get(
      `/admin/customers/${id}`,
      getAuthConfig()
    );

    return response.data;
  };