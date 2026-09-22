import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ImagePlus,
} from "lucide-react";

import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../../services/adminCategoryService";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminCategories();

      setCategories(data.categories || []);
    } catch (error) {
      console.error("ADMIN CATEGORIES ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Could not load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
    });

    setImage(null);
    setImagePreview("");

    setError("");
    setSuccess("");

    setShowForm(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
    });

    setImage(null);
    setImagePreview(category.image || "");

    setError("");
    setSuccess("");

    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);

    setFormData({
      name: "",
    });

    setImage(null);
    setImagePreview("");

    setError("");
  };

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append("name", formData.name.trim());

      if (image) {
        data.append("image", image);
      }

      if (editingCategory) {
        const response = await updateAdminCategory(
          editingCategory.id,
          data
        );

        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === editingCategory.id
              ? response.category
              : category
          )
        );

        setSuccess("Category updated successfully.");
      } else {
        const response = await createAdminCategory(data);

        setCategories((prevCategories) => [
          response.category,
          ...prevCategories,
        ]);

        setSuccess("Category created successfully.");
      }

      handleCloseForm();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("CATEGORY SAVE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save category."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAdminCategory(id);

      setCategories((prevCategories) =>
        prevCategories.filter(
          (category) => category.id !== id
        )
      );

      setSuccess("Category deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-pageora-orange">
            Catalog
          </p>

          <h1 className="mt-2 text-4xl text-pageora-green">
            Categories
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-pageora-muted">
            Organize your bookstore and manage book categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-pageora-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e3f31] hover:shadow-sm"
        >
          <Plus size={18} />
          Add category
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Search */}
      <div className="mt-8">
        <div className="relative max-w-lg">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-pageora-muted"
          />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-lg border border-pageora-border bg-pageora-surface py-3 pl-11 pr-4 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
          />
        </div>
      </div>

      {/* Error */}
      {error && !showForm && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-8 rounded-2xl border border-pageora-border bg-pageora-surface p-10 text-center">
          <p className="text-sm text-pageora-muted">
            Loading categories...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredCategories.length === 0 && (
          <div className="mt-8 rounded-2xl border border-pageora-border bg-pageora-surface p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-pageora-background text-pageora-green">
              <Plus size={22} />
            </div>

            <h2 className="mt-4 text-xl text-pageora-text">
              {search
                ? "No categories found"
                : "No categories yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-pageora-muted">
              {search
                ? "Try a different search term."
                : "Add your first category to start organizing your books."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-pageora-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e3f31]"
              >
                <Plus size={17} />
                Add category
              </button>
            )}
          </div>
        )}

      {/* Category Table */}
      {!loading &&
        !error &&
        filteredCategories.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-pageora-border bg-pageora-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="border-b border-pageora-border bg-pageora-background/50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Slug
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Books
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-pageora-border last:border-b-0 transition hover:bg-pageora-background/40"
                    >
                      {/* Category */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-pageora-background">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-pageora-muted">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-pageora-text">
                              {category.name}
                            </p>

                            <p className="mt-1 text-xs text-pageora-muted">
                              Category #{category.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-5 text-sm text-pageora-muted">
                        {category.slug}
                      </td>

                      {/* Books */}
                      <td className="px-5 py-5">
                        <span className="text-sm font-medium text-pageora-text">
                          {category._count?.books || 0}{" "}
                          {category._count?.books === 1
                            ? "book"
                            : "books"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEdit(category)
                            }
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-pageora-green transition hover:opacity-70"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(category.id)
                            }
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition hover:opacity-70"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-pageora-border bg-pageora-surface shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-pageora-border px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-pageora-orange">
                  {editingCategory
                    ? "Edit category"
                    : "New category"}
                </p>

                <h2 className="mt-1 text-2xl text-pageora-green">
                  {editingCategory
                    ? "Update category"
                    : "Add category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-pageora-muted transition hover:bg-pageora-background hover:text-pageora-text"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {/* Form Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-medium text-pageora-text"
                >
                  Category name
                </label>

                <input
                  id="category-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Fiction"
                  required
                  className="w-full rounded-lg border border-pageora-border bg-pageora-background px-4 py-3 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                />

                <p className="mt-2 text-xs text-pageora-muted">
                  The category slug will be generated automatically.
                </p>
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-pageora-text">
                  Category image
                </label>

                <label
                  htmlFor="category-image"
                  className="block cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="relative overflow-hidden rounded-xl border border-pageora-border bg-pageora-background">
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="h-52 w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-black/50 px-4 py-3 text-center text-xs font-medium text-white">
                        Click to replace image
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-pageora-border bg-pageora-background px-5 py-8 text-center transition hover:border-pageora-green">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pageora-surface text-pageora-green">
                        <ImagePlus size={24} />
                      </div>

                      <p className="mt-4 text-sm font-medium text-pageora-text">
                        Choose an image
                      </p>

                      <p className="mt-1 text-xs text-pageora-muted">
                        JPG, PNG or WEBP
                      </p>
                    </div>
                  )}

                  <input
                    id="category-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <p className="mt-2 text-xs text-pageora-muted">
                    Select another image to replace the current one.
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-pageora-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-lg border border-pageora-border px-5 py-3 text-sm font-medium text-pageora-text transition hover:bg-pageora-background"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-pageora-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e3f31]"
                >
                  <Plus size={17} />

                  {editingCategory
                    ? "Save changes"
                    : "Create category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminCategories;