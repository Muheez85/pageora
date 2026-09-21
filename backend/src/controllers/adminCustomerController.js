const prisma = require("../config/db");

// Get all customers
const getAdminCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    const where = {
      role: "customer",
    };

    // Search by name or email
    if (search) {
      const searchTerm = search.trim();

      where.OR = [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    const customers = await prisma.user.findMany({
      where,

      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,

        _count: {
          select: {
            orders: true,
            addresses: true,
          },
        },

        orders: {
          select: {
            total: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCustomers = customers.map(
      (customer) => {
        const totalSpent = customer.orders.reduce(
          (total, order) =>
            total + Number(order.total),
          0
        );

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          createdAt: customer.createdAt,

          orderCount: customer._count.orders,

          addressCount:
            customer._count.addresses,

          totalSpent,
        };
      }
    );

    res.status(200).json({
      success: true,
      customers: formattedCustomers,
    });
  } catch (error) {
    console.error(
      "GET ADMIN CUSTOMERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

// Get one customer
const getAdminCustomerById = async (
  req,
  res
) => {
  try {
    const customerId = Number(
      req.params.id
    );

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const customer =
      await prisma.user.findFirst({
        where: {
          id: customerId,
          role: "customer",
        },

        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,

          addresses: {
            orderBy: {
              createdAt: "desc",
            },
          },

          orders: {
            include: {
              items: {
                include: {
                  book: {
                    select: {
                      id: true,
                      title: true,
                      coverImage: true,
                    },
                  },
                },
              },
            },

            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const totalSpent = customer.orders.reduce(
      (total, order) =>
        total + Number(order.total),
      0
    );

    res.status(200).json({
      success: true,

      customer: {
        ...customer,

        orderCount: customer.orders.length,
        addressCount:
          customer.addresses.length,
        totalSpent,
      },
    });
  } catch (error) {
    console.error(
      "GET ADMIN CUSTOMER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};

module.exports = {
  getAdminCustomers,
  getAdminCustomerById,
};