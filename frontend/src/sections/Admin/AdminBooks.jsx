import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
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
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--pageora-orange)]">
            Inventory
          </p>

          <h1 className="mt-1 text-4xl text-[var(--pageora-green)]">
            Books
          </h1>

          <p className="mt-2 text-sm text-[var(--pageora-muted)]">
            Manage your books and inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/books/add")}
          className="inline-flex items-center justify-center gap-2 bg-[var(--pageora-green)] px-5 py-3 text-sm font-medium text-white"
        >
          <Plus size={18} />
          Add book
        </button>
      </div>

      {/* Search */}
      <div className="mt-8">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pageora-muted)]"
          />

          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full border border-[var(--pageora-border)] bg-[var(--pageora-surface)] py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--pageora-green)]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {/* Loading */}
        {loading && (
          <p className="text-sm text-[var(--pageora-muted)]">
            Loading books...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredBooks.length === 0 && (
            <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)] p-10 text-center">
              <p className="text-sm text-[var(--pageora-muted)]">
                No books found.
              </p>
            </div>
          )}

        {/* Books */}
        {!loading &&
          !error &&
          filteredBooks.length > 0 && (
            <div className="overflow-x-auto border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
              <table className="w-full min-w-[800px] text-left">
                <thead className="border-b border-[var(--pageora-border)]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Book
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Price
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="border-b border-[var(--pageora-border)] last:border-b-0"
                    >
                      {/* Book */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-12 overflow-hidden bg-[var(--pageora-background)]">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-[var(--pageora-muted)]">
                                No cover
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-[var(--pageora-text)]">
                              {book.title}
                            </p>

                            {book.authors?.length > 0 && (
                              <p className="mt-1 text-xs text-[var(--pageora-muted)]">
                                {book.authors
                                  .map(
                                    (author) =>
                                      author.name
                                  )
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-5 text-sm text-[var(--pageora-muted)]">
                        {book.category?.name || "—"}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-5 text-sm font-medium text-[var(--pageora-text)]">
                        ₦
                        {Number(book.price).toLocaleString()}
                      </td>

                      {/* Stock */}
                                        <td className="px-5 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-[var(--pageora-text)]">
                          {book.stock} {book.stock === 1 ? "copy" : "copies"}
                        </span>

                        {book.stock === 0 && (
                          <span className="text-xs font-medium text-red-600">
                            Out of stock
                          </span>
                        )}

                        {book.stock > 0 && book.stock <= 5 && (
                          <span className="text-xs font-medium text-orange-600">
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
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/books/edit/${book.id}`
                              )
                            }
                            className="text-sm font-medium text-[var(--pageora-green)] hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(book.id)}
                            className="text-sm font-medium text-red-600 hover:underline"
                          >
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
      </div>
    </section>
  );
};

export default AdminBooks;