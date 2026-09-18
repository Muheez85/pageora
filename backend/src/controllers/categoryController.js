const prisma = require("../config/db");
const cloudinary = require("../config/cloudinary");


const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    let imageUrl;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pageora/categories",
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

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: imageUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
  console.error("UPDATE CATEGORY ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } 
    catch (error) {
  console.error("UPDATE CATEGORY ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};


const updateCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    const { name, slug } = req.body;

    let imageUrl;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pageora/categories",
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

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(imageUrl && { image: imageUrl }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
  console.error("UPDATE CATEGORY ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
};