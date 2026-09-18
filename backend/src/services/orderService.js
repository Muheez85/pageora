const prisma = require("../config/db");

const createOrder = async (userId, shippingData) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  // Check current stock before creating the order.
  for (const item of cart.items) {
    if (item.quantity > item.book.stock) {
      throw new Error(
        `Not enough stock available for "${item.book.title}"`
      );
    }
  }

  const shippingLocation = await prisma.shippingLocation.findFirst({
    where: {
      id: Number(shippingData.shippingLocationId),
      active: true,
    },
  });

  if (!shippingLocation) {
    throw new Error("Invalid shipping location");
  }

  const subtotal = cart.items.reduce(
    (total, item) =>
      total + Number(item.book.price) * Number(item.quantity),
    0
  );

  const shippingFee = Number(shippingLocation.fee);
  const total = subtotal + shippingFee;

  // IMPORTANT:
  // We create the order as pending.
  // We DO NOT reduce stock yet.
  // We DO NOT clear the cart yet.
  const order = await prisma.order.create({
    data: {
      userId,
      status: "pending",

      subtotal,
      shippingFee,
      total,

      paymentStatus: "unpaid",

      shippingName: shippingData.shippingName,
      shippingPhone: shippingData.shippingPhone,
      shippingAddress: shippingData.shippingAddress,
      shippingCity: shippingData.shippingCity,
      shippingState: shippingData.shippingState,
      shippingCountry: shippingData.shippingCountry,

      items: {
        create: cart.items.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
          price: Number(item.book.price),
          subtotal:
            Number(item.book.price) * Number(item.quantity),
        })),
      },
    },

    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  return order;
};

const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },

    include: {
      items: {
        include: {
          book: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },

    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};