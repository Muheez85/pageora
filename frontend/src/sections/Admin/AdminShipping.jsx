import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Truck,
} from "lucide-react";

import {
  getAdminShippingLocations,
  createAdminShippingLocation,
  updateAdminShippingLocation,
  toggleAdminShippingLocation,
  deleteAdminShippingLocation,
} from "../../services/adminShippingService";

const AdminShipping = () => {
  const [locations, setLocations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingLocation, setEditingLocation] =
    useState(null);

  const [name, setName] =
    useState("");

  const [fee, setFee] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAdminShippingLocations();

      setLocations(data.locations || []);
    } catch (error) {
      console.error(
        "ADMIN SHIPPING ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not load shipping locations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const resetForm = () => {
    setName("");
    setFee("");
    setEditingLocation(null);
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || fee === "") {
      setError(
        "Location name and shipping fee are required."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingLocation) {
        await updateAdminShippingLocation(
          editingLocation.id,
          {
            name,
            fee: Number(fee),
          }
        );
      } else {
        await createAdminShippingLocation({
          name,
          fee: Number(fee),
        });
      }

      resetForm();

      await loadLocations();
    } catch (error) {
      console.error(
        "SAVE SHIPPING ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save shipping location."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setName(location.name);
    setFee(location.fee);
    setFormOpen(true);
    setError("");
  };

  const handleToggle = async (id) => {
    try {
      setError("");

      const data =
        await toggleAdminShippingLocation(
          id
        );

      setLocations((prev) =>
        prev.map((location) =>
          location.id === id
            ? data.location
            : location
        )
      );
    } catch (error) {
      console.error(
        "TOGGLE SHIPPING ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update shipping location."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shipping location?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteAdminShippingLocation(
        id
      );

      setLocations((prev) =>
        prev.filter(
          (location) => location.id !== id
        )
      );
    } catch (error) {
      console.error(
        "DELETE SHIPPING ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete shipping location."
      );
    }
  };

  return (
    <section>
      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--pageora-orange)]">
            Store
          </p>

          <h1 className="mt-1 text-4xl text-[var(--pageora-green)]">
            Shipping
          </h1>

          <p className="mt-2 text-sm text-[var(--pageora-muted)]">
            Manage delivery locations and shipping fees.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-[var(--pageora-green)] px-5 py-3 text-sm font-medium text-white"
        >
          <Plus size={18} />
          Add location
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}

      {formOpen && (
        <div className="mt-8 border border-[var(--pageora-border)] bg-[var(--pageora-surface)] p-6">
          <h2 className="text-xl text-[var(--pageora-green)]">
            {editingLocation
              ? "Edit shipping location"
              : "Add shipping location"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                Location name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Lagos"
                className="mt-2 w-full border border-[var(--pageora-border)] bg-[var(--pageora-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--pageora-green)]"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--pageora-muted)]">
                Shipping fee
              </label>

              <input
                type="number"
                min="0"
                value={fee}
                onChange={(event) =>
                  setFee(event.target.value)
                }
                placeholder="2000"
                className="mt-2 w-full border border-[var(--pageora-border)] bg-[var(--pageora-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--pageora-green)]"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[var(--pageora-green)] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingLocation
                  ? "Update location"
                  : "Add location"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-[var(--pageora-border)] px-5 py-3 text-sm font-medium text-[var(--pageora-text)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content */}

      <div className="mt-8">
        {loading && (
          <p className="text-sm text-[var(--pageora-muted)]">
            Loading shipping locations...
          </p>
        )}

        {!loading &&
          locations.length === 0 && (
            <div className="border border-[var(--pageora-border)] bg-[var(--pageora-surface)] p-10 text-center">
              <Truck
                size={32}
                className="mx-auto text-[var(--pageora-muted)]"
              />

              <p className="mt-3 text-sm text-[var(--pageora-muted)]">
                No shipping locations yet.
              </p>
            </div>
          )}

        {!loading &&
          locations.length > 0 && (
            <div className="overflow-x-auto border border-[var(--pageora-border)] bg-[var(--pageora-surface)]">
              <table className="w-full min-w-[800px] text-left">
                <thead className="border-b border-[var(--pageora-border)]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Location
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Fee
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--pageora-muted)]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {locations.map(
                    (location) => (
                      <tr
                        key={location.id}
                        className="border-b border-[var(--pageora-border)] last:border-b-0"
                      >
                        <td className="px-5 py-5">
                          <p className="font-medium text-[var(--pageora-text)]">
                            {location.name}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm font-medium text-[var(--pageora-text)]">
                          ₦
                          {Number(
                            location.fee
                          ).toLocaleString()}
                        </td>

                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggle(
                                location.id
                              )
                            }
                            className={`px-2.5 py-1 text-xs font-medium ${
                              location.active
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {location.active
                              ? "Active"
                              : "Inactive"}
                          </button>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  location
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--pageora-green)] hover:underline"
                            >
                              <Pencil
                                size={14}
                              />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  location.id
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
                            >
                              <Trash2
                                size={14}
                              />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </section>
  );
};

export default AdminShipping;