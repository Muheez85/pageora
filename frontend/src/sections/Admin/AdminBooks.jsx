import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAdminBooks,
  deleteAdminBook,
} from "../../services/adminBookService";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminBooks();

        setBooks(data.books || []);
      } catch (error) {
        console.error("ADMIN BOOKS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Could not load books."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteAdminBook(id);

      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );
    } catch (error) {
      console.error("DELETE BOOK ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete book."
      );
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-pageora-orange">
            Catalog
          </p>

          <h1 className="mt-2 text-4xl text-pageora-green">
            Books
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-pageora-muted">
            Manage the books and inventory in your Pageora store.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/books/new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-pageora-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e3f31] hover:shadow-sm"
        >
          <Plus size={18} />
          Add book
        </button>
      </div>

      {/* Search */}
      <div className="mt-8">
        <div className="relative max-w-lg">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-pageora-muted"
          />

          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-pageora-border bg-pageora-surface py-3 pl-11 pr-4 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
          />
        </div>
      </div>

      {/* Error */}
      {!loading && error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-8 rounded-2xl border border-pageora-border bg-pageora-surface p-10 text-center">
          <p className="text-sm text-pageora-muted">
            Loading books...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        filteredBooks.length === 0 && (
          <div className="mt-8 rounded-2xl border border-pageora-border bg-pageora-surface p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-pageora-background text-pageora-green">
              <Plus size={22} />
            </div>

            <h2 className="mt-4 text-xl text-pageora-text">
              {search ? "No books found" : "No books yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-pageora-muted">
              {search
                ? "Try a different search term."
                : "Add your first book to start building your catalog."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={() => navigate("/admin/books/new")}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-pageora-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e3f31]"
              >
                <Plus size={17} />
                Add book
              </button>
            )}
          </div>
        )}

      {/* Books Table */}
      {!loading &&
        !error &&
        filteredBooks.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-pageora-border bg-pageora-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-pageora-border bg-pageora-background/50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Book
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Price
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-pageora-muted">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="border-b border-pageora-border last:border-b-0 transition hover:bg-pageora-background/40"
                    >
                      {/* Book */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-pageora-background">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-pageora-muted">
                                No cover
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-pageora-text">
                              {book.title}
                            </p>

                            {book.authors?.length > 0 && (
                              <p className="mt-1 max-w-xs truncate text-xs text-pageora-muted">
                                {book.authors
                                  .map((author) => author.name)
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-5 text-sm text-pageora-muted">
                        {book.category?.name || "—"}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-5 text-sm font-medium text-pageora-text">
                        ₦{Number(book.price).toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-pageora-text">
                            {book.stock}{" "}
                            {book.stock === 1 ? "copy" : "copies"}
                          </span>

                          {book.stock === 0 && (
                            <span className="text-xs font-medium text-red-600">
                              Out of stock
                            </span>
                          )}

                          {book.stock > 0 && book.stock <= 5 && (
                            <span className="text-xs font-medium text-pageora-orange">
                              Low stock
                            </span>
                          )}

                          {book.stock > 5 && (
                            <span className="text-xs font-medium text-green-700">
                              In stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/books/edit/${book.id}`
                              )
                            }
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-pageora-green transition hover:opacity-70"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(book.id)}
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
  );
};

export default AdminBooks;