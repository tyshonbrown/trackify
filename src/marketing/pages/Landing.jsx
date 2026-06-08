import React from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { seedDemoUserData } from "@/utils/seedDemoUserData";
import { useState } from "react";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { supabase } from "@/supabaseClient";

const Landing = () => {

  const navigate = useNavigate();

  // Allows down arrow to the next section
  const section2Ref = useRef(null);
  const [loading, setLoading] = useState(false);

  // Smooth transition to next section
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Try Demo
  const handleTryDemo = async () => {
    setLoading(true);

    try {
      // Create a new anonymous Supabase user
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      const demoUser = data.user;

      // Use that new user's id to seed their budget and expenses
      await seedDemoUserData(demoUser.id);

      // Send them to the dashboard
      navigate("/layout-dash/dashboard");

    } catch (error) {
      console.error("Demo sign in error:", error.message);

    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <div
        className="relative h-screen w-full overflow-hidden flex flex-col
        items-center justify-between"
      >
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/tech-finance-video.mp4"
          autoPlay
          loop
          muted
        />

        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-5" />

        {/* Introduction Text */}
        <div
          className="relative z-10 flex flex-col m:left-0 items-center justify-center 
        h-full ml-[5%]"
        >
          <h1
            className="left=0 text-gray-300 text-4xl md:text-5xl lg:text-6xl 
          font-semibold tracking-wider mb-6"
          >
            TRACK YOUR MONEY.
            <br />
            SIMPLIFY YOUR LIFE.
          </h1>
          <p
            className="text-base font-light text-gray-300 max-w-[32rem] 
          lg:max-w-[40rem] sm:text-lg leading-relaxed tracking-wider"
          >
            Trackify helps you take control of your finances with clean
            insights, powerful budgeting tools, and an intuitive dashboard that
            makes managing expenses effortless.
          </p>

          {/* Learn More & Demo BUTTONS */}
          <div className="flex gap-4 mt-10 left-0">
            <Link
              to="/about"
              className="border border-[#2a2a2a] py-2
            sm:py-3 px-4 sm:px-5 rounded-full sm:text-lg text-sm font-semibold
            tracking-wider transition-all duration-300
            hover:bg-[#1a1a1a]"
            >
              Learn More
            </Link>

            <Link to="/demo-section" className="border border-[#2a2a2a] py-2
            sm:py-3 px-8 sm:px-10 rounded-full sm:text-lg text-sm font-semibold
            tracking-wider transition-all duration-300
            hover:bg-[#1a1a1a] bg-gray-300 text-black 
            hover:text-white">
              Demo
            </Link>
          </div>
        </div>

        {/* Down Arrow to Next Section */}
        <button
          onClick={() => scrollToSection(section2Ref)}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 
               animate-bounce text-white hover:text-gray-300 transition-colors z-20"
        >
          <i className="bx bx-chevrons-down text-4xl"></i>
        </button>
        <div className="absolute bottom-[-8rem] left-0 w-full h-60 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none" />
      </div>


      {/* Visual Element Section -------------------------------------------------------------------- */}
      <section
        ref={section2Ref}
        className="min-h-screen flex justify-center items-center bg-black text-white px-5 md:px-8 py-20 md:py-0 relative"
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full max-w-7xl">

          {/* Text Left */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-thin mb-4 md:mb-6">
              Simple Dashboard Overview
            </h2>

            <p className="text-base sm:text-lg md:text-lg font-light text-gray-300 leading-relaxed max-w-xl mx-auto md:mx-0">
              Get a quick look at this month’s income, where you are with spending,
              your recent expenses, and a breakdown of spending by category. The
              dashboard also gives you quick actions to add expenses, add extra
              income, view or edit budgets, and track your spending trends.
            </p>
          </div>

          {/* Dashboard Visual to the Right */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img
              src="/Dashboard-Screenshot.png"
              className="w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[45vh] md:max-h-[75vh] object-contain rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Overview Section ------------------------------------------------------------------*/}
      <section
        className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-5 md:px-8 py-20 relative"
      >
        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-thin mb-4 md:mb-6">
              Quick Overview
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-light max-w-2xl mx-auto">
              A quick look at the core tools that help users manage their spending,
              budgets, trends, and trip expenses.
            </p>
          </div>

          {/* Cards */}
          <div className="w-full overflow-x-auto pb-4">
            <div className="grid grid-cols-4 gap-6 min-w-[1100px]">

              {/* Log Expenses */}
              <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden transition-colors">
                <img
                  src="/Log-Expenses.png"
                  alt="Log Expenses screenshot"
                  className="w-full h-48 object-contain bg-black"
                />

                <div className="p-5">
                  <h3 className="text-xl font-light mb-3">Log Expenses</h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    Quickly add expenses with details like amount, category, date, and
                    notes so spending stays organized and easy to review.
                  </p>
                </div>
              </div>

              {/* Set Budgets */}
              <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden transition-colors">
                <img
                  src="/Set-Budgets.png"
                  alt="Set Budgets screenshot"
                  className="w-full h-48 object-contain bg-black"
                />

                <div className="p-5">
                  <h3 className="text-xl font-light mb-3">Set Budgets</h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    Create and edit monthly budgets by category to stay aware of limits
                    and track how much is left to spend.
                  </p>
                </div>
              </div>

              {/* Track Trends */}
              <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden transition-colors">
                <img
                  src="/Track-Trends.png"
                  alt="Track Trends screenshot"
                  className="w-full h-48 object-contain bg-black"
                />

                <div className="p-5">
                  <h3 className="text-xl font-light mb-3">Track Trends</h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    View spending patterns over time with charts that make it easier to
                    understand habits, compare months, and spot changes.
                  </p>
                </div>
              </div>

              {/* Trip Planning */}
              <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden transition-colors">
                <img
                  src="/Trip-Planning.png"
                  alt="Trip Planning screenshot"
                  className="w-full h-48 object-contain bg-black"
                />

                <div className="p-5">
                  <h3 className="text-xl font-light mb-3">Trip Planning</h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    Plan trips with a set budget, track trip-related expenses, and see
                    how much has been spent while traveling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section --------------------------------------------------------------------- */}
      <section
        className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-5 md:px-8 py-20 relative"
      >
        <div className="relative z-10 w-full max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-thin mb-6">
            Take Control of Your Spending
          </h2>

          <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">
            Trackify brings your expenses, budgets, trends, and trip planning together
            in one simple dashboard, making it easier to understand your money and
            stay on top of your goals.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">

            {/* Try Demo */}
            <button
              onClick={handleTryDemo}
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 transition-colors rounded-lg px-8 py-3 text-white"
            >
              Try Demo
            </button>

            {/* Signup */}
            <button
              onClick={() => navigate("/signup")}
              className="border border-gray-700 hover:border-green-700 transition-colors rounded-lg px-8 py-3 text-white"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      <Footer />

    </>
  );
};

export default Landing;
