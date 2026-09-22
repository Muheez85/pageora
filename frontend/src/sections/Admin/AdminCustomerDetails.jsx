import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  MapPin,
  ShoppingBag,
  Mail,
  Calendar,
  Eye,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getAdminCustomerById,
} from "../../services/adminCustomerService";

const AdminCustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAdminCustomerById(id);

      setCustomer(data.customer);
    } catch (error) {
      console.error(
        "ADMIN CUSTOMER DETAILS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not load customer."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

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

  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatStatus = (status) => {
    if (!status) return "—";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
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
        <p className="text-sm text-var(--pageora-muted)">
          Loading customer...
        </p>
      </section>
    );
  }

  if (error || !customer) {
    return (
      <section>
        <button
          type="button"
          onClick={() =>
            navigate("/admin/customers")
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-var(--pageora-green) hover:underline"
        >
          <ArrowLeft size={16} />
          Back to customers
        </button>

        <p className="mt-8 text-sm text-red-600">
          {error || "Customer not found."}
        </p>
      </section>
    );
  }

  return (
    <section>
      {/* Back */}

      <button
        type="button"
        onClick={() =>
          navigate("/admin/customers")
        }
        className="inline-flex items-center gap-2 text-sm font-medium text-var(--pageora-green) hover:underline"
      >
        <ArrowLeft size={16} />
        Back to customers
      </button>

      {/* Header */}

      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-var(--pageora-orange)">
            Customer
          </p>

          <h1 className="mt-1 text-4xl text-var(--pageora-green)">
            {customer.name}
          </h1>

          <p className="mt-2 text-sm text-var(--pageora-muted)">
            Customer since{" "}
            {formatDate(customer.createdAt)}
          </p>
        </div>
      </div>

      {/* Customer overview */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Orders */}

        <div className="border border-var(--pageora-border) bg-var(--pageora-surface) p-5">
          <div className="flex items-center justify-between">
            <ShoppingBag
              size={20}
              className="text-var(--pageora-green)"
            />

            <span className="text-xs text-var(--pageora-muted)">
              Orders
            </span>
          </div>

          <p className="mt-5 text-3xl font-medium text-var(--pageora-text)">
            {customer.orderCount}
          </p>

          <p className="mt-1 text-sm text-var(--pageora-muted)">
            Total orders
          </p>
        </div>

        {/* Total spent */}

        <div className="border border-var(--pageora-border) bg-var(--pageora-surface) p-5">
          <div className="flex items-center justify-between">
            <span className="text-xl font-medium text-var(--pageora-green)">
              ₦
            </span>

            <span className="text-xs text-var(--pageora-muted)">
              Spending
            </span>
          </div>

          <p className="mt-5 text-3xl font-medium text-var(--pageora-text)">
            ₦
            {Number(
              customer.totalSpent
            ).toLocaleString()}
          </p>

          <p className="mt-1 text-sm text-var(--pageora-muted)">
            Total order value
          </p>
        </div>

        {/* Addresses */}

        <div className="border border-var(--pageora-border) bg-var(--pageora-surface) p-5">
          <div className="flex items-center justify-between">
            <MapPin
              size={20}
              className="text-var(--pageora-green)"
            />

            <span className="text-xs text-var(--pageora-muted)">
              Addresses
            </span>
          </div>

          <p className="mt-5 text-3xl font-medium text-var(--pageora-text)">
            {customer.addressCount}
          </p>

          <p className="mt-1 text-sm text-var(--pageora-muted)">
            Saved addresses
          </p>
        </div>

        {/* Joined */}

        <div className="border border-var(--pageora-border) bg-var(--pageora-surface) p-5">
          <div className="flex items-center justify-between">
            <Calendar
              size={20}
              className="text-var(--pageora-green)"
            />

            <span className="text-xs text-var(--pageora-muted)">
              Member
            </span>
          </div>

          <p className="mt-5 text-lg font-medium text-var(--pageora-text)">
            {formatShortDate(
              customer.createdAt
            )}
          </p>

          <p className="mt-1 text-sm text-var(--pageora-muted)">
            Registration date
          </p>
        </div>
      </div>

      {/* Main content */}

      <div className="mt-8 grid gap-6 xl:grid-cols-[360px_1fr]">
        {/* Customer information */}

        <div className="space-y-6">
          <div className="border border-var(--pageora-border) bg-[var(--pageora-surface)">
            <div className="flex items-center gap-3 border-b border-var(--pageora-border) px-5 py-4">
              <User
                size={18}
                className="text-var(--pageora-green)"
              />

              <h2 className="font-medium text-var(--pageora-text)">
                Customer information
              </h2>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-var(--pageora-muted)">
                  Name
                </p>

                <p className="mt-1 text-sm text-var(--pageora-text)">
                  {customer.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-var(--pageora-muted)">
                  Email
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <Mail
                    size={15}
                    className="text-var(--pageora-muted)"
                  />

                  <p className="text-sm text-var(--pageora-text)">
                    {customer.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-var(--pageora-muted)">
                  Customer ID
                </p>

                <p className="mt-1 text-sm text-var(--pageora-text)">
                  #{customer.id}
                </p>
              </div>
            </div>
          </div>

          {/* Addresses */}

          <div className="border border-var(--pageora-border) bg-var(--pageora-surface)">
            <div className="flex items-center gap-3 border-b border-var(--pageora-border) px-5 py-4">
              <MapPin
                size={18}
                className="text-var(--pageora-green)"
              />

              <h2 className="font-medium text-var(--pageora-text)">
                Saved addresses
              </h2>
            </div>

            {customer.addresses?.length ===
            0 ? (
              <div className="p-5">
                <p className="text-sm text-var(--pageora-muted)">
                  No saved addresses.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-var(--pageora-border)">
                {customer.addresses.map(
                  (address) => (
                    <div
                      key={address.id}
                      className="p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-var(--pageora-text)">
                          {address.label}
                        </p>

                        {address.isDefault && (
                          <span className="text-xs font-medium text-var(--pageora-green)">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-var(--pageora-muted)">
                        {address.fullName}
                      </p>

                      <p className="mt-1 text-sm text-var(--pageora-muted)">
                        {address.phone}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-var(--pageora-muted)">
                        {address.address}
                        <br />
                        {address.city},{" "}
                        {address.state}
                        <br />
                        {address.country}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Orders */}

        <div className="border border-var(--pageora-border) bg-var(--pageora-surface)">
          <div className="flex items-center justify-between border-b border-var(--pageora-border) px-5 py-4">
            <div className="flex items-center gap-3">
              <ShoppingBag
                size={18}
                className="text-var(--pageora-green)"
              />

              <h2 className="font-medium text-var(--pageora-text)">
                Order history
              </h2>
            </div>

            <span className="text-xs text-var(--pageora-muted)">
              {customer.orderCount}{" "}
              {customer.orderCount === 1
                ? "order"
                : "orders"}
            </span>
          </div>

          {customer.orders?.length ===
          0 ? (
            <div className="p-8 text-center">
              <ShoppingBag
                size={30}
                className="mx-auto text-var(--pageora-muted)"
              />

              <p className="mt-3 text-sm text-var(--pageora-muted)">
                This customer has no orders
                yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-var(--pageora-border)">
              {customer.orders.map(
                (order) => (
                  <div
                    key={order.id}
                    className="p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-var(--pageora-text)">
                            Order #{order.id}
                          </p>

                          <span
                            className={`px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {formatStatus(
                              order.status
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-var(--pageora-muted)">
                          {formatShortDate(
                            order.createdAt
                          )}{" "}
                          ·{" "}
                          {order.items?.length ||
                            0}{" "}
                          {order.items?.length ===
                          1
                            ? "item"
                            : "items"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <p className="font-medium text-var(--pageora-text)">
                          ₦
                          {Number(
                            order.total
                          ).toLocaleString()}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order.id}`
                            )
                          }
                          className="inline-flex rounded-3xl items-center gap-1.5 text-sm font-medium text-var(--pageora-green) hover:underline"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </div>
                    </div>

                    {/* Order books */}

                    {order.items?.length >
                      0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {order.items
                          .slice(0, 4)
                          .map((item) => (
                            <span
                              key={item.id}
                              className="bg-var(--pageora-background) px-3 py-1.5 text-xs text-var(--pageora-muted)"
                            >
                              {item.book?.title ||
                                "Unknown book"}
                            </span>
                          ))}

                        {order.items.length >
                          4 && (
                          <span className="bg-var(--pageora-background) px-3 py-1.5 text-xs text-var(--pageora-muted)">
                            +
                            {order.items.length -
                              4}{" "}
                            more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminCustomerDetails;