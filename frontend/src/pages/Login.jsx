import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";

import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-var(--pageora-background) flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Back to home */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-var(--pageora-muted) transition hover:text-var(--pageora-green)"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Logo / Heading */}
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-var(--pageora-green) text-white">
            <BookOpen size={22} />
          </div>

          <h1 className="mb-3 text-4xl text-var(--pageora-text)">
            Welcome back
          </h1>

          <p className="text-var(--pageora-muted)">
            Sign in to continue your Pageora journey.
          </p>
        </div>

        {/* Login Card */}
        <div className="border border-var(--pageora-border) bg-var(--pageora-surface) p-7 sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Error */}
            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-3xl border border-var(--pageora-border) bg-white px-4 py-3 outline-none transition focus:border-var(--pageora-green)"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-var(--pageora-green) hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-var(--pageora-border) bg-white px-4 py-3 pr-12 outline-none transition focus:border-var(--pageora-green)"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-var(--pageora-muted) transition hover:text-var(--pageora-green)"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-var(--pageora-green) py-3.5 font-medium text-white transition hover:bg-[#0d3d30] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign Up */}
          <p className="mt-7 text-center text-sm text-var(--pageora-muted)">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-var(--pageora-green) hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-var(--pageora-muted)">
          By signing in, you agree to Pageora's terms and
          privacy policy.
        </p>
      </div>
    </main>
  );
};

export default Login;