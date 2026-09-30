import { useEffect, useState } from "react";
import { getBooks } from "../../services/bookService";
import BookCard from "../../components/BookCard";

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchBooks();
  }, []);

  const editorsPicks = books
    .filter((book) => book.isEditorsPick === true)
    .slice(0, 4);

  return (
    <section className="bg-[#F7F3EC] py-20 md:py-24">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E86A2A]">
              Editor's Picks
            </p>

            <h2 className="font-serif text-4xl leading-tight text-[#124C3B] md:text-5xl">
              Books worth making room for.
            </h2>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="text-sm text-[#6F756F]">
            Loading books...
          </p>
        )}

        {/* Editor's Picks */}
        {!loading && editorsPicks.length > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 md:gap-x-7">
            {editorsPicks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && editorsPicks.length === 0 && (
          <p className="text-sm text-[#6F756F]">
            Our Editor's Picks will be available soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedBooks;