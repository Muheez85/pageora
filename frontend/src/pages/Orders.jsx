import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

import { getOrders } from "../services/orderService";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load orders
  |--------------------------------------------------------------------------
  */

  const loadOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET ORDERS ERROR:", error);

      /*
       * If the token is no longer valid, remove it and
       * send the customer back to login.
       */

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }

      setError(
        error.response?.data?.message ||
          "We couldn't load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatOrderStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatPaymentStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getOrderStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#FFF1E8] text-[#C4551E]";

      case "paid":
        return "bg-[#EAF3EE] text-[#124C3B]";

      case "processing":
        return "bg-[#F0F1F2] text-[#17211D]";

      case "shipped":
        return "bg-[#F0F1F2] text-[#17211D]";

      case "delivered":
        return "bg-[#EAF3EE] text-[#124C3B]";

      default:
        return "bg-[#F0F1F2] text-[#6F756F]";
    }
  };

  const getPaymentStatusClasses = (status) => {
    switch (status) {
      case "paid":
        return "bg-[#EAF3EE] text-[#124C3B]";

      case "unpaid":
        return "bg-[#FFF1E8] text-[#C4551E]";

      case "failed":
        return "bg-red-50 text-red-600";

      default:
        return "bg-[#F0F1F2] text-[#6F756F]";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading state
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-10 sm:py-14">

          <div className="animate-pulse">

            <div className="h-4 w-32 bg-[#DED8CC]" />

            <div className="mt-8 h-12 w-48 bg-[#DED8CC]" />

            <div className="mt-3 h-4 w-full max-w-xl bg-[#DED8CC]" />

            <div className="mt-10 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="space-y-3">
                      <div className="h-6 w-32 bg-[#DED8CC]" />
                      <div className="h-4 w-28 bg-[#DED8CC]" />
                    </div>

                    <div className="space-y-3 sm:text-right">
                      <div className="ml-auto h-3 w-16 bg-[#DED8CC]" />
                      <div className="ml-auto h-5 w-24 bg-[#DED8CC]" />
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main page
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">

        {/* =============================================================== */}
        {/* BACK */}
        {/* =============================================================== */}

        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-sm text-[#6F756F] transition hover:text-[#124C3B]"
        >
          <ArrowLeft size={17} />
          Back to account
        </Link>

        {/* =============================================================== */}
        {/* HEADER */}
        {/* =============================================================== */}

        <div className="mt-8 border-b border-[#DED8CC] pb-8">

          <div className="flex h-12 w-12 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
            <ShoppingBag
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <h1 className="mt-5 text-4xl text-[#124C3B] sm:text-5xl">
            My orders
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6F756F] sm:text-base">
            View your previous orders and keep track
            of their status.
          </p>

        </div>

        {/* =============================================================== */}
        {/* ERROR */}
        {/* =============================================================== */}

        {error && (
          <div className="mx-auto mt-6 max-w-4xl border border-red-200 bg-red-50 px-4 py-4">

            <p className="text-sm leading-6 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadOrders}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#124C3B] transition hover:text-[#E86A2A]"
            >
              <RefreshCw size={15} />
              Try again
            </button>

          </div>
        )}

        {/* =============================================================== */}
        {/* EMPTY STATE */}
        {/* =============================================================== */}

        {!error && orders.length === 0 ? (
          <div className="mx-auto mt-10 max-w-4xl border border-dashed border-[#CFC8BA] bg-[#FFFDF8] px-6 py-14 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
              <ShoppingBag
                size={22}
                strokeWidth={1.8}
              />
            </div>

            <h2 className="mt-5 text-2xl text-[#124C3B]">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6F756F]">
              Your orders will appear here after
              you place your first order.
            </p>

            <Link
              to="/books"
              className="mt-6 inline-flex bg-[#124C3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30]"
            >
              Browse books
            </Link>

          </div>
        ) : (
          /* ============================================================= */
          /* ORDER LIST */
          /* ============================================================= */

          <div className="mx-auto mt-10 max-w-4xl space-y-4">

            {orders.map((order) => {
              /*
               * Defensive checks make the UI safer if the
               * API ever returns incomplete data.
               */

              const orderItems = Array.isArray(
                order.items
              )
                ? order.items
                : [];

              const totalQuantity =
                orderItems.reduce(
                  (total, item) =>
                    total +
                    (Number(item.quantity) || 0),
                  0
                );

              const orderStatus =
                order.status || "pending";

              const paymentStatus =
                order.paymentStatus || "unpaid";

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

              return (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="group block border border-[#DED8CC] bg-[#FFFDF8] p-5 transition hover:border-[#124C3B] sm:p-6"
                >

                  {/* ===================================================== */}
                  {/* TOP */}
                  {/* ===================================================== */}

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                    {/* Order information */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl text-[#124C3B]">
                          Order #{order.id}
                        </h2>

                        {/* Order status */}

                        <span
                          className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-0.1em ${getOrderStatusClasses(
                            orderStatus
                          )}`}
                        >
                          {formatOrderStatus(
                            orderStatus
                          )}
                        </span>

                      </div>

                      <p className="mt-2 text-sm text-[#6F756F]">
                        {formattedDate}
                      </p>

                    </div>

                    {/* Total */}

                    <div className="flex items-center justify-between gap-6 sm:justify-end">

                      <div className="text-left sm:text-right">

                        <p className="text-xs uppercase tracking-0.1em text-[#6F756F]">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-semibold text-[#17211D]">
                          ₦
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                      <ChevronRight
                        size={20}
                        className="shrink-0 text-[#6F756F] transition group-hover:translate-x-1 group-hover:text-[#124C3B]"
                      />

                    </div>

                  </div>


                  <div className="mt-5 grid gap-4 border-t border-[#DED8CC] pt-5 sm:grid-cols-2">

                    {/* Payment */}

                    <div>

                      <p className="text-xs uppercase tracking-0.1em text-[#6F756F]">
                        Payment
                      </p>

                      <span
                        className={`mt-2 inline-flex px-2.5 py-1 text-[10px] font-semibold uppercase tracking-0.1em ${getPaymentStatusClasses(
                          paymentStatus
                        )}`}
                      >
                        {formatPaymentStatus(
                          paymentStatus
                        )}
                      </span>

                    </div>

                    {/* Items */}

                    <div className="sm:text-right">

                      <p className="text-xs uppercase tracking-0.1em text-[#6F756F]">
                        Items
                      </p>

                      <p className="mt-2 text-sm font-medium text-[#17211D]">
                        {totalQuantity}{" "}
                        {totalQuantity === 1
                          ? "book"
                          : "books"}
                      </p>

                    </div>

                  </div>

                  {/* ===================================================== */}
                  {/* BOOK TITLES */}
                  {/* ===================================================== */}

                  {orderItems.length > 0 && (
                    <div className="mt-5 border-t border-[#DED8CC] pt-4">

                      <p className="text-sm text-[#6F756F]">
                        {orderItems.length}{" "}
                        {orderItems.length === 1
                          ? "line item"
                          : "line items"}
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-[#17211D]">
                        {orderItems
                          .map(
                            (item) =>
                              item.book?.title
                          )
                          .filter(Boolean)
                          .join(", ") ||
                          "Order items unavailable"}
                      </p>

                    </div>
                  )}

                </Link>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
};

export default Orders;