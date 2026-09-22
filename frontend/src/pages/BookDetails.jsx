import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { addToCart } from "../services/cartService";
import useCartStore from "../store/cartStore";
import api from "../api/axios";

const BookDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { fetchCart } = useCartStore();

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/books/${slug}`);

        setBook(response.data.book);
      } catch (error) {
        console.error("Failed to fetch book:", error);
        setError("We couldn't find this book.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug]);

  const increaseQuantity = () => {
    if (book && quantity < book.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");

      await addToCart(book.id, quantity);

      await fetchCart();

      setCartMessage("Book added to your cart.");
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      setCartMessage(
        error.response?.data?.message ||
          "Unable to add this book to your cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#F7F3EC] py-20">
        <div className="container mx-auto px-6">
          <p className="text-sm text-[#6F756F]">
            Loading book...
          </p>
        </div>
      </main>
    );
  }

  if (error || !book) {
        return (
          <main className="bg-[#F7F3EC] py-20">
            <div className="container mx-auto px-6">
              <Link
                to="/books"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#124C3B] hover:text-[#E86A2A]"
              >
                <ArrowLeft size={17} />
                Back to books
              </Link>

              <div className="py-20 text-center">
                <h1 className="font-serif text-4xl text-[#124C3B]">
                  Book not found.
                </h1>

                <p className="mt-3 text-[#6F756F]">
                  The book you're looking for may have been removed or
                  doesn't exist.
                </p>
              </div>
            </div>
          </main>
        );
      }

      const authors = book.authors
        ?.map((author) => author.name)
        .join(", ");

      const isOutOfStock = book.stock <= 0;

  return (
    <main className="bg-[#F7F3EC] py-12 md:py-16">
      <div className="container mx-auto px-6">

        {/* Back */}
        <Link
          to="/books"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#6F756F] transition hover:text-[#124C3B]"
        >
          <ArrowLeft size={17} />
          Back to collection
        </Link>

        {/* Product */}
        <section className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">

          {/* Book Cover */}
          <div className="mx-auto w-full max-w-md">
            <div className="overflow-hidden border border-[#DED8CC] bg-[#FFFDF8]">
              <img
                src={book.coverImage}
                alt={book.title}
                width="700"
                height="1000"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="pt-2">

            {/* Category */}
            {book.category && (
              <Link
                to={`/books?category=${book.category.slug}`}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E86A2A] hover:underline"
              >
                {book.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-[#124C3B] md:text-6xl">
              {book.title}
            </h1>

            {/* Author */}
            <p className="mt-5 text-lg text-[#6F756F]">
              by{" "}
              <span className="font-medium text-[#17211D]">
                {authors || "Unknown author"}
              </span>
            </p>

            {/* Price */}
            <p className="mt-8 text-2xl font-semibold text-[#17211D]">
              ₦{Number(book.price).toLocaleString()}
            </p>

            {/* Description */}
            {book.description && (
              <div className="mt-8 border-t border-[#DED8CC] pt-8">
                <h2 className="font-serif text-2xl text-[#124C3B]">
                  About the book
                </h2>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#6F756F]">
                  {book.description}
                </p>
              </div>
            )}

            {/* Stock */}
            <div className="mt-8">
              {isOutOfStock ? (
                <p className="text-sm font-medium text-[#B42318]">
                  Currently out of stock
                </p>
              ) : (
                <p className="text-sm font-medium text-[#124C3B]">
                  {book.stock} copies available
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              {/* Quantity */}
              <div className="flex h-12 items-center border border-[#DED8CC] bg-[#FFFDF8]">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-full w-12 items-center justify-center text-[#17211D] transition hover:text-[#E86A2A] disabled:cursor-not-allowed disabled:opacity-40 rounded-3xl"
                >
                  <Minus size={17} />
                </button>

                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={isOutOfStock || quantity >= book.stock}
                  aria-label="Increase quantity"
                  className="flex h-full w-12 items-center justify-center text-[#17211D] transition hover:text-[#E86A2A] disabled:cursor-not-allowed disabled:opacity-40 rounded-3xl"
                >
                  <Plus size={17} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className="flex h-12 flex-1 items-center justify-center gap-2 bg-[#124C3B] px-6 text-sm font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:bg-[#9AA19C] py-6 rounded-3xl"
              >
                <ShoppingBag size={18} />

                {isOutOfStock
                  ? "Out of stock"
                  : addingToCart
                  ? "Adding..."
                  : "Add to cart"}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                aria-label="Add to wishlist"
                className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#124C3B] bg-[#FFFDF8] text-[#124C3B] transition hover:bg-[#124C3B] hover:text-white"
              >
                <Heart size={19} strokeWidth={1.8} />
              </button>
            </div>

            {/* Cart Message */}
            {cartMessage && (
              <p className="mt-3 text-sm text-[#124C3B]">
                {cartMessage}
              </p>
            )}

            {/* Book information */}
            <div className="mt-10 border-t border-[#DED8CC] pt-6">
              <div className="grid gap-4 text-sm sm:grid-cols-2">

                {book.isbn && (
                  <div>
                    <p className="text-[#6F756F]">ISBN</p>

                    <p className="mt-1 font-medium text-[#17211D]">
                      {book.isbn}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-[#6F756F]">Format</p>

                  <p className="mt-1 font-medium text-[#17211D]">
                    Physical book
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default BookDetails;