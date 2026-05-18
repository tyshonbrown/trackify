import React from "react";
import Step from "./Step";

const SetBudgetsSection = () => {
    return (
        <div className="py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Header */}
                <div>
                    <p className="text-sm text-green-400 tracking-widest mb-3">
                        BUDGET PLANNING
                    </p>

                    <h2 className="text-3xl md:text-5xl font-thin mb-5">
                        Set monthly budgets
                    </h2>

                    <p className="text-gray-300 font-light max-w-xl mb-8">
                        Create a monthly budget based on your income, bills, and spending
                        goals. Trackify uses this setup to help you see how much you have
                        spent against each limit throughout the month.
                    </p>

                    {/* Steps */}
                    <div className="space-y-6">
                        <Step
                            number="1"
                            title="Enter your monthly income"
                            text="Start by adding your monthly income so Trackify can compare your budget against the money you have coming in."
                        />

                        <Step
                            number="2"
                            title="Add your fixed monthly bills"
                            text="List recurring expenses like housing, transportation, internet, phone bills, credit cards, loans, and subscriptions."
                        />

                        <Step
                            number="3"
                            title="Set spending budgets"
                            text="Create limits for flexible categories like groceries, eating out, entertainment, shopping, and personal care."
                        />

                        <Step
                            number="4"
                            title="View and edit anytime"
                            text="After setup, go to the Budgets section to review your limits, update amounts, and track your progress."
                        />
                    </div>
                </div>

                {/* Visual to the right */}
                <div className="flex flex-col items-center lg:items-end gap-6">
                    <div className="w-full max-w-md border border-gray-800 rounded-2xl p-6 bg-gray-950">
                        <p className="text-sm text-gray-400 font-light mb-4">
                            Budget setup includes:
                        </p>

                        <div className="space-y-4">
                            <BudgetPreviewCard
                                title="Monthly Income"
                                items={["Income after taxes"]}
                            />

                            <BudgetPreviewCard
                                title="Monthly Bills"
                                items={[
                                    "Housing costs",
                                    "Transportation",
                                    "Internet & phone",
                                    "Credit cards",
                                    "Student & personal loans",
                                    "Subscriptions",
                                ]}
                            />

                            <BudgetPreviewCard
                                title="Spending Budgets"
                                items={[
                                    "Groceries",
                                    "Eating out",
                                    "Entertainment",
                                    "Shopping",
                                    "Personal care",
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BudgetPreviewCard = ({ title, items }) => {
    return (
        <div className="border border-gray-800 rounded-xl p-4 bg-black">
            <h3 className="text-lg font-light mb-3">{title}</h3>

            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <span
                        key={item}
                        className="text-xs text-gray-300 border border-gray-700 rounded-full px-3 py-1"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SetBudgetsSection;