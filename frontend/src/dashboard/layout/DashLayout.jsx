import React from "react";
import Sidebar from "@/dashboard/components/Sidebar";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import LogoDash from "@/dashboard/components/LogoDash";
import { supabase } from "@/supabaseClient";

const DashLayout = () => {

  // Sidebar for smaller windows
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [profilePicUrl, setProfilePicUrl] = useState("");

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

  useEffect(() => {
    getProfilePic();

    window.addEventListener("profilePicUpdated", getProfilePic);

    return () => {
      window.removeEventListener("profilePicUpdated", getProfilePic);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex h-screen bg-black text-white overflow-hidden">

      {/* Overlay (blurs out background when sidebar is open) */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
        ></div>
      )}

      {/* Sidebar - slides OVER the content */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static`}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Top bar */}
        <header className="md:hidden flex items-center justify-between p-4 bg-black backdrop-blur-lg z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="text-2xl p-2 rounded-lg transition md:hidden"
            >
              <i className="bx bx-menu"></i>
            </button>

            {/* Mobile logo ONLY */}
            <div className="md:hidden">
              <LogoDash />
            </div>
          </div>

          {/* Account */}
          <Link
            to="/layout-dash/account"
            className="flex flex-col items-center gap-1 pr-4 text-gray-300 hover:text-white transition"
          >
            <img
              src={profilePicUrl || "/profile.jpg"}
              alt="User"
              className="w-14 h-14 rounded-full object-cover border border-gray-700"
            />

            <span className="text-sm">Account</span>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
