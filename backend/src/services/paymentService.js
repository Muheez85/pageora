const prisma = require("../config/db");

const PAYSTACK_URL = "https://api.paystack.co";

const initializePayment = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: Number(orderId),
      userId,
    },
    include: {
      user: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "pending") {
    throw new Error("This order can no longer be paid for");
  }

  if (order.paymentStatus === "paid") {
    throw new Error("This order has already been paid for");
  }

  const reference =
    order.paymentReference ||
    `PAGEORA-${order.id}-${Date.now()}`;

  const response = await fetch(
    `${PAYSTACK_URL}/transaction/initialize`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: order.user.email,

        // Paystack expects the amount in the
        // smallest currency unit.
        amount: String(Math.round(Number(order.total) * 100)),

        currency: "NGN",

        reference,

        metadata: {
          orderId: order.id,
          userId,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.status) {
    console.error("PAYSTACK INITIALIZE ERROR:", data);

    throw new Error(
      data.message || "Failed to initialize payment"
    );
  }

  await prisma.order.update({
    where: {
      id: order.id,
    },

    data: {
      paymentReference: data.data.reference,
    },
  });

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
};

const verifyPayment = async (userId, reference) => {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      paymentReference: reference,
    },

    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Prevent double fulfillment.
  if (order.paymentStatus === "paid") {
    return order;
  }

  const response = await fetch(
    `${PAYSTACK_URL}/transaction/verify/${encodeURIComponent(
      reference
    )}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(
      data.message || "Failed to verify payment"
    );
  }

  const transaction = data.data;

  // Payment must actually be successful.
  if (transaction.status !== "success") {
    throw new Error(
      `Payment is not successful. Current status: ${transaction.status}`
    );
  }

  // Verify the amount.
  const expectedAmount = Math.round(
    Number(order.total) * 100
  );

  if (Number(transaction.amount) !== expectedAmount) {
    throw new Error(
      "Payment amount does not match the order total"
    );
  }

  // Verify currency.
  if (transaction.currency !== "NGN") {
    throw new Error("Invalid payment currency");
  }

  const updatedOrder = await prisma.$transaction(
    async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: {
          id: order.id,
        },

        include: {
          items: true,
        },
      });

      if (!currentOrder) {
        throw new Error("Order not found");
      }

      // Prevent duplicate fulfillment.
      if (currentOrder.paymentStatus === "paid") {
        return currentOrder;
      }

      // Check stock again immediately before fulfillment.
      for (const item of currentOrder.items) {
        const book = await tx.book.findUnique({
          where: {
            id: item.bookId,
          },
        });

        if (!book) {
          throw new Error(
            `Book with ID ${item.bookId} no longer exists`
          );
        }

        if (book.stock < item.quantity) {
          throw new Error(
            `Not enough stock available for "${book.title}"`
          );
        }
      }

      // Reduce stock.
      for (const item of currentOrder.items) {
        await tx.book.update({
          where: {
            id: item.bookId,
          },

          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Remove only the quantities that were purchased
      // from the customer's cart.
      const cart = await tx.cart.findUnique({
        where: {
          userId,
        },
      });

      if (cart) {
        for (const item of currentOrder.items) {
          const cartItem = await tx.cartItem.findUnique({
            where: {
              cartId_bookId: {
                cartId: cart.id,
                bookId: item.bookId,
              },
            },
          });

          if (!cartItem) {
            continue;
          }

          if (cartItem.quantity <= item.quantity) {
            await tx.cartItem.delete({
              where: {
                id: cartItem.id,
              },
            });
          } else {
            await tx.cartItem.update({
              where: {
                id: cartItem.id,
              },

              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }
      }

      return tx.order.update({
        where: {
          id: currentOrder.id,
        },

        data: {
          status: "paid",
          paymentStatus: "paid",
          paidAt: new Date(),
        },

        include: {
          items: {
            include: {
              book: true,
            },
          },
        },
      });
    }
  );

  return updatedOrder;
};

module.exports = {
  initializePayment,
  verifyPayment,
};