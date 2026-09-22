import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";

import {
  getAdminBooks,
  getBookCategories,
  getBookAuthors,
  updateAdminBook,
} from "../../services/adminBookService";

const AdminEditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    isbn: "",
    categoryId: "",
    authorIds: [],
  });

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, categoriesData, authorsData] =
          await Promise.all([
            getAdminBooks(),
            getBookCategories(),
            getBookAuthors(),
          ]);

        const book = booksData.books.find(
          (book) => book.id === Number(id)
        );

        if (!book) {
          setError("Book not found.");
          return;
        }

        setFormData({
          title: book.title || "",
          description: book.description || "",
          price: book.price ?? "",
          stock: book.stock ?? "",
          isbn: book.isbn || "",
          categoryId: book.categoryId || "",
          authorIds: book.authors?.map((author) => author.id) || [],
        });

        setCategories(categoriesData.categories || []);
        setAuthors(authorsData.authors || []);

        if (book.coverImage) {
          setPreview(book.coverImage);
        }
      } catch (error) {
        console.error("LOAD EDIT BOOK ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Could not load book information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuthorChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => Number(option.value)
    );

    setFormData((prev) => ({
      ...prev,
      authorIds: selectedOptions,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setCoverImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("isbn", formData.isbn);
      data.append("categoryId", formData.categoryId);

      data.append(
        "authorIds",
        JSON.stringify(formData.authorIds)
      );

      if (coverImage) {
        data.append("image", coverImage);
      }

      await updateAdminBook(id, data);

      navigate("/admin/books");
    } catch (error) {
      console.error("UPDATE BOOK ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update book."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading book...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/admin/books")}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Book
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update this book's information and inventory.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Main information */}
          <div className="space-y-6 xl:col-span-2">

            {/* Book Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Book Information
              </h2>

              <div className="space-y-5">

                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Book Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Authors
                  </label>

                  <select
                    multiple
                    value={formData.authorIds}
                    onChange={handleAuthorChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  >
                    {authors.map((author) => (
                      <option
                        key={author.id}
                        value={author.id}
                      >
                        {author.name}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-gray-500">
                    Hold Ctrl/Cmd to select multiple authors.
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  >
                    <option value="">
                      Select a category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Inventory & Pricing
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>

                {/* ISBN */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ISBN
                  </label>

                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cover */}
          <div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Book Cover
              </h2>

              {!preview ? (
                <label className="flex min-h-320px cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 text-center transition hover:border-gray-500 hover:bg-gray-50">
                  <Upload
                    size={32}
                    className="mb-4 text-gray-400"
                  />

                  <p className="text-sm font-medium text-gray-700">
                    Upload new cover
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG or WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={preview}
                    alt="Book cover"
                    className="h-320px w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {coverImage && (
                <p className="mt-3 text-xs text-gray-500">
                  A new image will replace the current cover.
                </p>
              )}
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/books")}
              className="mt-3 w-full rounded-lg border border-gray-300 px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminEditBook;