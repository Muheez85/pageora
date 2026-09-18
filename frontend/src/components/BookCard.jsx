import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const BookCard = ({ book }) => {
  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-[#17211D] bg-[#FFFDF8]">

      {/* Book Cover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0F1F2]">

        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            width="600"
            height="900"
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <span className="text-sm text-[#6F756F]">
              Cover unavailable
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Add ${book.title} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF8] text-[#124C3B] opacity-0 shadow-sm transition group-hover:opacity-100"
        >
          <Heart
            size={18}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* Book Information */}
      <div className="min-w-0 p-4 sm:p-5">

        {/* Title */}
        <Link to={`/books/${book.slug}`}>
          <h3 className="font-serif text-xl leading-tight text-[#124C3B] transition hover:text-[#E86A2A] sm:text-2xl">
            {book.title}
          </h3>
        </Link>

        {/* Author */}
        <p className="mt-2 truncate text-sm text-[#6F756F] sm:text-base">
          {book.authors?.map((author) => author.name).join(", ") ||
            "Unknown author"}
        </p>

        {/* Price + Category */}
        <div className="mt-4 flex min-w-0 flex-col gap-1 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">

          <p className="shrink-0 text-base font-semibold text-[#17211D] sm:text-lg">
            ₦{Number(book.price).toLocaleString()}
          </p>

          <span className="min-w-0 truncate text-xs text-[#6F756F] sm:text-sm">
            {book.category?.name}
          </span>

        </div>

      </div>
    </article>
  );
};

export default BookCard;