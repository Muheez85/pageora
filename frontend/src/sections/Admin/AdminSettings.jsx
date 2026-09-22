import { useEffect, useState } from "react";
import {
  Save,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Loader2,
} from "lucide-react";

import {
  getAdminSettings,
  updateAdminSettings,
} from "../../services/adminSettingsService";

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    currency: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        const data = await getAdminSettings();

        if (data.success && data.settings) {
          setFormData({
            storeName: data.settings.storeName || "",
            email: data.settings.email || "",
            phone: data.settings.phone || "",
            address: data.settings.address || "",
            city: data.settings.city || "",
            state: data.settings.state || "",
            country: data.settings.country || "",
            currency: data.settings.currency || "",
            description: data.settings.description || "",
          });
        }
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load store settings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setSaving(true);

      const data = await updateAdminSettings(formData);

      if (data.success) {
        setMessage(
          data.message || "Store settings updated successfully"
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update store settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-400px flex items-center justify-center">
        <Loader2
          className="animate-spin"
          size={28}
          style={{ color: "var(--pageora-green)" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p
          className="text-sm font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--pageora-orange)" }}
        >
          System
        </p>

        <h1
          className="mt-2 text-3xl font-bold"
          style={{ color: "var(--pageora-green)" }}
        >
          Store Settings
        </h1>

        <p
          className="mt-2 max-w-2xl text-sm"
          style={{ color: "var(--pageora-muted)" }}
        >
          Manage the basic information and contact details
          used across your Pageora store.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: "#BFD8C9",
            backgroundColor: "#F2FAF5",
            color: "var(--pageora-green)",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: "#E7B7A5",
            backgroundColor: "#FFF4EF",
            color: "#A83E18",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            borderColor: "var(--pageora-border)",
            backgroundColor: "var(--pageora-surface)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "#EAF2EE",
                color: "var(--pageora-green)",
              }}
            >
              <Store size={20} />
            </div>

            <div>
              <h2
                className="font-semibold"
                style={{ color: "var(--pageora-text)" }}
              >
                Store Information
              </h2>

              <p
                className="mt-1 text-sm"
                style={{ color: "var(--pageora-muted)" }}
              >
                Basic information about your bookstore.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <InputField
              label="Store Name"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Pageora"
              required
            />

            <InputField
              label="Store Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@pageora.com"
            />

            <InputField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+234 800 000 0000"
            />

            <InputField
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              placeholder="NGN"
            />
          </div>

          <div className="mt-5">
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--pageora-text)" }}
            >
              Store Description
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3 top-3.5"
                style={{ color: "var(--pageora-muted)" }}
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="A short description about Pageora..."
                className="w-full resize-none rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2"
                style={{
                  borderColor: "var(--pageora-border)",
                  backgroundColor: "#FFFFFF",
                  color: "var(--pageora-text)",
                }}
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            borderColor: "var(--pageora-border)",
            backgroundColor: "var(--pageora-surface)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "#FFF0E8",
                color: "var(--pageora-orange)",
              }}
            >
              <MapPin size={20} />
            </div>

            <div>
              <h2
                className="font-semibold"
                style={{ color: "var(--pageora-text)" }}
              >
                Store Location
              </h2>

              <p
                className="mt-1 text-sm"
                style={{ color: "var(--pageora-muted)" }}
              >
                Where your bookstore is located.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <InputField
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Example Street"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Lagos"
              />

              <InputField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Lagos State"
              />

              <InputField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Nigeria"
              />
            </div>
          </div>
        </section>

        {/* Contact Preview */}
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            borderColor: "var(--pageora-border)",
            backgroundColor: "var(--pageora-surface)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "#EAF2EE",
                color: "var(--pageora-green)",
              }}
            >
              <Globe size={20} />
            </div>

            <div>
              <h2
                className="font-semibold"
                style={{ color: "var(--pageora-text)" }}
              >
                Contact Preview
              </h2>

              <p
                className="mt-1 text-sm"
                style={{ color: "var(--pageora-muted)" }}
              >
                This is how your basic store contact information
                currently looks.
              </p>
            </div>
          </div>

          <div
            className="mt-6 grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
            style={{
              borderColor: "var(--pageora-border)",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div className="flex items-center gap-3">
              <Mail
                size={18}
                style={{ color: "var(--pageora-orange)" }}
              />

              <div className="min-w-0">
                <p
                  className="text-xs"
                  style={{ color: "var(--pageora-muted)" }}
                >
                  Email
                </p>

                <p
                  className="truncate text-sm font-medium"
                  style={{ color: "var(--pageora-text)" }}
                >
                  {formData.email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone
                size={18}
                style={{ color: "var(--pageora-orange)" }}
              />

              <div className="min-w-0">
                <p
                  className="text-xs"
                  style={{ color: "var(--pageora-muted)" }}
                >
                  Phone
                </p>

                <p
                  className="truncate text-sm font-medium"
                  style={{ color: "var(--pageora-text)" }}
                >
                  {formData.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "var(--pageora-green)",
            }}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium"
        style={{ color: "var(--pageora-text)" }}
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
        style={{
          borderColor: "var(--pageora-border)",
          backgroundColor: "#FFFFFF",
          color: "var(--pageora-text)",
        }}
      />
    </div>
  );
};

export default AdminSettings;