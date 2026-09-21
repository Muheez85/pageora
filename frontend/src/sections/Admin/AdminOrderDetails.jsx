import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../../services/adminOrderService";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrderById(id);

      setOrder(data.order);
      setStatus(data.order?.status || "");
    } catch (error) {
      console.error(
        "ADMIN ORDER DETAILS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not load order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!status || status === order.status) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const data =
        await updateAdminOrderStatus(
          id,
          status
        );

      setOrder(data.order);

      setSuccess(
        "Order status updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );

      setStatus(order.status);
    } finally {
      setUpdating(false);
    }
  };

  const formatStatus = (value) => {
    if (!value) return "—";

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const getStatusStyle = (value) => {
    switch (value) {
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

  if (loading) {
    return (
      <section>
        <p className="text-sm text-[var(--pageora-muted)]">
          Loading order...
        </p>
      </section>
    );
  }

  if (error && !order) {
    return (
      <section>
        <button
          type="button"
          onClick={() =>
            navigate("/admin/orders")
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pageora-green)] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to orders
        </button>

        <p className="mt-8 text-sm text-red-600">
          {error}
        </p>
      </section>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <section>
      {/* Back */}
      <button
        type="button"
        onClick={() =>
          navigate("/admin/orders")
        }
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pageora-green)] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to orders
      </button>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--pageora-orange)]">
            Sales
          </p>

          <h1 className="mt-1 text-4xl text-[var(--pageora-green)]">
            Order #{order.id}
          </h1>

          <p className="mt-2 text-sm text-[var(--pageora-muted)]">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={`inline-flex w-fit px-3 py-1.5 text-sm font-medium ${getStatusStyle(
            order.status
          )}`}
        >
          {formatStatus(order.status)}
        </span>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Main */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
            <div className="flex items-center gap-3 border-b border-[var(--pageora-border)] px-5 py-4">
              <User
                size={18}
                className="text-[var(--pageora-green)]"
              />

              <h2 className="font-medium text-[var(--pageora-text)]">
                Customer
              </h2>
            </div>

            <div className="p-5">
              <p className="font-medium text-[var(--pageora-text)]">
                {order.user?.name ||
                  "Unknown customer"}
              </p>

              <p className="mt-1 text-sm text-[var(--pageora-muted)]">
                {order.user?.email || "—"}
              </p>
            </div>
          </div>

          {/* Shipping */}
          <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
            <div className="flex items-center gap-3 border-b border-[var(--pageora-border)] px-5 py-4">
              <MapPin
                size={18}
                className="text-[var(--pageora-green)]"
              />

              <h2 className="font-medium text-[var(--pageora-text)]">
                Shipping information
              </h2>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                  Name
                </p>

                <p className="mt-1 text-sm text-[var(--pageora-text)]">
                  {order.shippingName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                  Phone
                </p>

                <p className="mt-1 text-sm text-[var(--pageora-text)]">
                  {order.shippingPhone}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                  Address
                </p>

                <p className="mt-1 text-sm text-[var(--pageora-text)]">
                  {order.shippingAddress}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                  City
                </p>

                <p className="mt-1 text-sm text-[var(--pageora-text)]">
                  {order.shippingCity}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                  State
                </p>

                <p className="mt-1 text-sm text-[var(--pageora-text)]">
                  {order.shippingState}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                  Country
                </p>

                <p className="mt-1 text-sm text-[var(--pageora-text)]">
                  {order.shippingCountry}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
            <div className="flex items-center gap-3 border-b border-[var(--pageora-border)] px-5 py-4">
              <Package
                size={18}
                className="text-[var(--pageora-green)]"
              />

              <h2 className="font-medium text-[var(--pageora-text)]">
                Order items
              </h2>
            </div>

            <div className="divide-y divide-[var(--pageora-border)]">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-5"
                >
                  <div className="h-20 w-14 flex-shrink-0 overflow-hidden bg-[var(--pageora-background)]">
                    {item.book?.coverImage ? (
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-[var(--pageora-muted)]">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--pageora-text)]">
                      {item.book?.title ||
                        "Unknown book"}
                    </p>

                    <p className="mt-1 text-sm text-[var(--pageora-muted)]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-[var(--pageora-text)]">
                      ₦
                      {Number(
                        item.subtotal
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-[var(--pageora-muted)]">
                      ₦
                      {Number(
                        item.price
                      ).toLocaleString()}{" "}
                      each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Status */}
          <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
            <div className="flex items-center gap-3 border-b border-[var(--pageora-border)] px-5 py-4">
              <Package
                size={18}
                className="text-[var(--pageora-green)]"
              />

              <h2 className="font-medium text-[var(--pageora-text)]">
                Order status
              </h2>
            </div>

            <div className="p-5">
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="mt-2 w-full border border-[var(--pageora-border)] bg-[var(--pageora-surface)] px-4 py-3 text-sm text-[var(--pageora-text)] outline-none focus:border-[var(--pageora-green)]"
              >
                <option value="pending">
                  Pending
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="shipped">
                  Shipped
                </option>

                <option value="delivered">
                  Delivered
                </option>
              </select>

              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={
                  updating ||
                  status === order.status
                }
                className="mt-4 w-full bg-[var(--pageora-green)] px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Update status"}
              </button>
            </div>
          </div>

          {/* Payment */}
          <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
            <div className="flex items-center gap-3 border-b border-[var(--pageora-border)] px-5 py-4">
              <CreditCard
                size={18}
                className="text-[var(--pageora-green)]"
              />

              <h2 className="font-medium text-[var(--pageora-text)]">
                Payment
              </h2>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--pageora-muted)]">
                  Payment status
                </span>

                <span
                  className={`px-2.5 py-1 text-xs font-medium ${
                    order.paymentStatus ===
                    "paid"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {formatStatus(
                    order.paymentStatus
                  )}
                </span>
              </div>

              {order.paymentReference && (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                    Reference
                  </p>

                  <p className="mt-1 break-all text-sm text-[var(--pageora-text)]">
                    {order.paymentReference}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
            <div className="border-b border-[var(--pageora-border)] px-5 py-4">
              <h2 className="font-medium text-[var(--pageora-text)]">
                Order summary
              </h2>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--pageora-muted)]">
                  Subtotal
                </span>

                <span className="text-[var(--pageora-text)]">
                  ₦
                  {Number(
                    order.subtotal
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[var(--pageora-muted)]">
                  Shipping
                </span>

                <span className="text-[var(--pageora-text)]">
                  ₦
                  {Number(
                    order.shippingFee
                  ).toLocaleString()}
                </span>
              </div>

              <div className="border-t border-[var(--pageora-border)] pt-3">
                <div className="flex justify-between">
                  <span className="font-medium text-[var(--pageora-text)]">
                    Total
                  </span>

                  <span className="font-medium text-[var(--pageora-green)]">
                    ₦
                    {Number(
                      order.total
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminOrderDetails;