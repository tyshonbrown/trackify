import React from "react";
import "boxicons/css/boxicons.min.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import About from "./About";
import DemoSection from "./DemoSection";
import HowTo from "./howTo/HowTo";
import Landing from "@/marketing/pages/Landing";
import LogoLanding from "./LogoLanding";

const LandingHeader = () => {
  // Mobile menu false by default (closed)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Mobile menu closed when window size is large enough
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <header
        className="fixed top-0 left-0 w-full flex justify-between items-center py-2 px-4 lg:px-20
        bg-black/20 backdrop-blur-md z-50 transition-colors duration-500"
      >
        <LogoLanding />

        {/* NAVIGATOR */}
        <nav className="hidden md:flex items-center gap-12">
          <Link
            to="/about"
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            ABOUT
          </Link>
          <Link
            to="/how-to"
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            HOW TO
          </Link>
          <Link
            to="/demo-section"
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            DEMO
          </Link>

        </nav>

        <div className="flex flex-row">
          <Link
            to="/login"
            className="hidden md:block text-white py-3 px-6 rounded-full border-none font-medium
            transition-all duration-500 hover:bg-gray cursor-pointer z-50"
          >
            LOGIN
          </Link>

          <Link
            to="/signup"
            className="hidden md:block bg-[#d4d4d4] text-black py-3 px-8 rounded-full border-none font-medium
            transition-all duration-500 hover:bg-white cursor-pointer z-50"
          >
            SIGNUP
          </Link>
        </div>

        {/* MENU BUTTON (MOBILE ONLY) */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-5xl p-2 z-50"
        >
          <i className={`bx ${isMobileMenuOpen ? "bx-x" : "bx-menu"}`}></i>
        </button>
      </header>

      {/* Menu Open (MOBILE ONLY) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 md:hidden z-40">
          {/* Clickable outside area */}
          <div
            className="absolute inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Actual menu */}
          <div
            className="absolute top-16 left-0 right-0 bg-black/75 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-6 items-center p-5 pt-8 pb-8">
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base tracking-wider transition-all hover:text-gray-300
                hover:-translate-y-1 hover:scale-[1.02] duration-200"
              >
                ABOUT
              </Link>

              <Link
                to="/how-to"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base tracking-wider transition-all hover:text-gray-300
                hover:-translate-y-1 hover:scale-[1.02] duration-200"
              >
                HOW TO
              </Link>

              <Link
                to="/demo-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base tracking-wider transition-all hover:text-gray-300
                hover:-translate-y-1 hover:scale-[1.02] duration-200"
              >
                DEMO
              </Link>

              <div className="flex flex-row gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-black text-white py-3 px-8 rounded-full font-medium transition-all hover:bg-grey
                  hover:-translate-y-1 hover:scale-[1.02] duration-200"
                >
                  LOGIN
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#d4d4d4] text-black py-3 px-8 rounded-full font-medium transition-all hover:bg-white
                  hover:-translate-y-1 hover:scale-[1.02] duration-200"
                >
                  SIGNUP
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingHeader;
