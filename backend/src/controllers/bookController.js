const prisma = require("../config/db");
const cloudinary = require("../config/cloudinary");

// Create a URL-friendly slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Make sure slug is unique
const generateUniqueSlug = async (title, bookId = null) => {
  const baseSlug = createSlug(title);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingBook = await prisma.book.findFirst({
      where: {
        slug,
        ...(bookId && {
          NOT: {
            id: bookId,
          },
        }),
      },
    });

    if (!existingBook) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "pageora/books",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        category: true,
        authors: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

// Get book by slug
const getBookBySlug = async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: {
        slug: req.params.slug,
      },
      include: {
        category: true,
        authors: true,
      },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("GET BOOK BY SLUG ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
};

// Create book
const createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      isbn,
      coverImage,
      categoryId,
      authorIds,
    } = req.body;

    if (
      !title ||
      price === undefined ||
      stock === undefined ||
      !isbn ||
      !categoryId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required book information is missing",
      });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(title);

    // Parse author IDs
    let parsedAuthorIds = [];

    if (authorIds) {
      try {
        parsedAuthorIds =
          typeof authorIds === "string"
            ? JSON.parse(authorIds)
            : authorIds;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid author information",
        });
      }
    }

    // Upload cover image if provided
    let uploadedImageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      uploadedImageUrl = result.secure_url;
    }

    // Create book
    const book = await prisma.book.create({
      data: {
        title,
        slug,
        description: description || null,
        price: Number(price),
        stock: Number(stock),
        isbn: isbn || null,
        coverImage: uploadedImageUrl || coverImage || null,
        categoryId: Number(categoryId),

        authors: parsedAuthorIds.length
          ? {
              connect: parsedAuthorIds.map((id) => ({
                id: Number(id),
              })),
            }
          : undefined,
      },

      include: {
        category: true,
        authors: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create book",
    });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const bookId = Number(req.params.id);

    // Find existing book
    const existingBook = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const {
      title,
      description,
      price,
      stock,
      isbn,
      coverImage,
      categoryId,
      authorIds,
    } = req.body;

    // Parse author IDs
    let parsedAuthorIds;

    if (authorIds !== undefined) {
      try {
        parsedAuthorIds =
          typeof authorIds === "string"
            ? JSON.parse(authorIds)
            : authorIds;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid author information",
        });
      }
    }

    // Generate a new slug only if title changed
    const slug =
      title && title !== existingBook.title
        ? await generateUniqueSlug(title, bookId)
        : existingBook.slug;

    // Upload new cover image if provided
    let uploadedImageUrl = existingBook.coverImage;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      uploadedImageUrl = result.secure_url;
    } else if (coverImage !== undefined) {
      uploadedImageUrl = coverImage || null;
    }

    // Update book
    const book = await prisma.book.update({
      where: {
        id: bookId,
      },

      data: {
        title: title ?? existingBook.title,

        slug,

        description:
          description !== undefined
            ? description || null
            : existingBook.description,

        price:
          price !== undefined
            ? Number(price)
            : existingBook.price,

        stock:
          stock !== undefined
            ? Number(stock)
            : existingBook.stock,

        isbn:
          isbn !== undefined
            ? isbn || null
            : existingBook.isbn,

        coverImage: uploadedImageUrl,

        categoryId:
          categoryId !== undefined
            ? Number(categoryId)
            : existingBook.categoryId,

        ...(parsedAuthorIds !== undefined && {
          authors: {
            set: parsedAuthorIds.map((id) => ({
              id: Number(id),
            })),
          },
        }),
      },

      include: {
        category: true,
        authors: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update book",
    });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const bookId = Number(req.params.id);

    const existingBook = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete book",
    });
  }
};

exports.getBooks = getBooks;
exports.getBookBySlug = getBookBySlug;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;