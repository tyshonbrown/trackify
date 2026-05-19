import React from "react";
import LogoDash from "./LogoDash";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Profile Picture for Sidebar
  const [profilePicUrl, setProfilePicUrl] = useState("");

  useEffect(() => {
    getProfilePic();

    window.addEventListener("profilePicUpdated", getProfilePic);

    return () => {
      window.removeEventListener("profilePicUpdated", getProfilePic);
    };
  }, []);

  const getProfilePic = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("profile_pic_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile pic:", error.message);
      return;
    }

    setProfilePicUrl(data?.profile_pic_url || "");
  };

  // Sign Out
  const handleSignOut = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError.message);
      return;
    }

    // Check is user was a Demo user
    if (user?.is_anonymous) {

      // Delete demo user's expenses
      const { error: expenseError } = await supabase
        .from("expense")
        .delete()
        .eq("user_id", user.id);

      if (expenseError) {
        console.error("Error deleting demo expenses:", expenseError.message);
        return;
      }

      // Delete demo user's budget
      const { error: budgetError } = await supabase
        .from("budget")
        .delete()
        .eq("user_id", user.id);

      if (budgetError) {
        console.error("Error deleting demo budget:", budgetError.message);
        return;
      }

      // Delete demo user's profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) {
        console.error("Error deleting demo profile:", profileError.message);
        return;
      }

      // Delete demo user's trips
      const { error: tripsError } = await supabase
        .from("trips")
        .delete()
        .eq("user_id", user.id);

      if (tripsError) {
        console.error("Error deleting demo trips:", tripsError.message);
        return;
      }

      // Delete demo user's budget history
      const { error: historyError } = await supabase
        .from("budget_history")
        .delete()
        .eq("user_id", user.id);

      if (historyError) {
        console.error("Error deleting demo trips:", historyError.message);
        return;
      }

    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Error signing out:", signOutError.message);
      return;
    }

    // Go to Landing Page
    navigate("/");
  };

  // Sidebar Items and Icons
  const navItems = [
    { to: "/layout-dash/dashboard", icon: "bxs-dashboard", label: "Dashboard" },
    {
      to: "/layout-dash/budgets",
      icon: "bxs-wallet",
      label: "Budgets",
    },
    {
      to: "/layout-dash/expenses",
      icon: "bxs-dollar-circle",
      label: "Expenses",
    },
    { to: "/layout-dash/trips", icon: "bxs-plane-alt", label: "Trips" },
    {
      to: "/layout-dash/analytics",
      icon: "bxs-bar-chart-alt-2",
      label: "Analytics",
    },
    {
      to: "/layout-dash/calculator",
      icon: "bxs-calculator",
      label: "Calculator",
    },
  ];

  const accountActive = location.pathname === "/layout-dash/account";

  return (
    <div
      className="h-full w-60 bg-gray-900/40 backdrop-blur-xl border-r border-gray-800 
      flex flex-col shadow-xl"
    >
      {/* Top section with close button and logo */}
      <div className="flex items-center p-6 border-b border-gray-800">
        <button onClick={onClose} className="text-2xl p-3 transition md:hidden">
          <i className="bx bx-menu"></i>
        </button>
        <LogoDash />
      </div>

      {/* Navigation Links*/}
      <nav className="flex-1 mt-2 px-3 space-y-2 ">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white
                hover:bg-gray-800/60 transition-all duration-200 
                ${active ? "bg-gray-800 text-white font-medium" : ""}`}
            >
              <i className={`bx ${item.icon} text-xl`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Account section for desktop only */}
      <Link
        to="/layout-dash/account"
        onClick={onClose}
        className={`hidden md:flex items-center gap-3 p-4 border-t border-gray-800 
          text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all duration-200
          ${accountActive ? "bg-gray-800 text-white font-medium" : ""}`}
      >
        <img
          src={profilePicUrl || "/profile.jpg"}
          alt="User"
          className="w-10 h-10 rounded-full object-cover border border-gray-700"
        />
        <span className="text-sm">Account</span>
      </Link>


      {/* Signout */}
      <div className="p-5 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="text-red-400 hover:text-red-300 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
