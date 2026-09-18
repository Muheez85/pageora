

const prisma = require("../config/db");

const createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const author = await prisma.author.create({
      data: {
        name,
        bio,
      },
    });

    res.status(201).json({
      success: true,
      message: "Author created successfully",
      author,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create author",
    });
  }
};

module.exports = {
  createAuthor,
};