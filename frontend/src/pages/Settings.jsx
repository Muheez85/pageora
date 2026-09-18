import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  KeyRound,
  LogOut,
  X,
} from "lucide-react";

import api from "../api/axios";

const Settings = () => {
  const navigate = useNavigate();

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      await api.put(
        "/settings/password",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);

      setSuccess(
        "Your password has been changed successfully."
      );
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "We couldn't change your password."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

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
            <KeyRound
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <h1 className="mt-5 text-4xl text-[#124C3B] sm:text-5xl">
            Account settings
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6F756F] sm:text-base">
            Manage your password and account access.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-auto mt-6 max-w-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mx-auto mt-6 flex max-w-2xl items-center gap-2 border border-[#C9DDD3] bg-[#EDF6F1] px-4 py-3">
            <Check
              size={17}
              className="shrink-0 text-[#124C3B]"
            />

            <p className="text-sm text-[#124C3B]">
              {success}
            </p>
          </div>
        )}

        {/* Settings */}
        <div className="mx-auto mt-10 max-w-2xl">

          {/* Password */}
          <section className="border border-[#DED8CC] bg-[#FFFDF8]">
            <div className="flex items-start justify-between gap-5 p-6 sm:p-8">
              <div>
                <h2 className="text-2xl text-[#124C3B]">
                  Password
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6F756F]">
                  Change the password you use to sign in
                  to your Pageora account.
                </p>
              </div>

              {!showPasswordForm && (
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="shrink-0 text-sm font-medium text-[#124C3B] transition hover:text-[#E86A2A]"
                >
                  Change
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form
                onSubmit={handleChangePassword}
                className="border-t border-[#DED8CC] p-6 sm:p-8"
              >
                {/* Current password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="text-sm font-medium text-[#17211D]"
                  >
                    Current password
                  </label>

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={
                      formData.currentPassword
                    }
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                {/* New password */}
                <div className="mt-6">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-[#17211D]"
                  >
                    New password
                  </label>

                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={
                      formData.newPassword
                    }
                    onChange={handleChange}
                    minLength={8}
                    required
                    className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                  />

                  <p className="mt-2 text-xs text-[#6F756F]">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* Confirm */}
                <div className="mt-6">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-[#17211D]"
                  >
                    Confirm new password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    minLength={8}
                    required
                    className="mt-2 h-12 w-full border border-[#DED8CC] bg-[#FFFDF8] px-4 text-sm outline-none transition focus:border-[#124C3B]"
                  />
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex h-12 items-center justify-center gap-2 bg-[#124C3B] px-6 text-sm font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:bg-[#9AA19C]"
                  >
                    <Check size={17} />

                    {saving
                      ? "Changing password..."
                      : "Change password"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setFormData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setError("");
                    }}
                    disabled={saving}
                    className="inline-flex h-12 items-center justify-center gap-2 border border-[#DED8CC] px-6 text-sm font-medium text-[#17211D] transition hover:border-[#124C3B]"
                  >
                    <X size={17} />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Sign out */}
          <section className="mt-5 border border-[#DED8CC] bg-[#FFFDF8] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl text-[#124C3B]">
                  Sign out
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6F756F]">
                  Sign out of your Pageora account on this
                  device.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-11 items-center justify-center gap-2 border border-[#DED8CC] px-5 text-sm font-medium text-[#17211D] transition hover:border-red-300 hover:text-red-600"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;