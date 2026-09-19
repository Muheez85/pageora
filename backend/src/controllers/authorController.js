const prisma = require("../config/db");

// Get all authors
const getAuthors = async (req, res) => {
  try {
    const authors = await prisma.author.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      authors,
    });
  } catch (error) {
    console.error("GET AUTHORS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch authors",
    });
  }
};

// Create author
const createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Author name is required",
      });
    }

    const author = await prisma.author.create({
      data: {
        name: name.trim(),
        bio: bio?.trim() || null,
      },
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Author created successfully",
      author,
    });
  } catch (error) {
    console.error("CREATE AUTHOR ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create author",
    });
  }
};

// Update author
const updateAuthor = async (req, res) => {
  try {
    const authorId = Number(req.params.id);

    if (!authorId) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }

    const existingAuthor = await prisma.author.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    const { name, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Author name is required",
      });
    }

    const author = await prisma.author.update({
      where: {
        id: authorId,
      },
      data: {
        name: name.trim(),
        bio: bio?.trim() || null,
      },
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Author updated successfully",
      author,
    });
  } catch (error) {
    console.error("UPDATE AUTHOR ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update author",
    });
  }
};

// Delete author
const deleteAuthor = async (req, res) => {
  try {
    const authorId = Number(req.params.id);

    if (!authorId) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }

    const existingAuthor = await prisma.author.findUnique({
      where: {
        id: authorId,
      },
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    if (existingAuthor._count.books > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This author cannot be deleted because they are assigned to books.",
      });
    }

    await prisma.author.delete({
      where: {
        id: authorId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Author deleted successfully",
    });
  } catch (error) {
    console.error("DELETE AUTHOR ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete author",
    });
  }
};

module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};