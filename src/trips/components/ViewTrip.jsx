import { supabase } from '@/supabaseClient';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

// This is shown when a Trip Card is clicked on to display the trips information
const ViewTrip = ({ trip, type, formatDate, daysLeft, onClose }) => {
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [totalSpent, setTotalSpent] = useState(Number(trip.total_spent) || 0);

    // Expense Search and Sort
    const [searchExpense, setSearchExpense] = useState("");
    const [sortOption, setSortOption] = useState("date-new");
    const [expenseToRemove, setExpensesToRemove] = useState(null)

    // Fetch expenses connected to the trip
    const fetchExpenses = async () => {
        const { data, error } = await supabase
            .from("expense")
            .select("*")
            .eq("trip_id", trip.id);

        if (error) {
            console.error("Error fetching expenses.", error.message);
            return;
        }

        setExpenses(data)
    }

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Spending Status
    const remaining = Number(trip.budget) - totalSpent;
    const overBudget = remaining < 0;
    const closeToBudget = remaining >= 0 && remaining <= 100;
    const underBudget = remaining > 100;

    // Filter expenses to be displayed
    const filteredExpenses =

        /* Search expense filter */
        expenses
            .filter((expense) => {
                const search = searchExpense.toLowerCase();

                return (
                    expense.name.toLowerCase().includes(search)
                );
            }) // Sort expenses based on the selected option
            .sort((a, b) => {
                if (sortOption === "high") {
                    return Number(b.amount) - Number(a.amount);
                }

                if (sortOption === "low") {
                    return Number(a.amount) - Number(b.amount);
                }

                if (sortOption === "date-old") {
                    return new Date(a.date + "T00:00:00") - new Date(b.date + "T00:00:00");
                }

                return new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00");
            });

    // Remove an expense from a trip
    const handleRemoveClick = async (expense) => {
        if (!expense) { return; }

        // Confirmation
        const confirm = window.confirm(
            `Are you sure you want to delete "${expense.name}"? This cannot be undone.`
        );

        if (!confirm) { return; }

        // Remove trip connection from the expense
        const { error: removeError } = await supabase
            .from("expense")
            .update({ trip_id: null })
            .eq("id", expense.id);

        if (removeError) {
            console.error("Error removing expense from trip.", removeError.message);
            return;
        }

        // Update trips total spent 
        const newTotalSpent = Number((totalSpent - Number(expense.amount)).toFixed(2));
        const { error: totalSpentError } = await supabase
            .from("trips")
            .update({ total_spent: newTotalSpent })
            .eq("id", trip.id);

        if (totalSpentError) {
            console.error("Error updating trips total spent.", totalSpentError.message);
            return;
        }

        setTotalSpent(newTotalSpent);

        // Refresh
        fetchExpenses();
    };

    // Background colors
    const tripColors = [
        { name: "blue", className: "bg-blue-900" },
        { name: "green", className: "bg-green-900" },
        { name: "purple", className: "bg-purple-900" },
        { name: "pink", className: "bg-pink-900" },
        { name: "orange", className: "bg-orange-900" },
        { name: "red", className: "bg-red-900" },
    ];

    const tripColorClass =
        tripColors.find((color) => color.name === trip.color)?.className ||
        "bg-blue-900";

    return (
        // Cicking outside the trip modal closes it
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}>
            <div
                className={`${tripColorClass} rounded-lg p-6 w-full max-w-md xs:max-w-xl sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[85vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}>

                {/* Trip Name*/}
                <div className="flex flex-row justify-between">
                    <h2 className="text-5xl sm:text-6xl mb-4 capitalize font-thin">
                        {trip.name}
                    </h2>

                    {/* X to close */}
                    <button onClick={onClose}>
                        <i className="bx bx-x text-4xl hover:bg-gray-800 rounded-3xl hover:-translate-y-1 hover:scale-[1.02] transition duration-200"></i>
                    </button>

                </div>

                <div className="flex flex-col mb-6">

                    {/* Destination */}
                    <p className="text-xl text-zinc-400">{trip.destination}</p>

                    {/* Dates */}
                    <p className="text-md text-zinc-300">
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </p>

                    {/* Days Left (Upcoming trips only) */}
                    {type === "upcoming" && (
                        <div className="mt-3 mb-8">
                            <span className="text-xs text-zinc-300 bg-white/10 rounded-full px-2 py-1">
                                {daysLeft(trip.start_date)} days left
                            </span>
                        </div>
                    )}

                    {/* Spending and Budget Status */}
                    <div className="text-center">
                        <p className="text-lg text-zinc-300 bg-black/50 rounded-full px-2 py-1">
                            <span className={`${overBudget
                                ? "text-red-400"
                                : closeToBudget
                                    ? "text-yellow-400"
                                    : "text-green-400"
                                }`}>${totalSpent.toFixed(2)}</span> / ${Number(trip.budget).toFixed(2)} spent
                        </p>
                    </div>

                </div>


                {/* Trip Expenses */}
                <div className="lg:flex-[2] border border-gray-600 rounded bg-gray-700/15 p-4 h-96 flex flex-col min-h-0 mb-4">

                    {/* Title */}
                    <div className="flex justify-between items-center pb-4">
                        <h2 className="text-xl font-medium text-gray-100">Trip Expenses</h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">

                        {/* Expense SEARCH Bar */}
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            onChange={(e) => {
                                setSearchExpense(e.target.value);
                            }}
                            className="w-full md:w-3/4 p-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-300"
                        />

                        {/* Sorting Options */}
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="p-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-300 text-sm w-full md:w-1/4">
                            <option value="date-new">Date (Newest)</option>
                            <option value="date-old">Date (Oldest)</option>
                            <option value="high">Amount: High → Low</option>
                            <option value="low">Amount: Low → High</option>
                        </select>

                    </div>
                    <p className="text-sm italic mb-1 text-gray-300">
                        Date, Name, Amount
                    </p>
                    <hr className="border-gray-700 mb-2" />

                    {/* Scrollable expense list */}
                    <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                        <ul className="flex flex-col divide-y divide-gray-700">
                            {/* No expenses found when the filtered expense list is empty */}
                            {filteredExpenses.length === 0 ? (
                                <li className="py-6 text-center text-gray-400 text-sm">
                                    No expenses found
                                </li>
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <li
                                        key={expense.id}
                                        className="grid grid-cols-[90px_1fr_120px_40px] items-center py-2 text-sm hover:bg-white/5 transition rounded px-2">
                                        {/* Expense Date, Name, Amount */}
                                        <span className="text-left text-gray-400">
                                            {new Date(expense.date + "T00:00:00").toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                        <span className="text-center">{expense.name}</span>
                                        <span className="text-center">
                                            ${Number(expense.amount).toFixed(2)}
                                        </span>

                                        <div className="text-right">

                                            <div className="space-x-2">

                                                {/* Remove Expense from Trip Button on hover */}
                                                <button
                                                    title="Remove Expense"
                                                    onClick={() => handleRemoveClick(expense)}
                                                    className="text-lg text-red-400 hover:text-red-600">
                                                    <i className='bx bx-minus-circle'></i>
                                                </button>
                                            </div>

                                        </div>

                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    <hr className="border-gray-700 mb-2" />
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                        <div>
                            <p>Want to add or link an expense to this trip?</p>
                        </div>
                        
                        {/* Navigate to Expenses */}
                        <div>
                            <button
                                onClick={() => navigate("/layout-dash/expenses")}
                                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 
                            transition hover:border-yellow-500 hover:bg-yellow-500/5 hover:text-white">
                                Go to Expenses
                            </button>
                        </div>

                    </div>

                </div>

                {/* Notes */}
                <div>
                    <p className="text-md text-white underline">Notes:</p>
                    <p className="text-md text-white">{trip.notes}</p>
                </div>
            </div>
        </div>
    )
}

export default ViewTrip