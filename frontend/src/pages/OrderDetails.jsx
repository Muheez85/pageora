import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import { getOrderById } from "../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load order
  |--------------------------------------------------------------------------
  */

  const loadOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!id || Number.isNaN(Number(id))) {
      setError("Invalid order.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getOrderById(id);

      if (!data) {
        throw new Error("Order not found.");
      }

      setOrder(data);
    } catch (error) {
      console.error("GET ORDER ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }

      setError(
        error.response?.data?.message ||
          "We couldn't load this order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getPaymentStatusClasses = (status) => {
    switch (status) {
      case "paid":
        return "bg-[#E8F3EE] text-[#124C3B]";

      case "unpaid":
        return "bg-[#FFF1E8] text-[#C4551E]";

      case "failed":
        return "bg-red-50 text-red-600";

      default:
        return "bg-[#F7F3EC] text-[#6F756F]";
    }
  };

  const getOrderStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#FFF1E8] text-[#C4551E]";

      case "paid":
        return "bg-[#E8F3EE] text-[#124C3B]";

      case "processing":
        return "bg-[#F7F3EC] text-[#17211D]";

      case "shipped":
        return "bg-[#F7F3EC] text-[#17211D]";

      case "delivered":
        return "bg-[#E8F3EE] text-[#124C3B]";

      default:
        return "bg-[#F7F3EC] text-[#6F756F]";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-10 sm:py-14">

          <div className="animate-pulse">

            <div className="h-4 w-32 bg-[#DED8CC]" />

            <div className="mx-auto mt-16 h-14 w-14 rounded-full bg-[#DED8CC]" />

            <div className="mx-auto mt-6 h-10 w-56 bg-[#DED8CC]" />

            <div className="mx-auto mt-4 h-4 w-full max-w-lg bg-[#DED8CC]" />

            <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1.3fr_0.7fr]">

              <div className="h-96 border border-[#DED8CC] bg-[#FFFDF8]" />

              <div className="h-96 border border-[#DED8CC] bg-[#FFFDF8]" />

            </div>

          </div>

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">

          <div className="mx-auto max-w-lg text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
              <ShoppingBag
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <h1 className="mt-6 text-3xl text-[#124C3B] sm:text-4xl">
              We couldn't find that order
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6F756F]">
              {error}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <button
                type="button"
                onClick={loadOrder}
                className="inline-flex items-center justify-center gap-2 border border-[#124C3B] px-5 py-3 text-sm font-medium text-[#124C3B] transition hover:bg-[#124C3B] hover:text-white"
              >
                <RefreshCw size={16} />
                Try again
              </button>

              <Link
                to="/orders"
                className="inline-flex items-center justify-center bg-[#124C3B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30]"
              >
                Back to orders
              </Link>

            </div>

          </div>

        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Order data
  |--------------------------------------------------------------------------
  */

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const paymentStatus =
    order.paymentStatus || "unpaid";

  const orderStatus =
    order.status || "pending";

  const isPaid =
    paymentStatus === "paid";

  const formattedDate = order.createdAt
    ? new Date(
        order.createdAt
      ).toLocaleDateString(
        "en-NG",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Date unavailable";

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">

        {/* =============================================================== */}
        {/* BACK */}
        {/* =============================================================== */}

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-[#6F756F] transition hover:text-[#124C3B]"
        >
          <ArrowLeft size={17} />
          Back to orders
        </Link>

        {/* =============================================================== */}
        {/* ORDER HEADER */}
        {/* =============================================================== */}

        <div className="mx-auto mt-12 max-w-2xl text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#124C3B] text-white">
            <CheckCircle
              size={28}
              strokeWidth={1.8}
            />
          </div>

          <h1 className="mt-6 text-4xl text-[#124C3B] sm:text-5xl">
            Order created
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#6F756F] sm:text-base">
            We've received your order. Your order
            will be processed once payment has been
            confirmed.
          </p>

          <p className="mt-4 text-sm font-medium text-[#17211D]">
            Order #{order.id}
          </p>

          <p className="mt-1 text-xs text-[#6F756F]">
            Placed on {formattedDate}
          </p>

        </div>

        {/* =============================================================== */}
        {/* MAIN CONTENT */}
        {/* =============================================================== */}

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1.3fr_0.7fr]">

          {/* ============================================================= */}
          {/* ITEMS */}
          {/* ============================================================= */}

          <section className="border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7">

            <div className="flex items-center justify-between gap-4">

              <h2 className="text-2xl text-[#124C3B]">
                Items in your order
              </h2>

              <span className="text-xs text-[#6F756F]">
                {items.length}{" "}
                {items.length === 1
                  ? "item"
                  : "items"}
              </span>

            </div>

            {items.length === 0 ? (
              <div className="mt-6 border border-dashed border-[#DED8CC] px-5 py-10 text-center">

                <p className="text-sm text-[#6F756F]">
                  No order items were found.
                </p>

              </div>
            ) : (
              <div className="mt-6 divide-y divide-[#DED8CC]">

                {items.map((item) => {

                  const price =
                    Number(item.price) || 0;

                  const quantity =
                    Number(item.quantity) || 0;

                  const itemSubtotal =
                    Number(item.subtotal) ||
                    price * quantity;

                  const book = item.book;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 py-5 first:pt-0"
                    >

                      {/* Book cover */}

                      <div className="h-28 w-20 shrink-0 overflow-hidden bg-[#F0F1F2]">

                        {book?.coverImage ? (
                          <img
                            src={
                              book.coverImage
                            }
                            alt={
                              book.title ||
                              "Book cover"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-xs text-[#6F756F]">
                            No cover
                          </div>
                        )}

                      </div>

                      {/* Book information */}

                      <div className="min-w-0 flex-1">

                        <h3 className="text-lg text-[#124C3B]">
                          {book?.title ||
                            "Book unavailable"}
                        </h3>

                        <p className="mt-2 text-sm text-[#6F756F]">
                          Quantity:{" "}
                          {quantity}
                        </p>

                        <p className="mt-2 text-sm text-[#6F756F]">
                          Price: ₦
                          {price.toLocaleString()}
                        </p>

                        <p className="mt-3 text-sm font-semibold text-[#17211D]">
                          ₦
                          {itemSubtotal.toLocaleString()}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </section>

          {/* ============================================================= */}
          {/* SUMMARY */}
          {/* ============================================================= */}

          <aside className="h-fit border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7 lg:sticky lg:top-6">

            <h2 className="text-2xl text-[#124C3B]">
              Order summary
            </h2>

            {/* Totals */}

            <div className="mt-6 space-y-4">

              {/* Subtotal */}

              <div className="flex items-center justify-between text-sm">

                <span className="text-[#6F756F]">
                  Subtotal
                </span>

                <span className="font-medium text-[#17211D]">
                  ₦
                  {Number(
                    order.subtotal || 0
                  ).toLocaleString()}
                </span>

              </div>

              {/* Shipping */}

              <div className="flex items-center justify-between text-sm">

                <span className="text-[#6F756F]">
                  Shipping
                </span>

                <span className="font-medium text-[#17211D]">
                  ₦
                  {Number(
                    order.shippingFee || 0
                  ).toLocaleString()}
                </span>

              </div>

              {/* Total */}

              <div className="flex items-center justify-between border-t border-[#DED8CC] pt-4">

                <span className="font-medium text-[#17211D]">
                  Total
                </span>

                <span className="text-xl font-semibold text-[#124C3B]">
                  ₦
                  {Number(
                    order.total || 0
                  ).toLocaleString()}
                </span>

              </div>

            </div>

            {/* =========================================================== */}
            {/* PAYMENT STATUS */}
            {/* =========================================================== */}

            <div className="mt-7 border-t border-[#DED8CC] pt-6">

              <p className="text-xs uppercase tracking-[0.12em] text-[#6F756F]">
                Payment status
              </p>

              <span
                className={`mt-2 inline-flex px-3 py-2 text-sm font-medium ${getPaymentStatusClasses(
                  paymentStatus
                )}`}
              >
                {formatStatus(
                  paymentStatus
                )}
              </span>

            </div>

            {/* =========================================================== */}
            {/* ORDER STATUS */}
            {/* =========================================================== */}

            <div className="mt-7 border-t border-[#DED8CC] pt-6">

              <p className="text-xs uppercase tracking-[0.12em] text-[#6F756F]">
                Order status
              </p>

              <span
                className={`mt-2 inline-flex px-3 py-2 text-sm font-medium ${getOrderStatusClasses(
                  orderStatus
                )}`}
              >
                {formatStatus(
                  orderStatus
                )}
              </span>

            </div>

            {/* =========================================================== */}
            {/* DELIVERY DETAILS */}
            {/* =========================================================== */}

            <div className="mt-7 border-t border-[#DED8CC] pt-6">

              <p className="text-xs uppercase tracking-[0.12em] text-[#6F756F]">
                Delivery details
              </p>

              <div className="mt-3 space-y-1 text-sm leading-6 text-[#17211D]">

                {order.shippingName && (
                  <p>
                    {order.shippingName}
                  </p>
                )}

                {order.shippingPhone && (
                  <p>
                    {order.shippingPhone}
                  </p>
                )}

                {order.shippingAddress && (
                  <p>
                    {order.shippingAddress}
                  </p>
                )}

                {(order.shippingCity ||
                  order.shippingState) && (
                  <p>
                    {order.shippingCity}

                    {order.shippingCity &&
                    order.shippingState
                      ? ", "
                      : ""}

                    {order.shippingState}
                  </p>
                )}

                {order.shippingCountry && (
                  <p>
                    {order.shippingCountry}
                  </p>
                )}

              </div>

            </div>

          </aside>

        </div>

        {/* =============================================================== */}
        {/* ACTIONS */}
        {/* =============================================================== */}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">

          {/* Pay now */}

          {!isPaid && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/payment/${order.id}`
                )
              }
              className="inline-flex w-full items-center justify-center bg-[#E86A2A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#D95C20] sm:w-auto"
            >
              Pay now
            </button>
          )}

          {/* Continue shopping */}

          <Link
            to="/books"
            className="inline-flex w-full items-center justify-center bg-[#124C3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30] sm:w-auto"
          >
            Continue shopping
          </Link>

        </div>

      </div>
    </main>
  );
};

export default OrderDetails;