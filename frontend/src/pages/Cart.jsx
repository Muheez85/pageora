    import { useEffect, useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import {
      ArrowLeft,
      Minus,
      Plus,
      Trash2,
    } from "lucide-react";

    import {
      getCart,
      updateCartItem,
      removeCartItem,
    } from "../services/cartService";

    import useCartStore from "../store/cartStore";

    const Cart = () => {
      const navigate = useNavigate();

      const { fetchCart } = useCartStore();

      const [cart, setCart] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
      const [updatingItem, setUpdatingItem] = useState(null);
      const [removingItem, setRemovingItem] = useState(null);

      // Fetch cart
      useEffect(() => {
        const fetchUserCart = async () => {
          const token = localStorage.getItem("token");

          if (!token) {
            navigate("/login");
            return;
          }

          try {
            setLoading(true);
            setError("");

            const data = await getCart();

            setCart(data);
          } catch (error) {
            console.error("FETCH CART ERROR:", error);

            setError(
              error.response?.data?.message ||
                "We couldn't load your cart."
            );
          } finally {
            setLoading(false);
          }
        };

        fetchUserCart();
      }, [navigate]);

      // Update quantity
      const handleQuantityChange = async (
        itemId,
        newQuantity
      ) => {
        if (newQuantity < 1) return;

        try {
          setUpdatingItem(itemId);

          await updateCartItem(
            itemId,
            newQuantity
          );

          const latestCart = await getCart();

          setCart(latestCart);

          // Update global cart count
          await fetchCart();
        } catch (error) {
          console.error("UPDATE CART ERROR:", error);

          alert(
            error.response?.data?.message ||
              "Unable to update cart."
          );
        } finally {
          setUpdatingItem(null);
        }
      };

      // Remove item
      const handleRemoveItem = async (itemId) => {
        try {
          setRemovingItem(itemId);

          await removeCartItem(itemId);

          const latestCart = await getCart();

          setCart(latestCart);

          // Update global cart count
          await fetchCart();
        } catch (error) {
          console.error(
            "REMOVE CART ITEM ERROR:",
            error
          );

          alert(
            error.response?.data?.message ||
              "Unable to remove item from cart."
          );
        } finally {
          setRemovingItem(null);
        }
      };

      // Loading
      if (loading) {
        return (
          <main className="min-h-[60vh] bg-[#F7F3EC] py-20">
            <div className="container mx-auto px-6">
              <p className="text-sm text-[#6F756F]">
                Loading your cart...
              </p>
            </div>
          </main>
        );
      }

      // Error
      if (error) {
        return (
          <main className="min-h-[60vh] bg-[#F7F3EC] py-20">
            <div className="container mx-auto px-6">

              <Link
                to="/books"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#124C3B] transition hover:text-[#E86A2A]"
              >
                <ArrowLeft size={17} />
                Continue shopping
              </Link>

              <div className="py-20 text-center">
                <h1 className="font-serif text-4xl text-[#124C3B]">
                  Something went wrong.
                </h1>

                <p className="mt-3 text-[#6F756F]">
                  {error}
                </p>
              </div>

            </div>
          </main>
        );
      }

      const items = cart?.items || [];

      // Calculate subtotal
      const subtotal = items.reduce(
        (total, item) =>
          total +
          Number(item.book.price) *
            item.quantity,
        0
      );

  return (
    <main className="min-h-[60vh] bg-[#F7F3EC] py-12 md:py-16">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="mb-10">

          <Link
            to="/books"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6F756F] transition hover:text-[#124C3B] rounded-3xl"
          >
            <ArrowLeft size={17} />
            Continue shopping
          </Link>

          <h1 className="font-serif text-5xl text-[#124C3B] md:text-6xl">
            Your cart
          </h1>

          <p className="mt-3 text-[#6F756F]">
            {items.length === 0
              ? "Your cart is currently empty."
              : `${items.length} ${
                  items.length === 1
                    ? "item"
                    : "items"
                } in your cart.`}
          </p>

        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="border border-[#DED8CC] bg-[#FFFDF8] px-6 py-16 text-center">

            <h2 className="font-serif text-3xl text-[#124C3B]">
              Nothing here yet.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6F756F]">
              Explore our collection and find something
              worth bringing home.
            </p>

            <Link
              to="/books"
              className="mt-7 inline-flex bg-[#124C3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30] rounded-3xl"
            >
              Browse books
            </Link>

          </div>
        ) : (

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

            {/* Cart Items */}
            <section className="border border-[#DED8CC] bg-[#FFFDF8]">

              {items.map((item) => {

                const itemTotal =
                  Number(item.book.price) *
                  item.quantity;

                const isUpdating =
                  updatingItem === item.id;

                const isRemoving =
                  removingItem === item.id;

                return (
                  <article
                    key={item.id}
                    className="flex gap-4 border-b border-[#DED8CC] p-4 last:border-b-0 sm:gap-5 sm:p-6"
                  >

                    {/* Cover */}
                    <div className="h-32 w-24 shrink-0 overflow-hidden bg-[#F0F1F2] sm:h-40 sm:w-28">

                      {item.book.coverImage ? (
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-xs text-[#6F756F]">
                          Cover unavailable
                        </div>
                      )}

                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">

                      <Link
                        to={`/books/${item.book.slug}`}
                      >
                        <h2 className="font-serif text-xl leading-tight text-[#124C3B] transition hover:text-[#E86A2A] sm:text-2xl">
                          {item.book.title}
                        </h2>
                      </Link>

                      <p className="mt-2 truncate text-sm text-[#6F756F]">
                        {item.book.authors
                          ?.map(
                            (author) =>
                              author.name
                          )
                          .join(", ")}
                      </p>

                      <p className="mt-3 text-base font-semibold text-[#17211D]">
                        ₦
                        {Number(
                          item.book.price
                        ).toLocaleString()}
                      </p>

                      {/* Controls */}
                      <div className="mt-4 flex flex-wrap items-center gap-4">

                        {/* Quantity */}
                        <div className="flex h-10 items-center border border-[#DED8CC]">

                          {/* Minus */}
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            disabled={
                              item.quantity <= 1 ||
                              isUpdating ||
                              isRemoving
                            }
                            aria-label="Decrease quantity"
                            className="flex h-full w-10 items-center justify-center text-[#17211D] transition hover:text-[#E86A2A] disabled:cursor-not-allowed disabled:opacity-40 rounded-3xl"
                          >
                            <Minus size={15} />
                          </button>

                          {/* Quantity */}
                          <span className="w-10 text-center text-sm font-medium">
                            {isUpdating
                              ? "..."
                              : item.quantity}
                          </span>

                          {/* Plus */}
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >=
                                item.book.stock ||
                              isUpdating ||
                              isRemoving
                            }
                            aria-label="Increase quantity"
                            className="flex h-full w-10 items-center justify-center text-[#17211D] transition hover:text-[#E86A2A] disabled:cursor-not-allowed disabled:opacity-40 rounded-3xl"
                          >
                            <Plus size={15} />
                          </button>

                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              item.id
                            )
                          }
                          disabled={
                            isRemoving ||
                            isUpdating
                          }
                          className="inline-flex items-center gap-2 text-sm text-[#6F756F] transition hover:text-[#B42318] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={15} />

                          {isRemoving
                            ? "Removing..."
                            : "Remove"}
                        </button>

                      </div>

                      {/* Mobile item total */}
                      <p className="mt-4 text-sm font-semibold text-[#17211D] sm:hidden">
                        Total: ₦
                        {itemTotal.toLocaleString()}
                      </p>

                    </div>

                    {/* Desktop Item Total */}
                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="font-semibold text-[#17211D]">
                        ₦
                        {itemTotal.toLocaleString()}
                      </p>
                    </div>

                  </article>
                );
              })}

            </section>

            {/* Order Summary */}
            <aside className="h-fit border border-[#DED8CC] bg-[#FFFDF8] p-6 sm:p-7">

              <h2 className="font-serif text-2xl text-[#124C3B]">
                Order summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">

                {/* Subtotal */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6F756F]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#17211D]">
                    ₦
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#6F756F]">
                    Shipping
                  </span>

                  <span className="text-right font-medium text-[#17211D]">
                    Calculated at checkout
                  </span>
                </div>

                {/* Total */}
                <div className="border-t border-[#DED8CC] pt-4">
                  <div className="flex items-center justify-between gap-4">

                    <span className="font-medium text-[#17211D]">
                      Total
                    </span>

                    <span className="text-xl font-semibold text-[#124C3B]">
                      ₦
                      {subtotal.toLocaleString()}
                    </span>

                  </div>
                </div>

              </div>

              {/* Checkout */}
              <button
                type="button"
                onClick={() =>
                  navigate("/checkout")
                }
                className="mt-7 w-full bg-[#124C3B] py-3.5 text-sm font-medium rounded-3xl text-white transition hover:bg-[#0D3D30]"
              >
                Proceed to checkout
              </button>

            </aside>

          </div>
        )}

      </div>
    </main>
  );
};

export default Cart;