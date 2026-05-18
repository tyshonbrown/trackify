import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import AddExpense from "@/expenses/components/AddExpense";
import { useNavigate } from "react-router-dom";
import AddExtraIncome from "../components/AddExtraIncome";
import SpendingByCategory from "@/analytics/components/SpendingByCategory";

const Dashboard = () => {
  const navigate = useNavigate();

  const [totalBudget, setTotalBudget] = useState(0);
  const [income, setIncome] = useState(0);

  const [categories, setCategories] = useState([]);

  const [expenses, setExpenses] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const [showAddExtraIncome, setShowAddExtraIncome] = useState(false);
  const [extraIncomeTotal, setExtraIncomeTotal] = useState(0);

  const [firstName, setFirstName] = useState(null);

  const today = new Date();

  const fetchName = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name")
      .single();

    if (error) {
      console.error("Error fetching profile.", error.message);
      return;
    }

    setFirstName(data.first_name);
  }

  const fetchTotalBudget = async () => {
    const { data, error } = await supabase
      .from("budget")
      .select("total_budget")
      .single();

    if (error) {
      console.error("Error fetching analytics", error.message);
      return;
    }
    setTotalBudget(Number(data?.total_budget) || 0);
  };

  const fetchIncome = async () => {
    const { data, error } = await supabase
      .from("budget")
      .select("income")
      .single();

    if (error) {
      console.error("error fetching income", error.message);
      return;
    }
    setIncome(Number(data?.income) || 0);
  }

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expense")
      .select("*");

    if (error) {
      console.error("Error fetching expenses.", error.message);
      return;
    }
    setExpenses(data);
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("expense_categories")
      .select("*");

    if (error) {
      console.error("Error fetching categories.", error.message);
      return;
    }

    setCategories(data);
  };

  const fetchRecentExpenses = async () => {
    const { data, error } = await supabase
      .from("expense")
      .select("*")
      .order("date", { ascending: false })
      .limit(7);

    if (error) {
      console.error("Error fetching expenses.", error.message);
      return;
    }
    setRecentExpenses(data);
  }

  const fetchExtraIncome = async () => {
    const today = new Date();

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const { data, error } = await supabase
      .from("extra_income")
      .select("amount")
      .gte("date", firstDay)
      .lte("date", lastDay);

    if (error) {
      console.error("Error fetching extra income.", error.message);
      return;
    }

    const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
    setExtraIncomeTotal(total);
  };

  // Fetch expenses on the first time the window loads
  useEffect(() => {
    fetchName();
    fetchCategories();
    fetchIncome();
    fetchExtraIncome();
    fetchRecentExpenses();
    fetchExpenses();
    fetchTotalBudget();
  }, []);

  const handleSaveExpense = async (newExpense) => {
    const { error: saveExpenseError } = await supabase
      .from("expense")
      .insert([
        {
          name: newExpense.expenseName,
          amount: newExpense.amount,
          category_id: newExpense.category_id,
          date: newExpense.date,
        },
      ]);

    if (saveExpenseError) {
      console.error("Error saving new expense.", saveExpenseError.message);
      return;
    }

    fetchRecentExpenses();
    setShowAddExpense(false);

  };

  const handleSaveExtraIncome = async (newIncome) => {
    const { error: saveIncomeError } = await supabase
      .from("extra_income")
      .insert([{
        name: newIncome.name,
        amount: newIncome.amount,
        date: newIncome.date,
      },
      ]);

    if (saveIncomeError) {
      console.error("Error saving new extra income.", saveIncomeError.message);
      return;
    }

    fetchExtraIncome();
    setShowAddExtraIncome(false);
  };

  const thisMonthsIncome = income + extraIncomeTotal;

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Weekly expense amount ------------------------------------------------------------------------------
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

  // Month Expense Amount ------------------------------------------------------------------------------
  const startOfThisMonth = new Date(currentYear, currentMonth, 1);
  const startOfTomorrow = new Date(currentYear, currentMonth, today.getDate() + 1);

  const thisMonthSpending = expenses
    .filter((expense) => {
      const d = new Date(expense.date + "T00:00:00");
      return d >= startOfThisMonth && d < startOfTomorrow;
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const thisMonthExpenses = expenses
    .filter((expense) => {
      const d = new Date(expense.date + "T00:00:00");
      return d >= startOfThisMonth && d < startOfTomorrow;
    });

  return (
    <div className="flex flex-col items-center md:items-start space-y-4 p-4 bg-black">
      <h1 className="text-4xl md:text-5xl font-thin">DASHBOARD</h1>

      {/* *******CHANGE Tyshon to USERS NAME ******************/}
      <h1 className="text-xl font-light italic opacity-50">
        Greetings {firstName}!
      </h1>

      {/* Income and Spending summary ----------------------------------------------------------*/}
      <div className="w-full flex flex-col md:flex-row items-center justify-between space-x-4 border-t border-t-gray-900 border-b border-gray-900">
        {/* This months income */}
        <div className="flex-1 text-center py-4">
          <h2 className="text-sm uppercase tracking-wide opacity-60">
            This Months Income
          </h2>
          <p className="text-2xl">
            ${thisMonthsIncome.toFixed(2)}
          </p>
        </div>

        {/* This months spending */}
        <div className="flex-1 text-center py-4">
          <h2 className="text-sm uppercase tracking-wide opacity-60">
            This Months Spending
          </h2>
          <p className="text-2xl">
            ${thisMonthSpending.toFixed(2)}
            <span className="text-gray-500">
              / ${totalBudget.toFixed(2)} budget
            </span>
          </p>
          <p className="text-sm italic">${thisWeekSpending.toFixed(2)} spent this week (Sun-Sat)</p>
        </div>
      </div>

      <div className="w-full flex flex-col-reverse md:flex-row gap-4">
        <div className="flex-1 border border-gray-600 rounded bg-gray-500/15 p-4 md:h-80 md:flex md:flex-col">
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            <p className="text-xs italic px-4 text-gray-500">
              Date, Name, Amount
            </p>
          </div>

          <hr className="border-gray-700 mb-2" />

          <div className="pr-2 md:flex-1 md:overflow-y-auto md:min-h-0">
            <ul className="flex flex-col divide-y divide-gray-700">
              {recentExpenses.length === 0 ? (
                <li className="py-6 text-center text-gray-400 text-sm">
                  No expenses found
                </li>
              ) : (
                recentExpenses.map((expense) => (
                  <li
                    key={expense.id}
                    className="grid grid-cols-3 items-center py-2 text-sm"
                  >
                    <span className="text-left text-gray-400">
                      {new Date(expense.date + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-center">{expense.name}</span>
                    <span className="text-right">
                      ${Number(expense.amount).toFixed(2)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Quick Actions ----------------------------------------------------------*/}
        <div
          className="flex-1 border border-gray-600 rounded bg-gray-500/15 p-4
                flex flex-col items-center"
        >
          {/* Title */}
          <h2 className="text-xl font-semibold mb-4 text-center">
            Quick Actions
          </h2>

          {/* Action Buttons */}
          <div className="w-full flex flex-col space-y-3">
            <button
              onClick={() => setShowAddExpense(true)}
              className="w-full py-2 rounded bg-yellow-500 hover:bg-yellow-700 transition">
              + Add Expense
            </button>

            <button
              onClick={() => setShowAddExtraIncome(true)}
              className="w-full py-2 rounded bg-green-500 hover:bg-green-700 transition">
              + Add Extra Income
            </button>

            <button
              onClick={() => navigate("/layout-dash/budgets")}
              className="w-full py-2 rounded bg-blue-500 hover:bg-blue-700 transition">
              View/Edit Budgets
            </button>

            <button
              onClick={() => navigate("/layout-dash/analytics")}
              className="w-full py-2 rounded bg-gray-700 hover:bg-gray-600 transition">
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Spending By Category ----------------------------------------------------------------*/}
      <div className="w-full border border-gray-600 rounded bg-gray-500/15 p-4 mt-6">
        <div className="min-h-[28rem] flex items-center justify-center">
          <SpendingByCategory
            expenses={thisMonthExpenses}
            totalSpending={thisMonthSpending}
            categories={categories}
            type="dash"
          />
        </div>
      </div>

      {showAddExpense && (
        <AddExpense
          onClose={() => setShowAddExpense(false)}
          onSave={handleSaveExpense}
        />
      )}

      {showAddExtraIncome && (
        <AddExtraIncome
          onClose={() => setShowAddExtraIncome(false)}
          onSave={handleSaveExtraIncome}
        />
      )}

    </div>
  );
};

export default Dashboard;
