import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

import { getCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { getShippingLocations } from "../services/shippingService";
import useCartStore from "../store/cartStore";

const Checkout = () => {
  const navigate = useNavigate();
  const { fetchCart } = useCartStore();

  const [cart, setCart] = useState(null);
  const [shippingLocations, setShippingLocations] = useState([]);
  const [shippingLocationId, setShippingLocationId] = useState("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "Nigeria",
  });

  // Load cart and shipping locations
  useEffect(() => {
    const loadCheckout = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Get cart
        const cartData = await getCart();

        if (!cartData?.items?.length) {
          navigate("/cart");
          return;
        }

        // Set cart immediately because it loaded successfully
        setCart(cartData);

        // Get available shipping locations
        const locations = await getShippingLocations();

        setShippingLocations(
          Array.isArray(locations) ? locations : []
        );
      } catch (error) {
        console.error("CHECKOUT LOAD ERROR:", error);

        setError(
          error.response?.data?.message ||
            "We couldn't load checkout information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, [navigate]);

  // Handle form inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    // Clear an existing error while the user edits the form
    if (error) {
      setError("");
    }
  };

  // Handle shipping location
  const handleShippingLocationChange = (event) => {
    setShippingLocationId(event.target.value);

    if (error) {
      setError("");
    }
  };

  // Submit order
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Make sure a delivery location is selected
    if (!shippingLocationId) {
      setError("Please select your delivery location.");
      return;
    }

    // Make sure the selected location actually exists
    const selectedLocation = shippingLocations.find(
      (location) =>
        location.id === Number(shippingLocationId)
    );

    if (!selectedLocation) {
      setError(
        "The selected delivery location is no longer available."
      );
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");
        const data = await createOrder({
        ...formData,
        shippingLocationId: Number(shippingLocationId),
        });

        navigate(`/payment/${data.order.id}`);

      if (!data?.order?.id) {
        throw new Error("Order was created but no order ID was returned.");
      }

      // Refresh cart count/store after order creation
      await fetchCart();

      // Continue to order details
      navigate(`/orders/${data.order.id}`);
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "We couldn't place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  // Cart failed to load
  if (error && !cart) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <Link
            to="/cart"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#124C3B]"
          >
            <ArrowLeft size={17} />
            Back to cart
          </Link>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.book.price) * Number(item.quantity),
    0
  );

  // Find selected shipping location
  const selectedShippingLocation = shippingLocations.find(
    (location) =>
      location.id === Number(shippingLocationId)
  );

  // Calculate shipping fee
  const shippingFee = selectedShippingLocation
    ? Number(selectedShippingLocation.fee)
    : 0;

  // Calculate final total
  const total = subtotal + shippingFee;

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm text-[#6F756F] transition hover:text-[#124C3B]"
          >
            <ArrowLeft size={17} />
            Back to cart
          </Link>

          <h1 className="text-4xl text-[#124C3B] sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6F756F] sm:text-base">
            Enter your delivery details and review your
            order before placing it.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            {/* Shipping information */}
            <section className="border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7">
              <div className="mb-7">
                <h2 className="text-2xl text-[#124C3B]">
                  Shipping information
                </h2>

                <p className="mt-2 text-sm text-[#6F756F]">
                  Where should we deliver your books?
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="shippingName"
                    className="mb-2 block text-sm font-medium text-[#17211D]"
                  >
                    Full name
                  </label>

                  <input
                    id="shippingName"
                    name="shippingName"
                    type="text"
                    value={formData.shippingName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full border border-[#DED8CC] bg-[#F7F3EC] px-4 py-3 text-sm text-[#17211D] outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="shippingPhone"
                    className="mb-2 block text-sm font-medium text-[#17211D]"
                  >
                    Phone number
                  </label>

                  <input
                    id="shippingPhone"
                    name="shippingPhone"
                    type="tel"
                    value={formData.shippingPhone}
                    onChange={handleChange}
                    required
                    placeholder="080..."
                    className="w-full border border-[#DED8CC] bg-[#F7F3EC] px-4 py-3 text-sm text-[#17211D] outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="shippingCountry"
                    className="mb-2 block text-sm font-medium text-[#17211D]"
                  >
                    Country
                  </label>

                  <input
                    id="shippingCountry"
                    name="shippingCountry"
                    type="text"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#DED8CC] bg-[#F7F3EC] px-4 py-3 text-sm text-[#17211D] outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                {/* Delivery location */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="shippingLocationId"
                    className="mb-2 block text-sm font-medium text-[#17211D]"
                  >
                    Delivery location
                  </label>

                  <select
                    id="shippingLocationId"
                    name="shippingLocationId"
                    value={shippingLocationId}
                    onChange={handleShippingLocationChange}
                    required
                    disabled={shippingLocations.length === 0}
                    className="w-full border border-[#DED8CC] bg-[#F7F3EC] px-4 py-3 text-sm text-[#17211D] outline-none transition focus:border-[#124C3B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {shippingLocations.length > 0
                        ? "Select your delivery location"
                        : "No delivery locations available"}
                    </option>

                    {shippingLocations.map((location) => (
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {location.name} — ₦
                        {Number(
                          location.fee
                        ).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="shippingAddress"
                    className="mb-2 block text-sm font-medium text-[#17211D]"
                  >
                    Delivery address
                  </label>

                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="House number, street, area..."
                    className="w-full resize-none border border-[#DED8CC] bg-[#F7F3EC] px-4 py-3 text-sm text-[#17211D] outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="shippingCity"
                    className="mb-2 block text-sm font-medium text-[#17211D]"
                  >
                    City
                  </label>

                  <input
                    id="shippingCity"
                    name="shippingCity"
                    type="text"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    required
                    placeholder="Abeokuta"
                    className="w-full border border-[#DED8CC] bg-[#F7F3EC] px-4 py-3 text-sm text-[#17211D] outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                {/* State */}
                <div>
                  <label
                    htmlFor="shippingState"
                    className="mb-2 block text-sm font-medium text-[#17211D]"
                  >
                    State
                  </label>

                  <input
                    id="shippingState"
                    name="shippingState"
                    type="text"
                    value={formData.shippingState}
                    onChange={handleChange}
                    required
                    placeholder="Ogun"
                    className="w-full border border-[#DED8CC] bg-[#F7F3EC] px-4 py-3 text-sm text-[#17211D] outline-none transition focus:border-[#124C3B]"
                  />
                </div>
              </div>
            </section>

            {/* Order summary */}
            <aside className="h-fit border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7 lg:sticky lg:top-6">
              <h2 className="text-2xl text-[#124C3B]">
                Your order
              </h2>

              <div className="mt-6 divide-y divide-[#DED8CC]">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 first:pt-0"
                  >
                    <div className="h-20 w-14 shrink-0 overflow-hidden bg-[#F0F1F2]">
                      {item.book.coverImage ? (
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#6F756F]">
                          No cover
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-[#17211D]">
                        {item.book.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#6F756F]">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#17211D]">
                        ₦
                        {(
                          Number(item.book.price) *
                          Number(item.quantity)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-5 border-t border-[#DED8CC] pt-5">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F756F]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#17211D]">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Shipping */}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[#6F756F]">
                    Shipping
                  </span>

                  <span className="font-medium text-[#17211D]">
                    {selectedShippingLocation
                      ? `₦${shippingFee.toLocaleString()}`
                      : "Select location"}
                  </span>
                </div>

                {/* Total */}
                <div className="mt-5 flex items-center justify-between border-t border-[#DED8CC] pt-5">
                  <span className="font-medium text-[#17211D]">
                    Total
                  </span>

                  <span className="text-xl font-semibold text-[#124C3B]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="mt-5 text-sm leading-5 text-red-600">
                  {error}
                </p>
              )}

              {/* Place order */}
              <button
                type="submit"
                disabled={
                  placingOrder ||
                  !shippingLocationId ||
                  shippingLocations.length === 0
                }
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-[#124C3B] px-6 text-sm font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:bg-[#9AA19C]"
              >
                <Lock size={17} />

                {placingOrder
                  ? "Placing order..."
                  : "Place order"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[#6F756F]">
                Your shipping fee is calculated from your
                selected delivery location.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;