const prisma = require("../config/db");
const cloudinary = require("../config/cloudinary");

// Create a URL-friendly slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Make sure slug is unique
const generateUniqueSlug = async (name, categoryId = null) => {
  const baseSlug = createSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug,
        ...(categoryId && {
          NOT: {
            id: categoryId,
          },
        }),
      },
    });

    if (!existingCategory) {
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
        folder: "pageora/categories",
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

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
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
      categories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = await generateUniqueSlug(name);

    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        image: imageUrl,
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
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name } = req.body;

    let slug = existingCategory.slug;

    if (name && name.trim() !== existingCategory.name) {
      slug = await generateUniqueSlug(name, categoryId);
    }

    let imageUrl = existingCategory.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name ? name.trim() : existingCategory.name,
        slug,
        image: imageUrl,
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
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update category",
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (existingCategory._count.books > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This category cannot be deleted because it has books assigned to it.",
      });
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete category",
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};