import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  getAdminAuthors,
  createAdminAuthor,
  updateAdminAuthor,
  deleteAdminAuthor,
} from "../../services/adminAuthorService";

const AdminAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  // Load authors
  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminAuthors();

      setAuthors(data.authors || []);
    } catch (error) {
      console.error("ADMIN AUTHORS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Could not load authors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  // Search
  const filteredAuthors = authors.filter((author) => {
    const searchTerm = search.toLowerCase();

    return (
      author.name.toLowerCase().includes(searchTerm) ||
      author.bio?.toLowerCase().includes(searchTerm)
    );
  });

  // Open add
  const handleOpenAdd = () => {
    setEditingAuthor(null);

    setFormData({
      name: "",
      bio: "",
    });

    setError("");
    setShowForm(true);
  };

  // Open edit
  const handleOpenEdit = (author) => {
    setEditingAuthor(author);

    setFormData({
      name: author.name,
      bio: author.bio || "",
    });

    setError("");
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingAuthor(null);

    setFormData({
      name: "",
      bio: "",
    });

    setError("");
  };

  // Form input
  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Author name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingAuthor) {
        const response = await updateAdminAuthor(
          editingAuthor.id,
          {
            name: formData.name.trim(),
            bio: formData.bio.trim(),
          }
        );

        setAuthors((prevAuthors) =>
          prevAuthors.map((author) =>
            author.id === editingAuthor.id
              ? response.author
              : author
          )
        );

        setSuccess("Author updated successfully.");
      } else {
        const response = await createAdminAuthor({
          name: formData.name.trim(),
          bio: formData.bio.trim(),
        });

        setAuthors((prevAuthors) => [
          response.author,
          ...prevAuthors,
        ]);

        setSuccess("Author created successfully.");
      }

      setShowForm(false);
      setEditingAuthor(null);

      setFormData({
        name: "",
        bio: "",
      });

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("AUTHOR SAVE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save author."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this author?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAdminAuthor(id);

      setAuthors((prevAuthors) =>
        prevAuthors.filter(
          (author) => author.id !== id
        )
      );

      setSuccess("Author deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("DELETE AUTHOR ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete author."
      );
    }
  };

  return (
    <>
      <section>
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-pageora-orange">
              Catalog
            </p>

            <h1 className="mt-2 text-4xl text-pageora-green">
              Authors
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-pageora-muted">
              Manage the authors behind the books in your
              Pageora store.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-pageora-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e3f31] hover:shadow-sm"
          >
            <Plus size={18} />
            Add author
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
              placeholder="Search authors..."
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
              Loading authors...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          filteredAuthors.length === 0 && (
            <div className="mt-8 rounded-2xl border border-pageora-border bg-pageora-surface p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-pageora-background text-pageora-green">
                <Plus size={22} />
              </div>

              <h2 className="mt-4 text-xl text-pageora-text">
                {search
                  ? "No authors found"
                  : "No authors yet"}
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-pageora-muted">
                {search
                  ? "Try a different search term."
                  : "Add your first author to start building your catalog."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-pageora-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e3f31]"
                >
                  <Plus size={17} />
                  Add author
                </button>
              )}
            </div>
          )}

        {/* Authors */}
        {!loading &&
          filteredAuthors.length > 0 && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-pageora-border bg-pageora-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="border-b border-pageora-border bg-pageora-background/50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                        Author
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                        Biography
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
                    {filteredAuthors.map((author) => (
                      <tr
                        key={author.id}
                        className="border-b border-pageora-border last:border-b-0 hover:bg-pageora-background/40"
                      >
                        {/* Author */}
                        <td className="px-5 py-5">
                          <div>
                            <p className="font-medium text-pageora-text">
                              {author.name}
                            </p>

                            <p className="mt-1 text-xs text-pageora-muted">
                              Author #{author.id}
                            </p>
                          </div>
                        </td>

                        {/* Bio */}
                        <td className="max-w-md px-5 py-5">
                          <p className="truncate text-sm text-pageora-muted">
                            {author.bio ||
                              "No biography added."}
                          </p>
                        </td>

                        {/* Books */}
                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-full bg-pageora-background px-3 py-1 text-sm font-medium text-pageora-text">
                            {author._count?.books || 0}{" "}
                            {author._count?.books === 1
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
                                handleOpenEdit(author)
                              }
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-pageora-green transition hover:opacity-70"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(author.id)
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
      </section>

      {/* ADD / EDIT AUTHOR MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl border border-pageora-border bg-pageora-surface shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-pageora-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pageora-orange">
                  Catalog
                </p>

                <h2 className="mt-1 text-2xl text-pageora-green">
                  {editingAuthor
                    ? "Edit author"
                    : "Add author"}
                </h2>

                <p className="mt-1 text-sm text-pageora-muted">
                  {editingAuthor
                    ? "Update this author's information."
                    : "Add a new author to your Pageora catalog."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                disabled={saving}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-pageora-muted transition hover:bg-pageora-background hover:text-pageora-text disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="authorName"
                  className="mb-2 block text-sm font-medium text-pageora-text"
                >
                  Author name
                </label>

                <input
                  id="authorName"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Chimamanda Ngozi Adichie"
                  autoFocus
                  required
                  className="w-full rounded-lg border border-pageora-border bg-white px-4 py-3 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                />
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="authorBio"
                  className="mb-2 block text-sm font-medium text-pageora-text"
                >
                  Biography
                </label>

                <textarea
                  id="authorBio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short author biography..."
                  rows={5}
                  className="w-full resize-none rounded-lg border border-pageora-border bg-white px-4 py-3 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
                />

                <p className="mt-2 text-xs text-pageora-muted">
                  Keep the biography short and useful for
                  customers.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-pageora-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={saving}
                  className="rounded-lg px-5 py-3 text-sm font-medium text-pageora-muted transition hover:bg-pageora-background hover:text-pageora-text disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-pageora-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e3f31] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingAuthor
                    ? "Save changes"
                    : "Create author"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAuthors;