import { supabase } from "@/supabaseClient";
import React from "react";
import { useState, useEffect } from "react";
import Categories from "@/expenses/components/Categories";
import AddExpense from "@/expenses/components/AddExpense";
import EditExpense from "../components/EditExpense";
import AddToTrip from "../components/AddToTrip";

const Expenses = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showAddToTrip, setShowAddToTrip] = useState(false);

  // Selected Category
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCategoryName, setActiveCategoryName] = useState("All");

  // Expense DATA from the db
  const [expenses, setExpenses] = useState([]);

  const [displayedBudget, setDisplayedBudget] = useState(0);

  // Expense Search and Sort
  const [searchExpense, setSearchExpense] = useState("");
  const [sortOption, setSortOption] = useState("date-new");

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Get expenses
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expense")
      .select(`
      id,
      name,
      amount,
      category_id,
      date,
      trip_id,
      expense_categories (name)
      `);

    if (error) {
      console.error("Error fetching expenses:", error.message);
      return;
    }

    setExpenses(data);
  };

  // Get total budget
  const fetchDisplayedBudget = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching user:", userError?.message);
      return;
    }

    const viewedMonthKey = new Date(viewYear, viewMonth, 1)
      .toISOString()
      .split("T")[0];

    // Latest history row on or before viewed month
    const { data: historyRow, error: historyError } = await supabase
      .from("budget_history")
      .select("total_budget")
      .eq("user_id", user.id)
      .lte("month", viewedMonthKey)
      .order("month", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (historyError) {
      console.error("Error fetching budget history:", historyError.message);
      return;
    }

    if (historyRow) {
      setDisplayedBudget(Number(historyRow.total_budget) || 0);
      return;
    }

    // If history exists yet, use current budget
    const { data: budgetRow, error: budgetError } = await supabase
      .from("budget")
      .select("total_budget")
      .eq("user_id", user.id)
      .single();

    if (budgetError) {
      console.error("Error fetching current budget:", budgetError.message);
      return;
    }

    setDisplayedBudget(Number(budgetRow?.total_budget) || 0);
  };

  // Fetch expenses on the first time the window loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Fetch total budget when view month or year changes
  useEffect(() => {
    fetchDisplayedBudget();
  }, [viewYear, viewMonth]);

  // Save Expense
  const handleSaveExpense = async (newExpense) => {
    const tripId = newExpense.trip_id || null;

    // Add expense to Expense Table
    const { error: saveExpenseError } = await supabase
      .from("expense")
      .insert([
        {
          name: newExpense.expenseName,
          amount: newExpense.amount,
          category_id: newExpense.category_id,
          date: newExpense.date,
          trip_id: tripId,
        },
      ]);

    if (saveExpenseError) {
      console.error("Error saving new expense.", saveExpenseError.message);
      return;
    }

    // If expense was added to a Trip
    if (tripId) {

      // Fetching total_spent from Trips Table
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select("total_spent")
        .eq("id", tripId)
        .single();

      if (tripError) {
        console.error("Error fetching trips.", tripError.message);
        return;
      }

      // Calculating new total_spent for Trip then updating it
      const totalSpent = tripData.total_spent || 0;
      const newTotalSpent = Number(newExpense.amount) + totalSpent;
      const { error: tripTotalError } = await supabase
        .from("trips")
        .update({
          total_spent: newTotalSpent
        })
        .eq("id", tripId);

      if (tripTotalError) {
        console.error("Error updating trips total spent.", tripTotalError.message);
        return;
      }
    }

    // Refresh
    fetchExpenses();
    setShowAddExpense(false);

  };

  // Month and Year Navigation and Filtering
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Go back to Current Month
  const goToCurrentMonth = () => {
    setViewYear(currentYear);
    setViewMonth(currentMonth);
  };

  // PREVIOUS Month
  const previousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  // NEXT Month
  const nextMonth = () => {
    if (viewMonth === currentMonth && viewYear === currentYear) {
      return;
    }

    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Checks if the month/year being displayed is the current month/year
  const atCurrentMonth = viewYear === currentYear && viewMonth === currentMonth;

  // Get the current Month and Year label
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  ).toUpperCase();

  // Weekly expense amount -----------------------------------------------------------
  const startOfToday = new Date(currentYear, currentMonth, today.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  // Next Sunday
  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setDate(startOfWeek.getDate() + 7);

  const thisWeekSpending =
    expenses
      .filter((expense) => {
        const d = new Date(expense.date + "T00:00:00");
        return d >= startOfWeek && d < startOfNextWeek;
      })
      .reduce((sum, expense) => sum + Number(expense.amount), 0);


  // Expense Filtering -------------------------------------------------------------
  // To get the range between start and end of the month being viewed
  const startOfMonth = new Date(viewYear, viewMonth, 1);
  const startOfNextMonth = new Date(viewYear, viewMonth + 1, 1);

  const viewedMonthExpenses = expenses
    .filter((expense) => {
      const d = new Date(expense.date + "T00:00:00");
      return d >= startOfMonth && d < startOfNextMonth;
    });

  const viewedMonthSpending = viewedMonthExpenses
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const displayedSpending = viewedMonthSpending;

  // Filter expenses to be displayed
  const filteredExpenses =
    /* Filter expenses by selected category AND search.*/
    expenses
      .filter((expense) => {
        const d = new Date(expense.date + "T00:00:00");
        return d >= startOfMonth && d < startOfNextMonth;
      })
      .filter((expense) => // Filter expenses by category selected
        activeCategory === "all"
          ? true
          : expense.category_id === activeCategory
      )
      .filter((expense) => {
        const search = searchExpense.toLowerCase();

        return (
          expense.name.toLowerCase().includes(search) ||
          expense.expense_categories?.name.toLowerCase().includes(search)
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

  // Edit Expense Click
  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setShowEditExpense(true);
  }

  // Add Expense to a Trip Click
  const handleTripClick = (expense) => {
    setSelectedExpense(expense);
    setShowAddToTrip(true);
  }

  // Save expense to Trip Click
  const handleSaveToTrip = async (tripId) => {
    if (!selectedExpense || !tripId) return;

    const oldTripId = selectedExpense.trip_id;
    const expenseAmount = Number(selectedExpense.amount);

    // Prevent adding the same expense to the same trip again
    if (oldTripId === tripId) {
      setShowAddToTrip(false);
      setSelectedExpense(null);
      return;
    }


    // Update expense with new trip id 
    const { error: saveError } = await supabase
      .from("expense")
      .update({ trip_id: tripId })
      .eq("id", selectedExpense.id);

    if (saveError) {
      console.error("Error adding expense to trip.", saveError.message);
      return;
    }

    // If expense was previously assigned to a different trip,
    // subtract it from that old trip first
    if (oldTripId && oldTripId !== tripId) {
      const { data: oldTrip, error: oldTripFetchError } = await supabase
        .from("trips")
        .select("total_spent")
        .eq("id", oldTripId)
        .single();

      if (oldTripFetchError) {
        console.error("Error fetching old trip total spent.", oldTripFetchError.message);
        return;
      }

      const updatedOldTotal = Number(oldTrip.total_spent) - expenseAmount;

      const { error: oldTripUpdateError } = await supabase
        .from("trips")
        .update({ total_spent: updatedOldTotal })
        .eq("id", oldTripId);

      if (oldTripUpdateError) {
        console.error("Error updating old trip total spent.", oldTripUpdateError.message);
        return;
      }
    }

    // Add amount to new trip
    const { data: newTrip, error: fetchTripError } = await supabase
      .from("trips")
      .select("total_spent")
      .eq("id", tripId)
      .single();

    if (fetchTripError) {
      console.error("Error fetching total spent from trip.", fetchTripError.message);
      return;
    }

    const newTotalSpent = Number(newTrip.total_spent) + expenseAmount;

    const { error: totalSpentError } = await supabase
      .from("trips")
      .update({ total_spent: newTotalSpent })
      .eq("id", tripId);

    if (totalSpentError) {
      console.error("Error updating trip total spent.", totalSpentError.message);
      return;
    }

    setShowAddToTrip(false);
    setSelectedExpense(null);
    fetchExpenses();
  }

  // Remove Expense from Trip
  const handleRemoveFromTrip = async () => {
    if (!selectedExpense || !selectedExpense.trip_id) return;

    // Updating trips total spent
    const expenseAmount = Number(selectedExpense.amount) || 0;
    const tripId = selectedExpense.trip_id;

    const { data: tripData, error: tripFetchError } = await supabase
      .from("trips")
      .select("total_spent")
      .eq("id", tripId)
      .single();

    if (tripFetchError) {
      console.error("Error fetching trip total spent.", tripFetchError.message);
      return;
    }

    const updatedTotalSpent = Math.max(
      0,
      Number(tripData.total_spent || 0) - expenseAmount
    );

    const { error: tripUpdateError } = await supabase
      .from("trips")
      .update({ total_spent: updatedTotalSpent })
      .eq("id", tripId);

    if (tripUpdateError) {
      console.error("Error updating trip total spent.", tripUpdateError.message);
      return;
    }

    // Remove Expense and trip connection
    const { error } = await supabase
      .from("expense")
      .update({ trip_id: null })
      .eq("id", selectedExpense.id);

    if (error) {
      console.error("Error removing expense from trip.", error.message);
      return;
    }

    setShowAddToTrip(false);
    setSelectedExpense(null);
    fetchExpenses();
  };

  // DELETE Expense 
  const handleDeleteClick = async (expense) => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${expense.name}"? This cannot be undone.`
    );

    if (!confirm) { return; }

    // Updating trips total spent
    if (expense.trip_id) {
      const { data: tripData, error: tripFetchError } = await supabase
        .from("trips")
        .select("total_spent")
        .eq("id", expense.trip_id)
        .single();

      if (tripFetchError) {
        console.error("Error fetching trip", tripFetchError.message);
        return;
      }

      const currentTotalSpent = Number(tripData.total_spent) || 0;
      const expenseAmount = Number(expense.amount) || 0;

      const updatedTotalSpent = currentTotalSpent - expenseAmount;

      const { error: tripUpdateError } = await supabase
        .from("trips")
        .update({
          total_spent: updatedTotalSpent,
        })
        .eq("id", expense.trip_id);

      if (tripUpdateError) {
        console.error("Error updating trip total spent", tripUpdateError.message);
        return;
      }
    }

    // Expense deletion
    const { error: deleteError } = await supabase
      .from("expense")
      .delete()
      .eq("id", expense.id);

    if (deleteError) {
      console.error("Error deleting expense", deleteError.message);
      return;
    }

    fetchExpenses();

    if (selectedExpense?.id === expense.id) {
      setShowEditExpense(false);
      setSelectedExpense(null);
    }
  }

  return (
    <div className="flex flex-col items-center md:items-start space-y-4 p-4 bg-black">
      <h1 className="text-4xl md:text-5xl font-thin">EXPENSES</h1>

      <div className="w-full flex flex-col md:flex-row items-center justify-between space-x-4 border-t border-t-gray-900 border-b border-gray-900">

        {/* Month Navigation */}
        <div className="flex-1 text-center py-4">
          <h2 className="text-sm uppercase tracking-wide opacity-60">
            Total Spending
          </h2>

          <div className="flex items-center justify-center">
            <button
              onClick={previousMonth}
              className="px-3 hover:text-gray-400">←</button>

            <div className="w-48 text-center">
              <p className="text-2xl">{monthLabel}</p>
            </div>

            <button
              onClick={nextMonth}
              disabled={atCurrentMonth}
              className={`px-3 ${atCurrentMonth
                ? "text-gray-600"
                : "text-white hover:text-gray-400"}`}>→</button>
          </div>

          {/* Back to Current Month */}
          {!atCurrentMonth && (
            <button onClick={goToCurrentMonth}
              className="text-sm hover:bg-slate-400/50 bg-slate-500/50 rounded-full px-2 transition">
              Back to Current Month
            </button>
          )}


        </div>

        {/* This weeks spending*/}
        {atCurrentMonth && (
          <div className="flex-1 text-center py-4">
            <h2 className="text-sm uppercase tracking-wide opacity-60">
              This Week
            </h2>
            <p className="text-2xl">${thisWeekSpending.toFixed(2)}</p>
            <p className="text-sm opacity-50">(Sun-Sat)</p>
          </div>
        )}


        {/* This months spending*/}
        <div className="flex-1 text-center py-4">
          <h2 className="text-sm uppercase tracking-wide opacity-60">
            This Month
          </h2>
          <p className="text-2xl">
            ${displayedSpending.toFixed(2)}{" "}
            <span className="text-gray-500">
              / ${Number(displayedBudget).toFixed(2)} budget
            </span>
          </p>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="flex justify-center md:justify-end w-full">
        <button
          onClick={() => setShowAddExpense(true)}
          className="py-3 px-14 rounded bg-yellow-500 hover:bg-yellow-700 transition"
        >
          + Add Expense
        </button>
      </div>

  
      <div className="w-full flex flex-col-reverse lg:flex-row gap-4 min-h-0">

        {/* Expenses */}
        <div className="lg:flex-[2] border border-gray-600 rounded bg-gray-500/15 p-4 h-96 flex flex-col min-h-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">

            {/* Expense SEARCH Bar */}
            <input
              type="text"
              placeholder="Search expenses..."
              onChange={(e) => {
                setSearchExpense(e.target.value);
              }}
              className="w-full md:w-3/4 p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-300"
            />

            {/* Sorting */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-300 text-sm">
              <option value="date-new">Date (Newest)</option>
              <option value="date-old">Date (Oldest)</option>
              <option value="high">Amount: High → Low</option>
              <option value="low">Amount: Low → High</option>
            </select>

          </div>

          {/* Title */}
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-lg font-semibold"> <span className="text-gray-300">Expenses: </span>{activeCategoryName}</h2>
            <p className="text-sm italic px-4 text-gray-500">
              Date, Name, Amount, Category
            </p>
          </div>

          <hr className="border-gray-700 mb-2" />

          {/* Scrollable expense list */}
          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            <ul className="flex flex-col divide-y divide-gray-700">
              {filteredExpenses.length === 0 ? (
                <li className="py-6 text-center text-gray-400 text-sm">
                  No expenses found
                </li>
              ) : (
                filteredExpenses.map((expense) => (
                  <li
                    key={expense.id}
                    className="group grid grid-cols-4 items-center py-2 text-sm hover:bg-white/5 transition rounded px-2">
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

                    <div className="flex justify-end">
                      {/* Category label */}
                      <span className="text-right text-gray-400 group-hover:hidden">
                        {expense.expense_categories?.name}
                      </span>

                      <div className="space-x-2">
                        {/* Edit Button on hover */}
                        <button title="Edit" onClick={() => handleEditClick(expense)}
                          className="hidden group-hover:inline-block text-xl hover:text-2xl text-yellow-400 hover:text-yellow-500 transition-all">
                          <i className="bx bxs-pencil" />
                        </button>

                        {/* Add to Trip Button on hover */}
                        <button title="Add to Trip" onClick={() => handleTripClick(expense)}
                          className="hidden group-hover:inline-block text-xl hover:text-2xl text-blue-400 hover:text-blue-600 transition-all">
                          <i className='bx bxs-plane-alt' />
                        </button>

                        {/* Delete Button on hover */}
                        <button title="Delete" onClick={() => handleDeleteClick(expense)}
                          className="hidden group-hover:inline-block text-xl hover:text-2xl text-red-400 hover:text-red-600 transition-all">
                          <i className="bx bxs-trash" />
                        </button>
                      </div>

                    </div>

                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Categories */}
        <Categories
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setActiveCategoryName={setActiveCategoryName} />

        {/* Add Expense Form */}
        {showAddExpense && (
          <AddExpense
            onClose={() => setShowAddExpense(false)}
            onSave={handleSaveExpense}
          />
        )}

        {/* Edit Expense Form */}
        {showEditExpense && selectedExpense && (
          <EditExpense
            expense={selectedExpense}
            onClose={() => {
              setShowEditExpense(false);
              setSelectedExpense(null);
            }}
            onSave={fetchExpenses}
          />
        )}

        {/* Add to Trip Option */}
        {showAddToTrip && selectedExpense && (
          <AddToTrip
            expense={selectedExpense}
            onClose={() => {
              setShowAddToTrip(false);
              setSelectedExpense(null);
            }}
            onSave={handleSaveToTrip}
            onRemove={handleRemoveFromTrip}
          />
        )}

      </div>
    </div>
  );
};

export default Expenses;
