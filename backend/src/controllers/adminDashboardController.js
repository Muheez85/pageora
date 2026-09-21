const prisma = require("../config/db");

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalBooks,
      totalCustomers,
      totalOrders,
      revenueResult,
      pendingOrders,
      paidOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      lowStockBooks,
      recentOrders,
    ] = await Promise.all([
      // Total books
      prisma.book.count(),

      // Customers only
      prisma.user.count({
        where: {
          role: "customer",
        },
      }),

      // Total orders
      prisma.order.count(),

      // Revenue
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          paymentStatus: "paid",
        },
      }),

      // Order statuses
      prisma.order.count({
        where: {
          status: "pending",
        },
      }),

      prisma.order.count({
        where: {
          status: "paid",
        },
      }),

      prisma.order.count({
        where: {
          status: "processing",
        },
      }),

      prisma.order.count({
        where: {
          status: "shipped",
        },
      }),

      prisma.order.count({
        where: {
          status: "delivered",
        },
      }),

      // Low stock
      prisma.book.findMany({
        where: {
          stock: {
            lte: 5,
          },
        },
        orderBy: {
          stock: "asc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          stock: true,
          price: true,
          coverImage: true,
        },
      }),

      // Recent orders
      prisma.order.findMany({
        take: 7,
        orderBy: {
          createdAt: "desc",
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
      }),
    ]);

    const revenue = Number(revenueResult._sum.total || 0);

    res.status(200).json({
      success: true,

      stats: {
        totalBooks,
        totalCustomers,
        totalOrders,
        revenue,
      },

      orderOverview: {
        pending: pendingOrders,
        paid: paidOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
      },

      lowStockBooks,

      recentOrders,
    });
  } catch (error) {
    console.error("GET ADMIN DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};

module.exports = {
  getAdminDashboard,
};