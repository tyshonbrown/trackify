import React from "react";
import Sidebar from "@/dashboard/components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import LogoDash from "@/dashboard/components/LogoDash";

const DashLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

          {/* Account*/}
          <div className="flex flex-col items-center gap-1 pr-4">
            <img
              src="/profile.jpg"
              alt="User"
              className="w-14 h-14 rounded-full border border-gray-700"
            />
            <span>Account</span>
          </div>
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
