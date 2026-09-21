import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  ShoppingBag,
  Banknote,
  Clock3,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getAdminDashboard } from "../../services/adminDashboardService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getAdminDashboard();

        if (data.success) {
          setDashboard(data);
        }
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin"
          style={{
            color: "var(--pageora-green)",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: "#E7B7A5",
          backgroundColor: "#FFF4EF",
          color: "#A83E18",
        }}
      >
        {error}
      </div>
    );
  }

  const {
    stats,
    orderOverview,
    lowStockBooks,
    recentOrders,
  } = dashboard;

  const statCards = [
    {
      title: "Total Revenue",
      value: `₦${Number(stats.revenue).toLocaleString()}`,
      icon: Banknote,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
    },
    {
      title: "Books",
      value: stats.totalBooks,
      icon: BookOpen,
    },
  ];

  const statusCards = [
    {
      title: "Pending",
      value: orderOverview.pending,
      icon: Clock3,
    },
    {
      title: "Paid",
      value: orderOverview.paid,
      icon: CreditCard,
    },
    {
      title: "Processing",
      value: orderOverview.processing,
      icon: Package,
    },
    {
      title: "Shipped",
      value: orderOverview.shipped,
      icon: Truck,
    },
    {
      title: "Delivered",
      value: orderOverview.delivered,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p
          className="text-sm font-semibold uppercase tracking-[0.16em]"
          style={{
            color: "var(--pageora-orange)",
          }}
        >
          Overview
        </p>

        <h1
          className="mt-2 text-3xl font-bold"
          style={{
            color: "var(--pageora-green)",
          }}
        >
          Admin Dashboard
        </h1>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--pageora-muted)",
          }}
        >
          Here's what's happening across your Pageora store.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border p-5"
              style={{
                borderColor: "var(--pageora-border)",
                backgroundColor: "var(--pageora-surface)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--pageora-muted)",
                    }}
                  >
                    {card.title}
                  </p>

                  <p
                    className="mt-2 text-2xl font-bold"
                    style={{
                      color: "var(--pageora-text)",
                    }}
                  >
                    {card.value}
                  </p>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "#EAF2EE",
                    color: "var(--pageora-green)",
                  }}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Overview */}
      <section>
        <div className="mb-4">
          <h2
            className="text-lg font-semibold"
            style={{
              color: "var(--pageora-text)",
            }}
          >
            Order Overview
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--pageora-muted)",
            }}
          >
            Current order status across the store.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          {statusCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border p-4"
                style={{
                  borderColor: "var(--pageora-border)",
                  backgroundColor: "var(--pageora-surface)",
                }}
              >
                <Icon
                  size={19}
                  style={{
                    color: "var(--pageora-orange)",
                  }}
                />

                <p
                  className="mt-4 text-2xl font-bold"
                  style={{
                    color: "var(--pageora-text)",
                  }}
                >
                  {card.value}
                </p>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--pageora-muted)",
                  }}
                >
                  {card.title}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Orders + Low Stock */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent Orders */}
        <section
          className="overflow-hidden rounded-2xl border"
          style={{
            borderColor: "var(--pageora-border)",
            backgroundColor: "var(--pageora-surface)",
          }}
        >
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2
                className="font-semibold"
                style={{
                  color: "var(--pageora-text)",
                }}
              >
                Recent Orders
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--pageora-muted)",
                }}
              >
                The latest orders placed in your store.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="hidden items-center gap-1 text-sm font-semibold sm:flex"
              style={{
                color: "var(--pageora-green)",
              }}
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div
                className="p-8 text-center text-sm"
                style={{
                  color: "var(--pageora-muted)",
                }}
              >
                No orders yet.
              </div>
            ) : (
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr
                    className="border-b text-left text-xs uppercase tracking-wide"
                    style={{
                      borderColor: "var(--pageora-border)",
                      color: "var(--pageora-muted)",
                    }}
                  >
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0"
                      style={{
                        borderColor: "var(--pageora-border)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="font-semibold hover:underline"
                          style={{
                            color: "var(--pageora-green)",
                          }}
                        >
                          #{order.id}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: "var(--pageora-text)",
                          }}
                        >
                          {order.user?.name || "Unknown"}
                        </p>

                        <p
                          className="mt-1 text-xs"
                          style={{
                            color: "var(--pageora-muted)",
                          }}
                        >
                          {order.user?.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold">
                        ₦{Number(order.total).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize"
                          style={{
                            backgroundColor: "#EAF2EE",
                            color: "var(--pageora-green)",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Low Stock */}
        <section
          className="overflow-hidden rounded-2xl border"
          style={{
            borderColor: "var(--pageora-border)",
            backgroundColor: "var(--pageora-surface)",
          }}
        >
          <div className="flex items-center gap-3 border-b p-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "#FFF0E8",
                color: "var(--pageora-orange)",
              }}
            >
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2
                className="font-semibold"
                style={{
                  color: "var(--pageora-text)",
                }}
              >
                Low Stock
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--pageora-muted)",
                }}
              >
                Books with 5 or fewer copies.
              </p>
            </div>
          </div>

          <div>
            {lowStockBooks.length === 0 ? (
              <div
                className="p-8 text-center text-sm"
                style={{
                  color: "var(--pageora-muted)",
                }}
              >
                <CheckCircle2
                  size={25}
                  className="mx-auto mb-2"
                  style={{
                    color: "var(--pageora-green)",
                  }}
                />

                Inventory looks healthy.
              </div>
            ) : (
              lowStockBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-3 border-b p-4 last:border-0"
                  style={{
                    borderColor: "var(--pageora-border)",
                  }}
                >
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-12 w-9 rounded object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-12 w-9 items-center justify-center rounded"
                      style={{
                        backgroundColor: "#F7F3EC",
                        color: "var(--pageora-muted)",
                      }}
                    >
                      <BookOpen size={16} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-medium"
                      style={{
                        color: "var(--pageora-text)",
                      }}
                    >
                      {book.title}
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: "var(--pageora-muted)",
                      }}
                    >
                      ₦{Number(book.price).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: "#FFF0E8",
                      color: "var(--pageora-orange)",
                    }}
                  >
                    {book.stock} left
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-4">
            <Link
              to="/admin/books"
              className="flex items-center justify-center gap-2 text-sm font-semibold"
              style={{
                color: "var(--pageora-green)",
              }}
            >
              Manage books
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;