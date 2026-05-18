import React from 'react';
import { Link } from 'react-router-dom';
import LogoLanding from './LogoLanding';

const Footer = () => {
    return (
        <footer className="bg-black text-white border-t border-gray-900 px-5 md:px-8 lg:px-20 py-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Logo / Brand */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <LogoLanding />

                    <p className="text-sm text-gray-400 font-light mt-3 max-w-sm">
                        Track your money, understand your spending, and stay on top of your goals.
                    </p>
                </div>

                {/* Footer Links */}
                <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm tracking-wider">
                    <Link
                        to="/about"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        ABOUT
                    </Link>

                    <Link
                        to="/how-to"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        HOW TO
                    </Link>

                    <Link
                        to="/demo-section"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        DEMO
                    </Link>

                    <Link
                        to="/login"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        LOGIN
                    </Link>
                </nav>
            </div>

            {/* Full-width divider */}
            <div className="-mx-5 md:-mx-8 lg:-mx-20 mt-8 border-t border-gray-900" />

            {/* Bottom Row */}
            <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Trackify. All rights reserved.</p>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="hover:text-gray-300 transition-colors"
                >
                    Back to top ↑
                </button>
            </div>
        </footer>
    );
};

export default Footer;