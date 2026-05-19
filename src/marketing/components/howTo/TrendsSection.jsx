import React from "react";
import Step from "./Step";

const TrendsSection = () => {
    return (
        <div className="py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Header */}
                <div>
                    <p className="text-sm text-green-400 tracking-widest mb-3">
                        SPENDING INSIGHTS
                    </p>

                    <h2 className="text-3xl md:text-5xl font-thin mb-5">
                        Understand your habits
                    </h2>

                    <p className="text-gray-300 font-light max-w-xl mb-8">
                        View monthly spending trends, category breakdowns, and progress bars
                        to see where your money is going and how your spending compares to
                        your budget.
                    </p>

                    {/* Steps */}
                    <div className="space-y-6">
                        <Step
                            number="1"
                            title="Break down spending by category"
                            text="Use the Spending by Category pie chart to see how your expenses are split across each category."
                        />

                        <Step
                            number="2"
                            title="Compare spending against budgets"
                            text="View Spending vs Budget progress cards for each budget group to see how much of each budget has been used."
                        />

                        <Step
                            number="3"
                            title="Spot budget limits quickly"
                            text="Green bars show budgets that are still under the limit, while red bars show budgets that have been reached or overspent."
                        />

                        <Step
                            number="4"
                            title="Review monthly and yearly trends"
                            text="Use month navigation for category and budget trends, or year navigation to compare total spending across months."
                        />
                    </div>
                </div>

                {/* Visuals */}
                <div className="flex flex-col items-center lg:items-end gap-5">

                    {/* Spending by Category Visual*/}
                    <img
                        src="/Spending-by-category.png"
                        alt="Trackify spending by category pie chart"
                        className="w-full max-w-md h-auto object-contain rounded-2xl border border-gray-800"
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-md">
                        {/* Spending vs Budget Visual */}
                        <img
                            src="/Spending-vs-budget.png"
                            alt="Trackify spending vs budget progress cards"
                            className="w-full h-44 object-cover object-top rounded-2xl border border-gray-800"
                        />

                        {/* Monthly Spending Visual */}
                        <img
                            src="/Monthly-spending.png"
                            alt="Trackify monthly spending line graph"
                            className="w-full h-44 object-cover object-top rounded-2xl border border-gray-800"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendsSection;