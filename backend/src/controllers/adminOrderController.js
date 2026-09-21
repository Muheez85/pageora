const prisma = require("../config/db");

// Valid order statuses
const validOrderStatuses = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
];

// Get all orders for admin
const getAdminOrders = async (req, res) => {
  try {
    const { search, status, paymentStatus } = req.query;

    const where = {};

    // Search by customer name, email, or order ID
    if (search) {
      const searchTerm = search.trim();

      const searchNumber = Number(searchTerm);

      where.OR = [
        {
          user: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ];

      if (!Number.isNaN(searchNumber)) {
        where.OR.push({
          id: searchNumber,
        });
      }
    }

    // Filter by order status
    if (
      status &&
      validOrderStatuses.includes(status)
    ) {
      where.status = status;
    }

    // Filter by payment status
    if (
      paymentStatus &&
      ["unpaid", "paid"].includes(paymentStatus)
    ) {
      where.paymentStatus = paymentStatus;
    }

    const orders = await prisma.order.findMany({
      where,

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

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
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ADMIN ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Get one order
const getAdminOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

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
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET ADMIN ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!status || !validOrderStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const existingOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

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
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update order status",
    });
  }
};

module.exports = {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
};