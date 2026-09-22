import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAdminCustomers,
} from "../../services/adminCustomerService";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminCustomers({
        search: search || undefined,
      });

      setCustomers(data.customers || []);
    } catch (error) {
      console.error(
        "ADMIN CUSTOMERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

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
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-var(--pageora-orange)">
          Store
        </p>

        <h1 className="mt-1 text-4xl text-var(--pageora-green)">
          Customers
        </h1>

        <p className="mt-2 text-sm text-var(--pageora-muted)">
          View and manage your Pageora customers.
        </p>
      </div>

      {/* Search */}

      <div className="mt-8">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-var(--pageora-muted)"
          />

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full border border-var(--pageora-border) bg-var(--pageora-surface) py-3 pl-11 pr-4 text-sm outline-none focus:border-var(--pageora-green)"
          />
        </div>
      </div>

      {/* Content */}

      <div className="mt-8">

        {/* Loading */}

        {loading && (
          <p className="text-sm text-var(--pageora-muted)">
            Loading customers...
          </p>
        )}

        {/* Error */}

        {!loading && error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          customers.length === 0 && (
            <div className="border border-var(--pageora-border) bg-var(--pageora-surface) p-10 text-center">
              <Users
                size={32}
                className="mx-auto text-var(--pageora-muted)"
              />

              <p className="mt-3 text-sm text-var(--pageora-muted)">
                No customers found.
              </p>
            </div>
          )}

        {/* Customers */}

        {!loading &&
          !error &&
          customers.length > 0 && (
            <div className="overflow-x-auto border border-var(--pageora-border) bg-[var(--pageora-surface)">
              <table className="w-full min-w-225  rounded-3xl text-left">

                <thead className="border-b border-var(--pageora-border)">
                  <tr>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-var(--pageora-muted)">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-var(--pageora-muted)">
                      Orders
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-var(--pageora-muted)">
                      Spent
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-var(--pageora-muted)">
                      Addresses
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-var(--pageora-muted)">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-var(--pageora-muted)">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-var(--pageora-border) last:border-b-0"
                    >

                      {/* Customer */}

                      <td className="px-5 py-5">

                        <div>
                          <p className="font-medium text-var(--pageora-text)">
                            {customer.name}
                          </p>

                          <p className="mt-1 text-xs text-var(--pageora-muted)">
                            {customer.email}
                          </p>
                        </div>

                      </td>

                      {/* Orders */}

                      <td className="px-5 py-5 text-sm text-var(--pageora-text)">
                        {customer.orderCount}
                      </td>

                      {/* Spent */}

                      <td className="px-5 py-5 text-sm font-medium text-var(--pageora-text)">
                        ₦
                        {Number(
                          customer.totalSpent
                        ).toLocaleString()}
                      </td>

                      {/* Addresses */}

                      <td className="px-5 py-5 text-sm text-var(--pageora-muted)">
                        {customer.addressCount}
                      </td>

                      {/* Joined */}

                      <td className="px-5 py-5 text-sm text-var(--pageora-muted)">
                        {formatDate(
                          customer.createdAt
                        )}
                      </td>

                      {/* Action */}

                      <td className="px-5 py-5">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/customers/${customer.id}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-var(--pageora-green) hover:underline"
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

export default AdminCustomers;