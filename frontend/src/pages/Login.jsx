import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

      console.log("LOGIN SUCCESS:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
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
    <main className="min-h-screen bg-pageora-background px-5 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">

        {/* Back to home */}
        <Link
          to="/"
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-pageora-muted transition-colors hover:text-pageora-green"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pageora-green text-white shadow-sm">
            <BookOpen size={22} strokeWidth={1.8} />
          </div>

          <h1 className="mb-3 text-4xl text-pageora-text">
            Welcome back
          </h1>

          <p className="text-sm leading-6 text-pageora-muted">
            Sign in to continue your Pageora journey.
          </p>
        </div>

        {/* Login Card */}
        <div className="border border-pageora-border bg-pageora-surface p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

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
                className="mb-2 block text-sm font-medium text-pageora-text"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-pageora-border bg-white px-4 py-3 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-pageora-text"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-pageora-green transition hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-pageora-border bg-white px-4 py-3 text-sm text-pageora-text outline-none transition placeholder:text-pageora-muted focus:border-pageora-green focus:ring-2 focus:ring-pageora-green/10"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pageora-green py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#0e3f31] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign up */}
          <p className="mt-7 text-center text-sm text-pageora-muted">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-pageora-green transition hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs leading-5 text-pageora-muted">
          By signing in, you agree to Pageora's terms and privacy policy.
        </p>
      </div>
    </main>
  );
};

export default Login;