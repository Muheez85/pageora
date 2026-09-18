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
    <main className="min-h-screen bg-[var(--pageora-background)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--pageora-muted)] hover:text-[var(--pageora-green)] transition mb-8"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Logo / heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--pageora-green)] text-white rounded-full mb-5">
            <BookOpen size={22} />
          </div>

          <h1 className="text-4xl text-[var(--pageora-text)] mb-3">
            Welcome back
          </h1>

          <p className="text-[var(--pageora-muted)]">
            Sign in to continue your Pageora journey.
          </p>
        </div>

        {/* Login form */}
        <div className="bg-[var(--pageora-surface)] border border-[var(--pageora-border)] p-7 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
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
                    className="w-full border border-[var(--pageora-border)] bg-white px-4 py-3 outline-none focus:border-[var(--pageora-green)] rounded-3xl transition"
                    />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-[var(--pageora-green)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

            <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-[var(--pageora-border)] bg-white px-4 py-3 outline-none focus:border-[var(--pageora-green)]  rounded-3xl transition"
                />
            </div>

            {/* Submit */}
         <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--pageora-green)] text-white py-3.5 font-medium hover:bg-[#0d3d30] transition disabled:opacity-60  rounded-3xl disabled:cursor-not-allowed"
            >
            {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign up */}
          <p className="text-center text-sm text-[var(--pageora-muted)] mt-7">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[var(--pageora-green)] font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--pageora-muted)] mt-6">
          By signing in, you agree to Pageora's terms and privacy policy.
        </p>
      </div>
    </main>
  );
};

export default Login;