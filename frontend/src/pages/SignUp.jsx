import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import api from "../api/axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      const response = await api.post("/auth/register", formData);

      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      console.error("SIGN UP ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-6 py-12">
      <div className="w-full max-w-md">

        {/* Back */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#6F756F] transition hover:text-[#124C3B]"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#124C3B] text-white">
            <BookOpen size={22} />
          </div>

          <h1 className="font-serif text-4xl text-[#17211D]">
            Create your account
          </h1>

          <p className="mt-3 text-[#6F756F]">
            Join Pageora and discover your next great read.
          </p>
        </div>

        {/* Form */}
        <div className="border border-[#DED8CC] bg-[#FFFDF8] p-7 sm:p-8 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#17211D]"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-3xl border-[#DED8CC] bg-white px-4 py-3 outline-none transition focus:border-[#124C3B]  "
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#17211D]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                
                className="w-full border border-[#DED8CC] bg-white px-4 py-3 outline-none transition focus:border-[#124C3B] rounded-3xl"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#17211D]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border border-[#DED8CC] bg-white px-4 py-3 outline-none transition focus:border-[#124C3B] rounded-3xl"
              />

              <p className="mt-2 text-xs text-[#6F756F]">
                Use at least 6 characters.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#124C3B] py-3.5 font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:opacity-60 rounded-3xl"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-[#6F756F]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#124C3B] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUp;