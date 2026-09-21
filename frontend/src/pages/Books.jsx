import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getBooks } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import BookCard from "../components/BookCard";


const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Filter books by category and search
  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory === "all" ||
      book.category?.slug === selectedCategory;

    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      book.title?.toLowerCase().includes(query) ||
      book.authors?.some((author) =>
        author.name?.toLowerCase().includes(query)
      );

    return matchesCategory && matchesSearch;
  });

  // Sort filtered books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "price-low") {
      return Number(a.price) - Number(b.price);
    }

    if (sortBy === "price-high") {
      return Number(b.price) - Number(a.price);
    }

    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  return (
    <main className="bg-[#F7F3EC]  ">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <div className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E86A2A]">
            The Collection
          </p>

          <h1 className="font-serif text-5xl leading-tight text-[#124C3B] md:text-6xl">
            Find your next read.
          </h1>

          <p className="mt-4 max-w-xl text-[#6F756F]">
            Explore our collection of stories, ideas, and books worth
            spending time with.
          </p>

          {/* Search Result */}
          {searchQuery && (
            <p className="mt-4 text-sm text-[#6F756F]">
              Showing results for{" "}
              <span className="font-medium text-[#17211D]">
                "{searchQuery}"
              </span>
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-3xl border px-5 py-2 text-sm transition ${
              selectedCategory === "all"
                ? "border-[#124C3B] bg-[#124C3B] text-white"
                : "border-[#DED8CC] bg-[#FFFDF8] text-[#17211D] hover:border-[#124C3B]"
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.slug)}
              className={`rounded-3xl border px-5 py-2 text-sm transition ${
                selectedCategory === category.slug
                  ? "border-[#124C3B] bg-[#124C3B] text-white"
                  : "border-[#DED8CC] bg-[#FFFDF8] text-[#17211D] hover:border-[#124C3B]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results + Sorting */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#6F756F]">
            {sortedBooks.length}{" "}
            {sortedBooks.length === 1 ? "book" : "books"}
          </p>

          <div className="flex items-center gap-3">
            <label
              htmlFor="sort"
              className="text-sm text-[#6F756F]"
            >
              Sort by
            </label>

            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#DED8CC] bg-[#FFFDF8] px-4 py-2 text-sm text-[#17211D] outline-none focus:border-[#124C3B]"
            >
              <option value="newest">Newest</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="title">
                Title: A–Z
              </option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-sm text-[#6F756F]">
            Loading books...
          </p>
        )}

        {/* Books */}
        {!loading && sortedBooks.length > 0 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {sortedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedBooks.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="font-serif text-3xl text-[#124C3B]">
              No books found.
            </h2>

            <p className="mt-2 text-[#6F756F]">
              {searchQuery
                ? `We couldn't find any books matching "${searchQuery}".`
                : "There are no books in this category yet."}
            </p>
          </div>
        )}

      </div>
    </main>
  );
};

export default Books;