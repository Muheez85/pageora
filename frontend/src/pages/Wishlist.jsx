import { useEffect, useState } from "react";
import { ArrowRight, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import { addToCart } from "../services/cartService";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    const loadWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
       navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getWishlist();

        setWishlist(data);
      } catch (error) {
        console.error("GET WISHLIST ERROR:", error);

        setError(
          error.response?.data?.message ||
            "We couldn't load your wishlist."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleRemove = async (bookId) => {
    try {
      setActionLoading(`remove-${bookId}`);

      await removeFromWishlist(bookId);

      setWishlist((current) =>
        current.filter((item) => item.bookId !== bookId)
      );
    } catch (error) {
      console.error("REMOVE WISHLIST ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to remove this book."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToCart = async (bookId) => {
    try {
      setActionLoading(`cart-${bookId}`);

      await addToCart(bookId, 1);

      setError("");
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to add this book to your cart."
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading your wishlist...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">
        <div className="border-b border-[#DED8CC] pb-8">
          <div className="flex items-center gap-3">
            <Heart
              size={25}
              strokeWidth={1.7}
              className="text-[#E86A2A]"
            />

            <h1 className="text-4xl text-[#124C3B] sm:text-5xl">
              My Wishlist
            </h1>
          </div>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6F756F] sm:text-base">
            Keep the books you're interested in close until
            you're ready to make them yours.
          </p>
        </div>

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="py-20 text-center">
            <Heart
              size={42}
              strokeWidth={1.4}
              className="mx-auto text-[#124C3B]"
            />

            <h2 className="mt-5 text-3xl text-[#124C3B]">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6F756F]">
              Found a book you love? Tap the heart and save it
              here for later.
            </p>

            <Link
              to="/books"
              className="mt-7 inline-flex items-center gap-2 bg-[#124C3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30]"
            >
              Browse books
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden border border-[#DED8CC] bg-[#FFFDF8]"
              >
                <Link to={`/books/${item.book.slug}`}>
                  <div className="aspect-3/4 overflow-hidden bg-[#F0F1F2]">
                    {item.book.coverImage ? (
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#6F756F]">
                        Cover unavailable
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <Link to={`/books/${item.book.slug}`}>
                    <h2 className="text-2xl leading-tight text-[#124C3B] transition hover:text-[#E86A2A]">
                      {item.book.title}
                    </h2>
                  </Link>

                  <p className="mt-2 truncate text-sm text-[#6F756F]">
                    {item.book.authors
                      ?.map((author) => author.name)
                      .join(", ") || "Unknown author"}
                  </p>

                  <p className="mt-4 text-lg font-semibold text-[#17211D]">
                    ₦{Number(item.book.price).toLocaleString()}
                  </p>

                  <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(item.book.id)
                      }
                      disabled={
                        actionLoading ===
                        `cart-${item.book.id}`
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 bg-[#124C3B] px-4 text-sm font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingCart size={17} />

                      {actionLoading ===
                      `cart-${item.book.id}`
                        ? "Adding..."
                        : "Add to cart"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(item.book.id)
                      }
                      disabled={
                        actionLoading ===
                        `remove-${item.book.id}`
                      }
                      aria-label={`Remove ${item.book.title} from wishlist`}
                      className="flex h-11 w-11 items-center justify-center border border-[#DED8CC] text-[#6F756F] transition hover:border-[#E86A2A] hover:text-[#E86A2A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;