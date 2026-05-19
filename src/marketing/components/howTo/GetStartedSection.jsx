import React from 'react';
import Step from './Step';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { seedDemoUserData } from '@/utils/seedDemoUserData';

const GetStartedSection = () => {
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
        <div className="min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-thin mb-4">
                    Getting Started
                </h1>

                <p className="text-gray-300 font-light max-w-2xl mx-auto">
                    Start fresh by creating your own account, or explore Trackify instantly
                    with a demo account filled with sample data.
                </p>
            </div>

            {/* Two Paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Create Account Option */}
                <div className="border border-gray-800 rounded-2xl p-6 md:p-8 bg-gray-950">
                    <p className="text-sm text-green-500 tracking-widest mb-3">
                        OPTION 1
                    </p>

                    <h2 className="text-2xl md:text-3xl font-light mb-4">
                        Create your own account
                    </h2>

                    <p className="text-gray-400 font-light mb-8">
                        Set up Trackify with your real income, expenses, and personal
                        budgets so your dashboard reflects your own spending habits.
                    </p>

                    <div className="space-y-6">
                        <Step
                            number="1"
                            title="Create your login"
                            text="Sign up with your account information to get started."
                        />

                        <Step
                            number="2"
                            title="Set up your budget"
                            text="Enter your monthly income, fixed expenses, and spending budgets."
                        />

                        <Step
                            number="3"
                            title="Add a profile picture"
                            text="Upload a profile photo, or skip this step and add one later."
                        />

                        <Step
                            number="4"
                            title="Go to your dashboard"
                            text="After setup, Trackify takes you straight to your dashboard."
                        />
                    </div>

                    <Link
                        to="/signup"
                        className="inline-block mt-8 bg-green-700 hover:bg-green-800 transition-colors rounded-lg px-6 py-3"
                    >
                        Create Account
                    </Link>
                </div>

                {/* Demo Option */}
                <div className="border border-gray-800 rounded-2xl p-6 md:p-8 bg-gray-950">
                    <p className="text-sm text-blue-400 tracking-widest mb-3">
                        OPTION 2
                    </p>

                    <h2 className="text-2xl md:text-3xl font-light mb-4">
                        Try the demo
                    </h2>

                    <p className="text-gray-400 font-light mb-8">
                        Explore Trackify without starting from scratch. The demo includes
                        sample expenses, budgets, trips, and dashboard data.
                    </p>

                    <div className="space-y-6">
                        <Step
                            number="1"
                            title="Start the demo"
                            text="Click the demo option from the landing page to enter a sample account."
                        />

                        <Step
                            number="2"
                            title="Explore pre-filled data"
                            text="View sample budgets, expenses, charts, trips, and spending insights."
                        />

                        <Step
                            number="3"
                            title="Make changes"
                            text="Add, edit, or remove demo data to see how Trackify updates in real time."
                        />

                        <Step
                            number="4"
                            title="See how it works together"
                            text="Use the demo dashboard to understand the full app experience."
                        />
                    </div>

                    {/* Try Demo */}
                    <button
                        onClick={handleTryDemo}
                        disabled={loading}
                        className="inline-block mt-8 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-colors rounded-lg px-6 py-3"
                    >
                        {loading ? "Starting Demo..." : "Start Demo"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GetStartedSection