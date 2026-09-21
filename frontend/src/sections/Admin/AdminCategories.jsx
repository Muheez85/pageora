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

  // ---------------------------------------
  // LOAD CATEGORIES
  // ---------------------------------------

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

  // ---------------------------------------
  // SEARCH
  // ---------------------------------------

  const filteredCategories = categories.filter((category) =>
    category.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ---------------------------------------
  // OPEN ADD FORM
  // ---------------------------------------

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

  // ---------------------------------------
  // OPEN EDIT FORM
  // ---------------------------------------

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

  // ---------------------------------------
  // CLOSE FORM
  // ---------------------------------------

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

  // ---------------------------------------
  // FORM INPUT
  // ---------------------------------------

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // ---------------------------------------
  // IMAGE SELECT
  // ---------------------------------------

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ---------------------------------------
  // SUBMIT FORM
  // ---------------------------------------

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

      data.append("name", formData.name);

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

  // ---------------------------------------
  // DELETE CATEGORY
  // ---------------------------------------

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
      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--pageora-orange)]">
            Catalog
          </p>

          <h1 className="mt-1 text-4xl text-[var(--pageora-green)]">
            Categories
          </h1>

          <p className="mt-2 text-sm text-[var(--pageora-muted)]">
            Organize your bookstore and manage book categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-[var(--pageora-green)] px-5 py-3 text-sm font-medium text-white"
        >
          <Plus size={18} />
          Add category
        </button>
      </div>

      {/* SUCCESS */}

      {success && (
        <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* SEARCH */}

      <div className="mt-8">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pageora-muted)]"
          />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full border border-[var(--pageora-border)] bg-[var(--pageora-surface)] py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--pageora-green)]"
          />
        </div>
      </div>

      {/* ERROR */}

      {error && !showForm && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="mt-8">
          <p className="text-sm text-[var(--pageora-muted)]">
            Loading categories...
          </p>
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        filteredCategories.length === 0 && (
          <div className="mt-8 border border-[var(--pageora-border)] bg-[var(--pageora-surface)] p-10 text-center">
            <p className="text-sm text-[var(--pageora-muted)]">
              {search
                ? "No categories match your search."
                : "No categories found."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-4 text-sm font-medium text-[var(--pageora-green)] hover:underline"
              >
                Add your first category
              </button>
            )}
          </div>
        )}

      {/* CATEGORY TABLE */}

      {!loading &&
        filteredCategories.length > 0 && (
          <div className="mt-8 overflow-x-auto border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-[var(--pageora-border)]">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                    Slug
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                    Books
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-[var(--pageora-border)] last:border-b-0"
                  >
                    {/* CATEGORY */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden bg-[var(--pageora-background)]">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-[var(--pageora-muted)]">
                              No image
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-medium text-[var(--pageora-text)]">
                            {category.name}
                          </p>

                          <p className="mt-1 text-xs text-[var(--pageora-muted)]">
                            Category #{category.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SLUG */}

                    <td className="px-5 py-5 text-sm text-[var(--pageora-muted)]">
                      {category.slug}
                    </td>

                    {/* BOOK COUNT */}

                    <td className="px-5 py-5">
                      <span className="text-sm font-medium text-[var(--pageora-text)]">
                        {category._count?.books || 0}{" "}
                        {category._count?.books === 1
                          ? "book"
                          : "books"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenEdit(category)
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--pageora-green)] hover:underline"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category.id)
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
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
        )}

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-[var(--pageora-surface)]">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[var(--pageora-border)] px-6 py-5">
              <div>
                <p className="text-sm font-medium text-[var(--pageora-orange)]">
                  {editingCategory
                    ? "Edit category"
                    : "New category"}
                </p>

                <h2 className="mt-1 text-2xl text-[var(--pageora-green)]">
                  {editingCategory
                    ? "Update category"
                    : "Add category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="text-[var(--pageora-muted)] hover:text-[var(--pageora-text)]"
              >
                <X size={21} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {/* ERROR */}

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--pageora-text)]">
                  Category name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Fiction"
                  required
                  className="w-full border border-[var(--pageora-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--pageora-green)]"
                />

                <p className="mt-2 text-xs text-[var(--pageora-muted)]">
                  The category slug will be generated automatically.
                </p>
              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--pageora-text)]">
                  Category image
                </label>

                <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center border border-dashed border-[var(--pageora-border)] bg-[var(--pageora-background)] px-5 py-6 text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <>
                      <ImagePlus
                        size={30}
                        className="text-[var(--pageora-muted)]"
                      />

                      <p className="mt-3 text-sm font-medium text-[var(--pageora-text)]">
                        Choose an image
                      </p>

                      <p className="mt-1 text-xs text-[var(--pageora-muted)]">
                        JPG, PNG or WEBP
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <p className="mt-2 text-xs text-[var(--pageora-muted)]">
                    Select another image to replace the current one.
                  </p>
                )}
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--pageora-border)] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-3 text-sm font-medium text-[var(--pageora-muted)] hover:text-[var(--pageora-text)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[var(--pageora-green)] px-5 py-3 text-sm font-medium text-white"
                >
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