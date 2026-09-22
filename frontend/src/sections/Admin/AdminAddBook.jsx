import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ImagePlus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getBookCategories,
  getBookAuthors,
  createAdminBook,
} from "../../services/adminBookService";

import { createAdminAuthor } from "../../services/adminAuthorService";

const AdminAddBook = () => {
  const navigate = useNavigate();
  const authorInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    isbn: "",
    categoryId: "",
  });

  const [selectedAuthors, setSelectedAuthors] = useState([]);

  const [authorSearch, setAuthorSearch] = useState("");
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [categoriesData, authorsData] = await Promise.all([
          getBookCategories(),
          getBookAuthors(),
        ]);

        setCategories(categoriesData.categories || []);
        setAuthors(authorsData.authors || []);
      } catch (error) {
        console.error("LOAD ADD BOOK DATA ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Could not load categories and authors."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const normalizeAuthorName = (name) => {
    return name.trim().replace(/\s+/g, " ");
  };

  const selectedAuthorIds = selectedAuthors.map((author) => author.id);

  const filteredAuthors = authors.filter((author) => {
    const alreadySelected = selectedAuthorIds.includes(author.id);

    if (alreadySelected) return false;

    if (!authorSearch.trim()) return true;

    return author.name
      .toLowerCase()
      .includes(authorSearch.trim().toLowerCase());
  });

  const exactAuthorExists = authors.some(
    (author) =>
      author.name.trim().toLowerCase() ===
      normalizeAuthorName(authorSearch).toLowerCase()
  );

  const handleSelectAuthor = (author) => {
    if (
      selectedAuthors.some(
        (selected) => selected.id === author.id
      )
    ) {
      return;
    }

    setSelectedAuthors((prev) => [...prev, author]);
    setAuthorSearch("");
    setShowAuthorDropdown(false);
  };

  const handleRemoveAuthor = (authorId) => {
    setSelectedAuthors((prev) =>
      prev.filter((author) => author.id !== authorId)
    );
  };

  const handleCreateNewAuthor = async () => {
    const name = normalizeAuthorName(authorSearch);

    if (!name) return;

    const existingAuthor = authors.find(
      (author) =>
        author.name.trim().toLowerCase() ===
        name.toLowerCase()
    );

    if (existingAuthor) {
      handleSelectAuthor(existingAuthor);
      return;
    }

    try {
      setError("");

      const response = await createAdminAuthor({
        name,
      });

      const newAuthor =
        response.author ||
        response.data?.author ||
        response;

      if (!newAuthor?.id) {
        throw new Error("Author was created but no author ID was returned.");
      }

      setAuthors((prev) => [...prev, newAuthor]);

      setSelectedAuthors((prev) => [
        ...prev,
        newAuthor,
      ]);

      setAuthorSearch("");
      setShowAuthorDropdown(false);
    } catch (error) {
      console.error("CREATE AUTHOR ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Could not create author."
      );
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setCoverImage(file);

    const previewUrl = URL.createObjectURL(file);

    setCoverPreview(previewUrl);
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview("");

    if (authorInputRef.current) {
      authorInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const title = form.title.trim();

    if (!title) {
      setError("Book title is required.");
      return;
    }

    if (!form.price) {
      setError("Book price is required.");
      return;
    }

    if (form.stock === "") {
      setError("Book stock is required.");
      return;
    }

    if (!form.isbn.trim()) {
      setError("ISBN is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (selectedAuthors.length === 0) {
      setError("Please add at least one author.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("isbn", form.isbn.trim());
      formData.append("categoryId", form.categoryId);

      formData.append(
        "authorIds",
        JSON.stringify(
          selectedAuthors.map((author) => author.id)
        )
      );

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await createAdminBook(formData);

      navigate("/admin/books");
    } catch (error) {
      console.error("CREATE BOOK ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create book."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/books")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-pageora-muted transition hover:text-pageora-green"
          >
            <ArrowLeft size={17} />
            Back to books
          </button>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-pageora-orange">
            Catalog
          </p>

          <h1 className="mt-2 text-4xl text-pageora-green">
            Add book
          </h1>

          <p className="mt-2 text-sm leading-6 text-pageora-muted">
            Add a new physical book to your Pageora catalog.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loadingData ? (
        <div className="mt-8 rounded-2xl border border-pageora-border bg-pageora-surface p-10 text-center">
          <p className="text-sm text-pageora-muted">
            Loading book form...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main Form */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="rounded-2xl border border-pageora-border bg-pageora-surface p-6">
                <div className="mb-6">
                  <h2 className="text-xl text-pageora-green">
                    Book information
                  </h2>

                  <p className="mt-1 text-sm text-pageora-muted">
                    Basic information about the book.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-pageora-text"
                    >
                      Book title
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Atomic Habits"
                      className="w-full rounded-lg border border-pageora-border bg-pageora-background px-4 py-3 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                    />
                  </div>

                  {/* Authors */}
                  <div className="relative">
                    <label className="mb-2 block text-sm font-medium text-pageora-text">
                      Authors
                    </label>

                    {/* Selected Authors */}
                    {selectedAuthors.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {selectedAuthors.map((author) => (
                          <div
                            key={author.id}
                            className="inline-flex items-center gap-2 rounded-lg border border-pageora-border bg-pageora-background px-3 py-2"
                          >
                            <span className="text-sm text-pageora-text">
                              {author.name}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveAuthor(author.id)
                              }
                              className="text-pageora-muted transition hover:text-red-600"
                              aria-label={`Remove ${author.name}`}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Author Search */}
                    <div className="relative">
                      <Search
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-pageora-muted"
                      />

                      <input
                        type="text"
                        value={authorSearch}
                        onChange={(event) => {
                          setAuthorSearch(event.target.value);
                          setShowAuthorDropdown(true);
                        }}
                        onFocus={() =>
                          setShowAuthorDropdown(true)
                        }
                        placeholder="Search or type an author name..."
                        className="w-full rounded-lg border border-pageora-border bg-pageora-background py-3 pl-11 pr-10 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                      />

                      <ChevronDown
                        size={17}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-pageora-muted transition ${
                          showAuthorDropdown
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </div>

                    {/* Author Dropdown */}
                    {showAuthorDropdown && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-pageora-border bg-pageora-surface shadow-lg">
                        <div className="max-h-64 overflow-y-auto">
                          {filteredAuthors.length > 0 ? (
                            filteredAuthors.map((author) => (
                              <button
                                key={author.id}
                                type="button"
                                onClick={() =>
                                  handleSelectAuthor(author)
                                }
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-pageora-background"
                              >
                                <span className="text-pageora-text">
                                  {author.name}
                                </span>

                                <Check
                                  size={16}
                                  className="text-pageora-green"
                                />
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-4">
                              {authorSearch.trim() &&
                              !exactAuthorExists ? (
                                <button
                                  type="button"
                                  onClick={
                                    handleCreateNewAuthor
                                  }
                                  className="flex w-full items-center gap-3 text-left"
                                >
                                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pageora-green text-white">
                                    <Plus size={16} />
                                  </span>

                                  <span>
                                    <span className="block text-sm font-medium text-pageora-text">
                                      Create new author
                                    </span>

                                    <span className="block text-xs text-pageora-muted">
                                      “{normalizeAuthorName(
                                        authorSearch
                                      )}”
                                    </span>
                                  </span>
                                </button>
                              ) : (
                                <p className="text-sm text-pageora-muted">
                                  No authors found.
                                </p>
                              )}
                            </div>
                          )}

                          {authorSearch.trim() &&
                            !exactAuthorExists &&
                            filteredAuthors.length > 0 && (
                              <div className="border-t border-pageora-border px-4 py-3">
                                <button
                                  type="button"
                                  onClick={
                                    handleCreateNewAuthor
                                  }
                                  className="flex w-full items-center gap-3 text-left"
                                >
                                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pageora-green text-white">
                                    <Plus size={16} />
                                  </span>

                                  <span>
                                    <span className="block text-sm font-medium text-pageora-text">
                                      Create new author
                                    </span>

                                    <span className="block text-xs text-pageora-muted">
                                      “{normalizeAuthorName(
                                        authorSearch
                                      )}”
                                    </span>
                                  </span>
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    <p className="mt-2 text-xs text-pageora-muted">
                      Search existing authors or create a new
                      one. You can add multiple authors.
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="categoryId"
                      className="mb-2 block text-sm font-medium text-pageora-text"
                    >
                      Category
                    </label>

                    <select
                      id="categoryId"
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-pageora-border bg-pageora-background px-4 py-3 text-sm text-pageora-text outline-none transition focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
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

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-pageora-text"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Write a short description of the book..."
                      className="w-full resize-y rounded-lg border border-pageora-border bg-pageora-background px-4 py-3 text-sm leading-6 text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="rounded-2xl border border-pageora-border bg-pageora-surface p-6">
                <div className="mb-6">
                  <h2 className="text-xl text-pageora-green">
                    Inventory & pricing
                  </h2>

                  <p className="mt-1 text-sm text-pageora-muted">
                    Set the price and available stock.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Price */}
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-medium text-pageora-text"
                    >
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-pageora-muted">
                        ₦
                      </span>

                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="8000"
                        className="w-full rounded-lg border border-pageora-border bg-pageora-background py-3 pl-9 pr-4 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label
                      htmlFor="stock"
                      className="mb-2 block text-sm font-medium text-pageora-text"
                    >
                      Stock
                    </label>

                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="15"
                      className="w-full rounded-lg border border-pageora-border bg-pageora-background px-4 py-3 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                    />
                  </div>

                  {/* ISBN */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="isbn"
                      className="mb-2 block text-sm font-medium text-pageora-text"
                    >
                      ISBN
                    </label>

                    <input
                      id="isbn"
                      name="isbn"
                      type="text"
                      value={form.isbn}
                      onChange={handleChange}
                      placeholder="9780735211292"
                      className="w-full rounded-lg border border-pageora-border bg-pageora-background px-4 py-3 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cover */}
              <div className="rounded-2xl border border-pageora-border bg-pageora-surface p-6">
                <div className="mb-5">
                  <h2 className="text-xl text-pageora-green">
                    Book cover
                  </h2>

                  <p className="mt-1 text-sm text-pageora-muted">
                    Upload the cover image for this book.
                  </p>
                </div>

                <label
                  htmlFor="coverImage"
                  className="block cursor-pointer"
                >
                  {coverPreview ? (
                    <div className="relative overflow-hidden rounded-xl border border-pageora-border bg-pageora-background">
                      <img
                        src={coverPreview}
                        alt="Book cover preview"
                        className="h-80 w-full object-contain"
                      />

                      <div className="absolute inset-x-0 bottom-0 flex justify-center bg-black/50 p-3">
                        <span className="text-xs font-medium text-white">
                          Change cover
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-pageora-border bg-pageora-background px-6 text-center transition hover:border-pageora-green">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pageora-surface text-pageora-green">
                        <ImagePlus size={22} />
                      </div>

                      <p className="mt-4 text-sm font-medium text-pageora-text">
                        Upload cover image
                      </p>

                      <p className="mt-1 text-xs leading-5 text-pageora-muted">
                        PNG, JPG or WEBP
                      </p>
                    </div>
                  )}

                  <input
                    id="coverImage"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>

                {coverPreview && (
                  <button
                    type="button"
                    onClick={removeCover}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-600 transition hover:opacity-70"
                  >
                    <Trash2 size={15} />
                    Remove cover
                  </button>
                )}
              </div>

              {/* Submit */}
              <div className="rounded-2xl border border-pageora-border bg-pageora-surface p-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-pageora-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e3f31] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    "Adding book..."
                  ) : (
                    <>
                      <Plus size={18} />
                      Add book
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/books")}
                  disabled={submitting}
                  className="mt-3 w-full rounded-lg border border-pageora-border px-5 py-3 text-sm font-medium text-pageora-text transition hover:bg-pageora-background disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default AdminAddBook;