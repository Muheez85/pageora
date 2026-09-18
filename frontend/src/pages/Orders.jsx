import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

import { getOrders } from "../services/orderService";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("GET ORDERS ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "We couldn't load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">

        {/* Back */}
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-sm text-[#6F756F] transition hover:text-[#124C3B]"
        >
          <ArrowLeft size={17} />
          Back to account
        </Link>

        {/* Header */}
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
            View your previous purchases and check the
            status of your orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-6 max-w-4xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="mx-auto mt-10 max-w-4xl border border-dashed border-[#CFC8BA] bg-[#FFFDF8] px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
              <ShoppingBag size={22} />
            </div>

            <h2 className="mt-5 text-2xl text-[#124C3B]">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6F756F]">
              Your completed and pending orders will appear
              here once you place your first order.
            </p>

            <Link
              to="/books"
              className="mt-6 inline-flex bg-[#124C3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30]"
            >
              Browse books
            </Link>
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-4xl space-y-4">
            {orders.map((order) => {
              const isPaid =
                order.paymentStatus === "paid";

              return (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="group block border border-[#DED8CC] bg-[#FFFDF8] p-5 transition hover:border-[#124C3B] sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Order info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl text-[#124C3B]">
                          Order #{order.id}
                        </h2>

                        <span
                          className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            isPaid
                              ? "bg-[#EAF3EE] text-[#124C3B]"
                              : "bg-[#FFF1E8] text-[#C4551E]"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#6F756F]">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs uppercase tracking-[0.1em] text-[#6F756F]">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-semibold text-[#17211D]">
                          ₦
                          {Number(
                            order.total
                          ).toLocaleString()}
                        </p>
                      </div>

                      <ChevronRight
                        size={20}
                        className="shrink-0 text-[#6F756F] transition group-hover:translate-x-1 group-hover:text-[#124C3B]"
                      />
                    </div>
                  </div>

                  {/* Items */}
                  {order.items?.length > 0 && (
                    <div className="mt-5 border-t border-[#DED8CC] pt-4">
                      <p className="text-sm text-[#6F756F]">
                        {order.items.length}{" "}
                        {order.items.length === 1
                          ? "item"
                          : "items"}
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-[#17211D]">
                        {order.items
                          .map(
                            (item) =>
                              item.book?.title
                          )
                          .filter(Boolean)
                          .join(", ")}
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