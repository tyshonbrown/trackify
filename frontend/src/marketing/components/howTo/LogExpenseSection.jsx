import Step from "./Step";

const LogExpensesSection = () => {
    return (
        <div className="py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Header */}
                <div>
                    <p className="text-sm text-green-400 tracking-widest mb-3">
                        EXPENSE TRACKING
                    </p>

                    <h2 className="text-3xl md:text-5xl font-thin mb-5">
                        Log your spending
                    </h2>

                    <p className="text-gray-300 font-light max-w-xl mb-8">
                        Add expenses by amount, date, category, and optional trip so your
                        dashboard, budgets, and spending insights stay accurate.
                    </p>

                    {/* Steps */}
                    <div className="space-y-6">
                        <Step
                            number="1"
                            title="Add the expense details"
                            text="Enter the amount, date, category, and a short description for the purchase."
                        />

                        <Step
                            number="2"
                            title="Choose where it belongs"
                            text="Assign the expense to a spending category so Trackify can organize it correctly."
                        />

                        <Step
                            number="3"
                            title="Attach it to a trip"
                            text="If the expense is travel-related, you can connect it to one of your trips."
                        />

                        <Step
                            number="4"
                            title="Edit or delete anytime"
                            text="Hover over an expense to quickly edit, add it to a trip, or delete it."
                        />
                    </div>
                </div>

                {/* Visuals to the right */}
                <div className="flex flex-col items-center lg:items-end gap-6">

                    {/* Form Visual */}
                    <img
                        src="/Log-Expenses.png"
                        alt="Trackify add expense form"
                        className="w-full max-w-sm h-auto object-contain rounded-2xl border border-gray-800"
                    />

                    {/* Expense Options Visual */}
                    <div className="w-full max-w-sm flex flex-col items-center">
                        <p className="text-sm text-gray-400 font-light mb-3 text-center max-w-sm">
                            Hover over an expense to quickly edit it, attach it to a trip, or delete it.
                        </p>

                        <img
                            src="/Expense-Options.png"
                            alt="Trackify expense edit, trip, and delete options"
                            className="w-20 h-auto object-contain rounded-2xl border border-gray-800"
                        />
                    </div>
                </div>
            </div>

        </div>

    );
};

export default LogExpensesSection;