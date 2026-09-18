const prisma = require("../config/db");
const cloudinary = require("../config/cloudinary");
const slugify = require("../utils/slugify");

// GET ALL BOOK
const getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        authors: true,
        category: true,
      },
    });

    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

//   GET BOOK BY slug
const getBookBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const book = await prisma.book.findUnique({
      where: {
        slug,
      },
      include: {
        authors: true,
        category: true,
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
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
};


const createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      isbn,
      categoryId,
      authorIds,
    } = req.body;

    let coverImage;
const slug = slugify(title);
    // Upload book cover to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pageora/books",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file.buffer);
      });

      coverImage = result.secure_url;
    }

    const book = await prisma.book.create({
      data: {
        title,
        slug,
        description,
        price: Number(price),
        stock: Number(stock),
        isbn,
        coverImage,

        category: {
          connect: {
            id: Number(categoryId),
          },
        },

            authors: {
        connect: (Array.isArray(authorIds) ? authorIds : [authorIds]).map((id) => ({
          id: Number(id),
        })),
      },
      },

      include: {
        authors: true,
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
};


const updateBook = async (req, res) => {
  try {
    const bookId = Number(req.params.id);

    const { title, description, price, stock } = req.body;

    let imageUrl;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pageora/books",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const book = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(stock && { stock: Number(stock) }),
        ...(imageUrl && { coverImage: imageUrl }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};





module.exports = {
  getBooks,
  getBookBySlug,
  createBook,
  updateBook,
};