const prisma = require("../config/db");

const getWishlist = async (userId) => {
  return prisma.wishlistItem.findMany({
    where: {
      userId,
    },
    include: {
      book: {
        include: {
          authors: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const addToWishlist = async (userId, bookId) => {
  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!book) {
    throw new Error("Book not found");
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
  });

  if (existingItem) {
    throw new Error("Book is already in your wishlist");
  }

  return prisma.wishlistItem.create({
    data: {
      userId,
      bookId,
    },
    include: {
      book: {
        include: {
          authors: true,
          category: true,
        },
      },
    },
  });
};

const removeFromWishlist = async (userId, bookId) => {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
  });

  if (!item) {
    throw new Error("Book is not in your wishlist");
  }

  await prisma.wishlistItem.delete({
    where: {
      id: item.id,
    },
  });

  return item;
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};