import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAdminOrders } from "../../services/adminOrderService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

// load order
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders({
        search: search || undefined,
        status: status || undefined,
        paymentStatus:
          paymentStatus || undefined,
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.error("ADMIN ORDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Could not load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // LOAD WHEN FILTERS CHANGE
  // ---------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status, paymentStatus]);

  // ---------------------------------------
  // STATUS BADGE
  // ---------------------------------------

  const getOrderStatusStyle = (orderStatus) => {
    switch (orderStatus) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "paid":
        return "bg-blue-50 text-blue-700";

      case "processing":
        return "bg-orange-50 text-orange-700";

      case "shipped":
        return "bg-purple-50 text-purple-700";

      case "delivered":
        return "bg-green-50 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ---------------------------------------
  // PAYMENT STATUS
  // ---------------------------------------

  const getPaymentStatusStyle = (
    paymentStatus
  ) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-50 text-green-700";

      case "unpaid":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ---------------------------------------
  // FORMAT STATUS
  // ---------------------------------------

  const formatStatus = (value) => {
    if (!value) return "—";

    return value
      .charAt(0)
      .toUpperCase() + value.slice(1);
  };

  // ---------------------------------------
  // FORMAT DATE
  // ---------------------------------------

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <section>
      {/* HEADER */}

      <div>
        <p className="text-sm font-medium text-[var(--pageora-orange)]">
          Sales
        </p>

        <h1 className="mt-1 text-4xl text-[var(--pageora-green)]">
          Orders
        </h1>

        <p className="mt-2 text-sm text-[var(--pageora-muted)]">
          Manage customer orders and fulfillment.
        </p>
      </div>

      {/* SEARCH + FILTERS */}

      <div className="mt-8 flex flex-col gap-4 lg:flex-row">
        {/* SEARCH */}

        <div className="relative flex-1 lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pageora-muted)]"
          />

          <input
            type="text"
            placeholder="Search order, customer or email..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full border border-[var(--pageora-border)] bg-[var(--pageora-surface)] py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--pageora-green)]"
          />
        </div>

        {/* FILTER ICON */}

        <div className="flex items-center gap-2 text-sm text-[var(--pageora-muted)]">
          <SlidersHorizontal size={17} />
          Filters
        </div>

        {/* ORDER STATUS */}

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)] px-4 py-3 text-sm text-[var(--pageora-text)] outline-none focus:border-[var(--pageora-green)]"
        >
          <option value="">All order statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="processing">
            Processing
          </option>
          <option value="shipped">Shipped</option>
          <option value="delivered">
            Delivered
          </option>
        </select>

        {/* PAYMENT STATUS */}

        <select
          value={paymentStatus}
          onChange={(event) =>
            setPaymentStatus(event.target.value)
          }
          className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)] px-4 py-3 text-sm text-[var(--pageora-text)] outline-none focus:border-[var(--pageora-green)]"
        >
          <option value="">
            All payment statuses
          </option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* CONTENT */}

      <div className="mt-8">
        {/* LOADING */}

        {loading && (
          <p className="text-sm text-[var(--pageora-muted)]">
            Loading orders...
          </p>
        )}

        {/* ERROR */}

        {!loading && error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)] p-10 text-center">
              <p className="text-sm text-[var(--pageora-muted)]">
                No orders found.
              </p>
            </div>
          )}

        {/* ORDERS */}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="overflow-x-auto border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="border-b border-[var(--pageora-border)]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Order
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Total
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Date
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--pageora-border)] last:border-b-0"
                    >
                      {/* ORDER */}

                      <td className="px-5 py-5">
                        <p className="font-medium text-[var(--pageora-text)]">
                          #{order.id}
                        </p>

                        <p className="mt-1 text-xs text-[var(--pageora-muted)]">
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1
                            ? "item"
                            : "items"}
                        </p>
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-5 py-5">
                        <p className="text-sm font-medium text-[var(--pageora-text)]">
                          {order.user?.name ||
                            "Unknown customer"}
                        </p>

                        <p className="mt-1 text-xs text-[var(--pageora-muted)]">
                          {order.user?.email || "—"}
                        </p>
                      </td>

                      {/* TOTAL */}

                      <td className="px-5 py-5 text-sm font-medium text-[var(--pageora-text)]">
                        ₦
                        {Number(
                          order.total
                        ).toLocaleString()}
                      </td>

                      {/* PAYMENT */}

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium ${getPaymentStatusStyle(
                            order.paymentStatus
                          )}`}
                        >
                          {formatStatus(
                            order.paymentStatus
                          )}
                        </span>
                      </td>

                      {/* ORDER STATUS */}

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium ${getOrderStatusStyle(
                            order.status
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      {/* DATE */}

                      <td className="px-5 py-5 text-sm text-[var(--pageora-muted)]">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order.id}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--pageora-green)] hover:underline"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </section>
  );
};

export default AdminOrders;