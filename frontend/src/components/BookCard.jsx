import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

const BookCard = ({ book }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
 const navigate = useNavigate();
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const wishlist = await getWishlist();

        const exists = wishlist.some(
          (item) => item.bookId === book.id
        );

        setIsWishlisted(exists);
      } catch (error) {
        console.error("CHECK WISHLIST ERROR:", error);
      }
    };

    checkWishlist();
  }, [book.id]);

  const handleWishlist = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    setWishlistLoading(true);

    if (isWishlisted) {
      await removeFromWishlist(book.id);

      setIsWishlisted(false);

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } else {
      await addToWishlist(book.id);

      setIsWishlisted(true);

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    }
  } catch (error) {
    console.error(
      "WISHLIST ERROR:",
      error
    );
  } finally {
    setWishlistLoading(false);
  }
};

  return (
    <article className="group  mb-5 min-w-0 overflow-hidden rounded-xl border border-[#17211D] bg-[#FFFDF8]">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#F0F1F2]">
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

        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={
            isWishlisted
              ? `Remove ${book.title} from wishlist`
              : `Add ${book.title} to wishlist`
          }
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF8] shadow-sm transition ${
            wishlistLoading
              ? "cursor-not-allowed opacity-50"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            className={
              isWishlisted
                ? "fill-[#E86A2A] text-[#E86A2A]"
                : "text-[#124C3B]"
            }
          />
        </button>
      </div>

      <div className="min-w-0 p-4 sm:p-5">
        <Link to={`/books/${book.slug}`}>
          <h3 className="font-serif text-xl leading-tight text-[#124C3B] transition hover:text-[#E86A2A] sm:text-2xl">
            {book.title}
          </h3>
        </Link>

        <p className="mt-2 truncate text-sm text-[#6F756F] sm:text-base">
          {book.authors?.map((author) => author.name).join(", ") ||
            "Unknown author"}
        </p>

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