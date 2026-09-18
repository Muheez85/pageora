const prisma = require("../config/db");

const getCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          book: {
            include: {
              authors: true,
              category: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            book: {
              include: {
                authors: true,
                category: true,
              },
            },
          },
        },
      },
    });
  }

  return cart;
};
const addToCart = async (userId, bookId, quantity) => {
  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!book) {
    throw new Error("Book not found");
  }

  if (book.stock < quantity) {
    throw new Error("Not enough stock available");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_bookId: {
        cartId: cart.id,
        bookId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > book.stock) {
      throw new Error("Not enough stock available");
    }

    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      bookId,
      quantity,
    },
  });
};

const updateCartItem = async (userId, itemId, quantity) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
    include: {
      book: true,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (quantity > cartItem.book.stock) {
    throw new Error("Not enough stock available");
  }

  return prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
  });
};

const removeCartItem = async (userId, itemId) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  return prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });
};
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};