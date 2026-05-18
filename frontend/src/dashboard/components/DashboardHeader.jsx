import React from "react";
import LogoDash from "./LogoDash";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  return (
    <div>
      <header
        className="fixed top-0 left-0 w-full flex justify-between items-center py-4 px-4 lg:px-20
  bg-black bg-opacity-15 backdrop-blur-md z-50 transition-colors duration-500"
      >
        <LogoDash />

        <div className="flex flex-col items-center space-y-2">
          <img
            src="/profile-placeholder.png"
            alt="Profile"
            className="w-20 h-20 rounded-full border border-gray-300"
          />

          <Link
            to="account"
            className="text-green-300 hover:text-green-500 text-sm"
          >
            Account
          </Link>
        </div>
      </header>
    </div>
  );
};

export default DashboardHeader;
