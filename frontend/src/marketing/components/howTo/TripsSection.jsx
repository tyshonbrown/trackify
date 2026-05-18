import React from "react";
import Step from "./Step";

const TripsSection = () => {
    return (
        <div className="py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Header */}
                <div>
                    <p className="text-sm text-green-400 tracking-widest mb-3">
                        TRIP PLANNING
                    </p>

                    <h2 className="text-3xl md:text-5xl font-thin mb-5">
                        Plan trips without overspending
                    </h2>

                    <p className="text-gray-300 font-light max-w-xl mb-8">
                        Create trips, attach related expenses, and monitor how much you have
                        spent toward each trip budget.
                    </p>

                    {/* Steps */}
                    <div className="space-y-6">
                        <Step
                            number="1"
                            title="Create a new trip"
                            text="Add the trip name, location, start date, end date, budget, theme color, and any notes you want to remember."
                        />

                        <Step
                            number="2"
                            title="Customize the trip card"
                            text="Choose a color theme so each trip is easy to recognize in your trip list."
                        />

                        <Step
                            number="3"
                            title="Attach expenses"
                            text="Add an expense to a trip when creating it, or hover over an existing expense and click the plane icon to connect it later."
                        />

                        <Step
                            number="4"
                            title="Track the trip budget"
                            text="Open a trip to view its details, related expenses, and how much has been spent so far."
                        />
                    </div>
                </div>

                {/* Trip Info Visual */}
                <div className="flex flex-col items-center lg:items-end gap-5">
                   
                    <img
                        src="/View-trip.png"
                        alt="Trackify trip details and trip budget view"
                        className="w-full max-w-xl h-auto object-contain rounded-2xl border border-gray-800"
                    />
                </div>
            </div>
        </div>
    );
};

export default TripsSection;