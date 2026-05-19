import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoLanding from "@/marketing/components/LogoLanding";
import { supabase } from "../../supabaseClient";

const Signup = () => {
  const navigate = useNavigate();

  // Form 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handling user signup with Supabase Auth
  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    const trimmedEmail = email.trim().toLowerCase();

    // Check if passwords match
    if (password != confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Block emails ending with @email.com
    if (trimmedEmail.endsWith("@email.com")) {
      setError("Please enter a valid email address. @email.com is not allowed.");
      return;
    }

    setLoading(true);

    // Attempt to create an account
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    // Handling authentication error
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Successfull Signup
    navigate("/budget-setup");
  };

  return (
    <div className="py-4 px-4 lg:px-20">

      {/* Logo */}
      <div>
        <LogoLanding />
      </div>

      {/* Back Button  to Landing Page */}
      <div className="text-lg mt-5 text-white">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-gray-300 transition-colors"
        >
          <i className="bx bx-chevron-left"></i>
          Home
        </Link>
      </div>

      {/* Signup Form */}
      <div className="flex-grow text-black flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Create an account
          </h2>

          <form className="space-y-6" onSubmit={handleSignup}>

            {/* First & Last Name Input*/}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Create Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
              focus:ring-indigo-500 focus:border-indigo-500 outline-none 
              transition duration-150 ease-in-out"
              />
            </div>

            {/* Confirm Password */}
            <div className="transition-all duration-200 ease-in-out">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-700 hover:bg-indigo-800 
          text-white font-semibold rounded-lg transition duration-200"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          <br />

          {/* Link to Login Page if needed */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
