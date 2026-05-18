import { Link, useNavigate } from "react-router-dom";
import LogoLanding from "@/marketing/components/LogoLanding";
import { useState } from "react";
import { supabase } from "../../supabaseClient";

const Login = () => {
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handling user login with Supabase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Attempt sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Handling wuthentication error
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // finished loading
    setLoading(false);

    // Successful Login
    navigate("/layout-dash/dashboard");
  };

  return (
    <div className="py-4 px-4 lg:px-20">
      {/* Logo */}
      <div>
        <LogoLanding />
      </div>

      {/* Back Button to Landing */}
      <div className="text-lg mt-5 text-white">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-gray-300 transition-colors"
        >
          <i class="bx bx-chevron-left"></i>
          Home
        </Link>
      </div>

      {/* Login Content */}
      <div className="flex-grow text-black flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Login
          </h2>

          {/* Form calls handleLogin on submit */}
          <form className="space-y-6" onSubmit={handleLogin}>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
              focus:ring-indigo-500 focus:border-indigo-500 outline-none 
              transition duration-150 ease-in-out"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
              focus:ring-indigo-500 focus:border-indigo-500 outline-none 
              transition duration-150 ease-in-out"
              />
            </div>

            {/* Submit button with possible error message displayed on top */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-700 hover:bg-indigo-800 
          text-white font-semibold rounded-lg transition duration-200"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <br />

          {/* Option to Signup */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
