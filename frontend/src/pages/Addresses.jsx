import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Edit3,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import api from "../api/axios";

const emptyForm = {
  label: "",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "Nigeria",
  isDefault: false,
};

const Addresses = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/users/addresses",
        getAuthConfig()
      );

      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("GET ADDRESSES ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "We couldn't load your addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadAddresses();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEditForm = (address) => {
    setEditingId(address.id);

    setFormData({
      label: address.label || "",
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "Nigeria",
      isDefault: Boolean(address.isDefault),
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        label: formData.label.trim(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        isDefault: formData.isDefault,
      };

      let response;

      if (editingId) {
        response = await api.put(
          `/users/addresses/${editingId}`,
          payload,
          getAuthConfig()
        );
      } else {
        response = await api.post(
          "/users/addresses",
          payload,
          getAuthConfig()
        );
      }

      setAddresses((current) => {
        if (editingId) {
          return current
            .map((address) =>
              address.id === editingId
                ? response.data.address
                : address
            )
            .sort(
              (a, b) =>
                Number(b.isDefault) -
                Number(a.isDefault)
            );
        }

        return [
          response.data.address,
          ...current,
        ].sort(
          (a, b) =>
            Number(b.isDefault) -
            Number(a.isDefault)
        );
      });

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);

      setSuccess(
        editingId
          ? "Address updated successfully."
          : "Address added successfully."
      );
    } catch (error) {
      console.error("SAVE ADDRESS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "We couldn't save this address."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(addressId);
      setError("");
      setSuccess("");

      await api.delete(
        `/users/addresses/${addressId}`,
        getAuthConfig()
      );

      await loadAddresses();

      setSuccess("Address deleted successfully.");
    } catch (error) {
      console.error("DELETE ADDRESS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "We couldn't delete this address."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading your addresses...
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
        <div className="mt-8 flex flex-col gap-6 border-b border-[#DED8CC] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
              <MapPin
                size={22}
                strokeWidth={1.8}
              />
            </div>

            <h1 className="mt-5 text-4xl text-[#124C3B] sm:text-5xl">
              Your addresses
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6F756F] sm:text-base">
              Save your delivery addresses so checking out
              is quicker and easier.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex h-11 items-center justify-center gap-2 bg-[#124C3B] px-5 text-sm font-medium text-white transition hover:bg-[#0D3D30]"
            >
              <Plus size={17} />
              Add new address
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-auto mt-6 max-w-5xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mx-auto mt-6 flex max-w-5xl items-center gap-2 border border-[#C9DDD3] bg-[#EDF6F1] px-4 py-3">
            <Check
              size={17}
              className="shrink-0 text-[#124C3B]"
            />

            <p className="text-sm text-[#124C3B]">
              {success}
            </p>
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="mx-auto mt-10 max-w-3xl border border-[#DED8CC] bg-[#FFFDF8] p-6 sm:p-8">

            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl text-[#124C3B] sm:text-3xl">
                  {editingId
                    ? "Edit address"
                    : "Add new address"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6F756F]">
                  Enter the details exactly as you'd like
                  them to appear on your delivery.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close address form"
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[#6F756F] transition hover:bg-[#F7F3EC] hover:text-[#124C3B]"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              {/* Label */}
              <div>
                <label
                  htmlFor="label"
                  className="text-sm font-medium text-[#17211D]"
                >
                  Address label
                </label>

                <input
                  id="label"
                  name="label"
                  type="text"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="e.g. Home, School, Work"
                  required
                  className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                />
              </div>

              {/* Name + Phone */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-sm font-medium text-[#17211D]"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-[#17211D]"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    required
                    className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-[#17211D]"
                >
                  Street address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street name, area..."
                  rows={3}
                  required
                  className="mt-2 w-full resize-none border border-[#DED8CC] bg-[#FFFDF8] px-4 py-3 text-sm outline-none transition focus:border-[#124C3B]"
                />
              </div>

              {/* City + State */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-[#17211D]"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="text-sm font-medium text-[#17211D]"
                  >
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="mt-6">
                <label
                  htmlFor="country"
                  className="text-sm font-medium text-[#17211D]"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                />
              </div>

              {/* Default */}
              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-[#124C3B]"
                />

                <span>
                  <span className="block text-sm font-medium text-[#17211D]">
                    Make this my default address
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[#6F756F]">
                    Your default address can be used first during
                    checkout.
                  </span>
                </span>
              </label>

              {/* Form buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 bg-[#124C3B] px-6 text-sm font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:bg-[#9AA19C]"
                >
                  <Check size={17} />

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save changes"
                    : "Add address"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 border border-[#DED8CC] px-6 text-sm font-medium text-[#17211D] transition hover:border-[#124C3B]"
                >
                  <X size={17} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses */}
        <div className="mx-auto mt-10 max-w-5xl">

          {addresses.length === 0 && !showForm ? (
            <div className="border border-dashed border-[#CFC8BA] bg-[#FFFDF8] px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F7F3EC] text-[#124C3B]">
                <MapPin size={22} />
              </div>

              <h2 className="mt-5 text-2xl text-[#124C3B]">
                No saved addresses
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6F756F]">
                Add a delivery address to make your next
                Pageora order faster to complete.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-6 inline-flex items-center gap-2 bg-[#124C3B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30]"
              >
                <Plus size={17} />
                Add your first address
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {addresses.map((address) => (
                <article
                  key={address.id}
                  className={`border bg-[#FFFDF8] p-5 sm:p-6 ${
                    address.isDefault
                      ? "border-[#124C3B]"
                      : "border-[#DED8CC]"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl text-[#124C3B]">
                          {address.label}
                        </h2>

                        {address.isDefault && (
                          <span className="bg-[#EAF3EE] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#124C3B]">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    <MapPin
                      size={19}
                      className="shrink-0 text-[#6F756F]"
                    />
                  </div>

                  {/* Address information */}
                  <div className="mt-5 space-y-1 text-sm leading-6 text-[#17211D]">
                    <p className="font-medium">
                      {address.fullName}
                    </p>

                    <p>{address.phone}</p>

                    <p>{address.address}</p>

                    <p>
                      {address.city}, {address.state}
                    </p>

                    <p>{address.country}</p>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-4 border-t border-[#DED8CC] pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(address)
                      }
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#124C3B] transition hover:text-[#E86A2A]"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(address.id)
                      }
                      disabled={
                        deletingId === address.id
                      }
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#6F756F] transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {deletingId === address.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Addresses;