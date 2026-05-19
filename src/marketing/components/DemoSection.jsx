import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { seedDemoUserData } from "@/utils/seedDemoUserData";

const DemoSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleTryDemo = async () => {
    setLoading(true);

    try {
      // Create a new anonymous Supabase user
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      const demoUser = data.user;

      // Using that new user's id to seed their budget and expenses
      await seedDemoUserData(demoUser.id);

      // Send user to the dashboard
      navigate("/layout-dash/dashboard");
    } catch (error) {
      console.error("Demo sign in error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white px-5 md:px-8 lg:px-20 py-24 flex items-center justify-center">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

        {/* Interactive Demo Header */}
        <p className="text-green-400 uppercase tracking-[0.3em] text-sm font-light mb-4">
          Interactive Demo
        </p>

        {/* Page Title */}
        <h1 className="text-4xl md:text-6xl font-thin mb-6">
          Try Trackify with sample data
        </h1>

        <p className="text-gray-300 text-base md:text-lg font-light leading-8 max-w-3xl mb-10">
          Want to see how Trackify actually works before creating an account?
          Start the demo to explore a ready-made dashboard filled with sample
          expenses, budgets, spending trends, and trip data. It gives you a full
          feel for the app without needing to enter your own information.
        </p>

        {/* Demo Includes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-12">
          <div className="border border-gray-800 bg-gray-950 rounded-2xl p-6">
            <h3 className="text-xl font-light mb-3">
              Logged Expenses
            </h3>

            <p className="text-gray-400 font-light leading-7">
              View sample expenses across categories like groceries, rent,
              transportation, eating out, subscriptions, and more.
            </p>
          </div>

          <div className="border border-gray-800 bg-gray-950 rounded-2xl p-6">
            <h3 className="text-xl font-light mb-3">
              Monthly Budgets
            </h3>

            <p className="text-gray-400 font-light leading-7">
              Explore sample budget limits and see how Trackify compares
              spending against each category and the total monthly budget.
            </p>
          </div>

          <div className="border border-gray-800 bg-gray-950 rounded-2xl p-6">
            <h3 className="text-xl font-light mb-3">
              Spending Insights
            </h3>

            <p className="text-gray-400 font-light leading-7">
              Check out charts, totals, progress bars, and monthly trends that
              help users understand where their money is going.
            </p>
          </div>

          <div className="border border-gray-800 bg-gray-950 rounded-2xl p-6">
            <h3 className="text-xl font-light mb-3">
              Trip Example
            </h3>

            <p className="text-gray-400 font-light leading-7">
              See how a trip can be created, budgeted, and connected to related
              expenses for easier travel spending management.
            </p>
          </div>

          <div className="border border-gray-800 bg-gray-950 rounded-2xl p-6">
            <h3 className="text-xl font-light mb-3">
              Budget Calculator
            </h3>

            <p className="text-gray-400 font-light leading-7">
              Test the calculator flow for breaking down income, expenses,
              savings, and remaining money.
            </p>
          </div>

          <div className="border border-gray-800 bg-gray-950 rounded-2xl p-6">
            <h3 className="text-xl font-light mb-3">
              No Signup Needed
            </h3>

            <p className="text-gray-400 font-light leading-7">
              The demo creates a temporary sample account so users can explore
              the app without using their own personal data.
            </p>
          </div>
        </div>

        {/* Start Demo */}
        <button
          onClick={handleTryDemo}
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded py-3 px-12 text-lg font-light"
        >
          {loading ? "Starting Demo..." : "Start Demo"}
        </button>

        <p className="text-gray-500 text-sm font-light mt-5 max-w-xl">
          The demo uses sample information only. You can click around, explore
          the dashboard, and see how Trackify behaves with realistic data.
        </p>
      </div>
    </section>
  );
};

export default DemoSection;