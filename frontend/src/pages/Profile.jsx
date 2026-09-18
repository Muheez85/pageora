import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Edit3,
  User,
  X,
} from "lucide-react";

import api from "../api/axios";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("GET PROFILE ERROR:", error);

        setError(
          error.response?.data?.message ||
            "We couldn't load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleEdit = (field) => {
    setEditing(field);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditing(null);
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/users/profile",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      setEditing(null);

      setSuccess(
        "Your information has been updated successfully."
      );
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "We couldn't update your information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading your information...
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
            <User
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <h1 className="mt-5 text-4xl text-[#124C3B] sm:text-5xl">
            Personal information
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6F756F] sm:text-base">
            Manage the personal information associated
            with your Pageora account.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mx-auto mt-10 max-w-2xl border border-[#DED8CC] bg-[#FFFDF8]">

          {/* Name */}
          <div className="border-b border-[#DED8CC] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-5">

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6F756F]">
                  Full name
                </p>

                {editing === "name" ? (
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                    className="mt-3 h-12 w-full border border-[#124C3B] bg-[#FFFDF8] px-4 text-sm text-[#17211D] outline-none"
                  />
                ) : (
                  <p className="mt-3 break-words text-base font-medium text-[#17211D]">
                    {formData.name}
                  </p>
                )}
              </div>

              {editing !== "name" && (
                <button
                  type="button"
                  onClick={() => handleEdit("name")}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#124C3B] transition hover:text-[#E86A2A]"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              )}
            </div>

            {editing === "name" && (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#124C3B] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:bg-[#9AA19C]"
                >
                  <Check size={16} />
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center gap-2 border border-[#DED8CC] px-5 py-2.5 text-sm font-medium text-[#17211D] transition hover:border-[#124C3B]"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-5">

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6F756F]">
                  Email address
                </p>

                {editing === "email" ? (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoFocus
                    className="mt-3 h-12 w-full border border-[#124C3B] bg-[#FFFDF8] px-4 text-sm text-[#17211D] outline-none"
                  />
                ) : (
                  <p className="mt-3 break-all text-base font-medium text-[#17211D]">
                    {formData.email}
                  </p>
                )}
              </div>

              {editing !== "email" && (
                <button
                  type="button"
                  onClick={() => handleEdit("email")}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#124C3B] transition hover:text-[#E86A2A]"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              )}
            </div>

            {editing === "email" && (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#124C3B] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:bg-[#9AA19C]"
                >
                  <Check size={16} />
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center gap-2 border border-[#DED8CC] px-5 py-2.5 text-sm font-medium text-[#17211D] transition hover:border-[#124C3B]"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-6 border border-red-200 bg-red-50 px-4 py-3 sm:mx-8">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mx-6 mb-6 flex items-center gap-2 border border-[#C9DDD3] bg-[#EDF6F1] px-4 py-3 sm:mx-8">
              <Check
                size={17}
                className="shrink-0 text-[#124C3B]"
              />

              <p className="text-sm text-[#124C3B]">
                {success}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;