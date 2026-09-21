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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  // ---------------------------------------
  // LOAD AUTHORS
  // ---------------------------------------

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

  // ---------------------------------------
  // SEARCH
  // ---------------------------------------

  const filteredAuthors = authors.filter((author) => {
    const searchTerm = search.toLowerCase();

    return (
      author.name.toLowerCase().includes(searchTerm) ||
      author.bio?.toLowerCase().includes(searchTerm)
    );
  });

  // ---------------------------------------
  // OPEN ADD FORM
  // ---------------------------------------

  const handleOpenAdd = () => {
    setEditingAuthor(null);

    setFormData({
      name: "",
      bio: "",
    });

    setError("");
    setSuccess("");

    setShowForm(true);
  };

  // ---------------------------------------
  // OPEN EDIT FORM
  // ---------------------------------------

  const handleOpenEdit = (author) => {
    setEditingAuthor(author);

    setFormData({
      name: author.name,
      bio: author.bio || "",
    });

    setError("");
    setSuccess("");

    setShowForm(true);
  };

  // ---------------------------------------
  // CLOSE FORM
  // ---------------------------------------

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAuthor(null);

    setFormData({
      name: "",
      bio: "",
    });

    setError("");
  };

  // ---------------------------------------
  // FORM CHANGE
  // ---------------------------------------

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // ---------------------------------------
  // SUBMIT
  // ---------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Author name is required.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      if (editingAuthor) {
        const response = await updateAdminAuthor(
          editingAuthor.id,
          formData
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
        const response = await createAdminAuthor(
          formData
        );

        setAuthors((prevAuthors) => [
          response.author,
          ...prevAuthors,
        ]);

        setSuccess("Author created successfully.");
      }

      handleCloseForm();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("AUTHOR SAVE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save author."
      );
    }
  };

  // ---------------------------------------
  // DELETE
  // ---------------------------------------

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
    <section>
      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--pageora-orange)]">
            Catalog
          </p>

          <h1 className="mt-1 text-4xl text-[var(--pageora-green)]">
            Authors
          </h1>

          <p className="mt-2 text-sm text-[var(--pageora-muted)]">
            Manage the authors behind the books in your store.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-[var(--pageora-green)] px-5 py-3 text-sm font-medium text-white"
        >
          <Plus size={18} />
          Add author
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
            placeholder="Search authors..."
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
            Loading authors...
          </p>
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        filteredAuthors.length === 0 && (
          <div className="mt-8 border border-[var(--pageora-border)] bg-[var(--pageora-surface)] p-10 text-center">
            <p className="text-sm text-[var(--pageora-muted)]">
              {search
                ? "No authors match your search."
                : "No authors found."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-4 text-sm font-medium text-[var(--pageora-green)] hover:underline"
              >
                Add your first author
              </button>
            )}
          </div>
        )}

      {/* AUTHORS TABLE */}

      {!loading &&
        filteredAuthors.length > 0 && (
          <div className="mt-8 overflow-x-auto border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-[var(--pageora-border)]">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                    Author
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                    Bio
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
                {filteredAuthors.map((author) => (
                  <tr
                    key={author.id}
                    className="border-b border-[var(--pageora-border)] last:border-b-0"
                  >
                    {/* AUTHOR */}

                    <td className="px-5 py-5">
                      <div>
                        <p className="font-medium text-[var(--pageora-text)]">
                          {author.name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--pageora-muted)]">
                          Author #{author.id}
                        </p>
                      </div>
                    </td>

                    {/* BIO */}

                    <td className="max-w-sm px-5 py-5">
                      <p className="truncate text-sm text-[var(--pageora-muted)]">
                        {author.bio || "No bio added."}
                      </p>
                    </td>

                    {/* BOOK COUNT */}

                    <td className="px-5 py-5">
                      <span className="text-sm font-medium text-[var(--pageora-text)]">
                        {author._count?.books || 0}{" "}
                        {author._count?.books === 1
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
                            handleOpenEdit(author)
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--pageora-green)] hover:underline"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(author.id)
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
                  {editingAuthor
                    ? "Edit author"
                    : "New author"}
                </p>

                <h2 className="mt-1 text-2xl text-[var(--pageora-green)]">
                  {editingAuthor
                    ? "Update author"
                    : "Add author"}
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
              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--pageora-text)]">
                  Author name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Chimamanda Ngozi Adichie"
                  required
                  className="w-full border border-[var(--pageora-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--pageora-green)]"
                />
              </div>

              {/* BIO */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--pageora-text)]">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short author biography..."
                  rows={5}
                  className="w-full resize-none border border-[var(--pageora-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--pageora-green)]"
                />

                <p className="mt-2 text-xs text-[var(--pageora-muted)]">
                  A short description about the author.
                </p>
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
                  {editingAuthor
                    ? "Save changes"
                    : "Create author"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminAuthors;