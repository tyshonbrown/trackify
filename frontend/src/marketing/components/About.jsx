import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white px-5 md:px-8 lg:px-10 py-24">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* About Trackify Header */}
        <section>
          <h1 className="text-4xl md:text-6xl font-thin mb-6">About Trackify</h1>

          <p className="text-gray-300 text-base md:text-lg font-light leading-8 max-w-3xl">
            Trackify is a personal finance web application designed to help users
            understand their spending, manage monthly budgets, and make smarter
            financial decisions. The app gives users a simple way to log expenses,
            review spending habits, track progress toward budgets, and organize
            trip-related expenses in one place.
          </p>
        </section>

        {/* App Purpose Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-thin mb-5">
            App Purpose
          </h2>

          <p className="text-gray-400 text-base md:text-lg font-light leading-8">
            The purpose of Trackify is to make budgeting feel more visual,
            organized, and approachable. Instead of only recording numbers, users
            can see how their spending changes over time, compare expenses across
            categories, and better understand where their money is going each
            month.
          </p>
        </section>

        {/* Core Features Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-thin mb-8">
            Core Features
          </h2>

          {/* Expense Logging Feature*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950">
              <h3 className="text-xl font-light mb-3">Expense Logging</h3>
              <p className="text-gray-400 font-light leading-7">
                Users can add, edit, delete, and organize expenses by category,
                date, and optional trip.
              </p>
            </div>

            {/* Monthly Budgets Feature */}
            <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950">
              <h3 className="text-xl font-light mb-3">Monthly Budgets</h3>
              <p className="text-gray-400 font-light leading-7">
                Users can set monthly budgets and track how much they have spent
                toward each category and their overall budget.
              </p>
            </div>

            {/* Spending Trends Feature */}
            <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950">
              <h3 className="text-xl font-light mb-3">Spending Trends</h3>
              <p className="text-gray-400 font-light leading-7">
                Trackify displays spending trends through visual charts, helping
                users compare monthly spending and identify patterns.
              </p>
            </div>

            {/* Calculator Feature */}
            <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950">
              <h3 className="text-xl font-light mb-3">Budget Calculator</h3>
              <p className="text-gray-400 font-light leading-7">
                The calculator helps users break down income, expenses, savings,
                and remaining spending money.
              </p>
            </div>

            {/* Trip Planning Feature */}
            <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950 md:col-span-2">
              <h3 className="text-xl font-light mb-3">Trip Planning</h3>
              <p className="text-gray-400 font-light leading-7">
                Users can create trips, set trip budgets, attach expenses to each
                trip, and monitor how much they have spent while planning or
                traveling.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-thin mb-5">
            Tech Stack
          </h2>

          <p className="text-gray-400 text-base md:text-lg font-light leading-8 mb-6">
            Trackify was built using modern frontend tools with a Supabase backend
            for authentication, database storage, and user data management.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="border border-gray-700 rounded-full px-5 py-2 text-gray-300 font-light">
              React
            </span>

            <span className="border border-gray-700 rounded-full px-5 py-2 text-gray-300 font-light">
              Tailwind CSS
            </span>

            <span className="border border-gray-700 rounded-full px-5 py-2 text-gray-300 font-light">
              Supabase
            </span>

            <span className="border border-gray-700 rounded-full px-5 py-2 text-gray-300 font-light">
              JavaScript
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
