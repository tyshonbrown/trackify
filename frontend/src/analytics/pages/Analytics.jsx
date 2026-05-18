import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import SpendingByCategory from "../components/SpendingByCategory";
import SpendingVsBudget from "../components/SpendingVsBudget";
import MonthlySpending from "../components/MonthlySpending";

const Analytics = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [spendingYear, setSpendingYear] = useState(today.getFullYear());

  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({});

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

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expense")
      .select("*");

    if (error) {
      console.error("Error fetching expenses.", error.message);
      return;
    }

    setExpenses(data);
  };

  const fetchBudgetForViewedMonth = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError.message);
      return;
    }

    if (!user) {
      console.error("No logged-in user found.");
      return;
    }

    const viewedMonthStart = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-01`;

    const { data, error } = await supabase
      .from("budget_history")
      .select("*")
      .eq("user_id", user.id)
      .lte("month", viewedMonthStart)
      .order("month", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching budget history:", error.message);
      return;
    }

    setBudget(data || {});
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchBudgetForViewedMonth();
  }, [viewYear, viewMonth]);

  // Holds onto the current month and year, NEVER CHANGES
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Year Navigation for Monthly Spending --------------------------------------------------
  const goToCurrentYear = () => {
    setSpendingYear(currentYear);
  };

  const previousYear = () => {
    setSpendingYear(spendingYear - 1);
  };

  const nextYear = () => {
    // Cannot view future years
    if (spendingYear === currentYear) {
      return;
    }

    setSpendingYear(spendingYear + 1);
  };

  const isAtCurrentYear = spendingYear === currentYear;

  const monthlySpendingData = Array.from({ length: 12 }, (_, index) => {
    const monthExpenses = expenses.filter((expense) => {
      const d = new Date(expense.date + "T00:00:00");

      return (
        d.getFullYear() === spendingYear &&
        d.getMonth() === index
      );
    });

    const totalSpent = monthExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    return {
      month: new Date(spendingYear, index).toLocaleDateString("en-US", {
        month: "short",
      }),
      totalSpent,
    };
  });

  // Month Navigation ---------------------------------------------------------------------
  const goToCurrentMonth = () => {
    setViewYear(currentYear);
    setViewMonth(currentMonth);
  };
  const previousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const nextMonth = () => {
    // Cannot view future months
    if (viewYear === currentYear && viewMonth === currentMonth) {
      return;
    }
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };


  // Check if month being viewed is Current
  const isAtCurrentMonth = viewYear === currentYear && viewMonth === currentMonth;

  // Month Label ------------------------------------------------------------------------
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  ).toUpperCase();

  // Filter expenses by Month ------------------------------------------------------------
  const startOfMonth = new Date(viewYear, viewMonth, 1);
  const startOfNextMonth = new Date(viewYear, viewMonth + 1, 1);

  const viewedMonthExpenses = expenses
    .filter((expense) => {
      const d = new Date(expense.date + "T00:00:00");
      return d >= startOfMonth && d < startOfNextMonth;
    });

  const viewedMonthSpending = viewedMonthExpenses
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const budgetByGroup = {
    "Housing":
      Number(budget.housing || 0) +
      Number(budget.housing_insurance || 0) +
      Number(budget.utilities || 0) +
      Number(budget.internet || 0) +
      Number(budget.mobile || 0),

    "Transportation":
      Number(budget.car_payment || 0) +
      Number(budget.car_insurance || 0) +
      Number(budget.fuel || 0) +
      Number(budget.public_transport || 0),

    "Subscriptions":
      Number(budget.subscriptions_entertainment || 0) +
      Number(budget.subscriptions_health || 0) +
      Number(budget.subscriptions_app || 0),

    "Groceries":
      Number(budget.groceries || 0),

    "Eating Out":
      Number(budget.eating_out || 0),

    "Entertainment":
      Number(budget.entertainment || 0),

    "Shopping":
      Number(budget.shopping || 0),

    "Personal Care":
      Number(budget.personal_care || 0),

    "Loans":
      Number(budget.credit_cards || 0) +
      Number(budget.student_loans || 0) +
      Number(budget.personal_loans || 0),

  };


  return (

    <div className="flex flex-col items-center space-y-4 p-4 bg-black">

      {/* Title */}
      <div className="w-full border-b border-gray-900 md:items-start ">
        <h1 className="text-4xl md:text-5xl font-thin mb-2">ANALYTICS</h1>
      </div>

      <div className="flex flex-col w-full">


        <div className="flex flex-col items-center">

          {/* Month Label */}
          <div className="flex flex-row items-center gap-8 text-3xl">
            <button onClick={previousMonth}>
              <i className="bx bx-left-arrow-alt" />
            </button>

            <p className="w-64 text-center">
              {monthLabel}
            </p>

            <button
              onClick={nextMonth}
              className={`${isAtCurrentMonth ? "text-gray-500" : "text-white"}`}
            >
              <i className="bx bx-right-arrow-alt" />
            </button>
          </div>

          {/* Back to Current Month button */}
          <div className="h-10 flex items-center justify-center">
            {!isAtCurrentMonth && (
              <button
                onClick={goToCurrentMonth}
                className="text-sm hover:bg-slate-400/50 bg-slate-500/50 rounded-full px-2"
              >
                Back to Current Month
              </button>
            )}
          </div>

          {/* First Two Trends (Based on Month) */}
          <div className="flex flex-col lg:flex-row mt-4 gap-2 h-auto lg:h-[28rem] w-full">
            <div className="w-full lg:w-1/2 text-center bg-slate-800 rounded-lg p-3">
              <SpendingByCategory
                expenses={viewedMonthExpenses}
                totalSpending={viewedMonthSpending}
                categories={categories}
                type="analytics"
              />
            </div>

            <div className="w-full lg:w-1/2 text-center bg-yellow-700/80 rounded-lg p-3">
              <SpendingVsBudget
                expenses={viewedMonthExpenses}
                categories={categories}
                budgetByGroup={budgetByGroup} />
            </div>
          </div>


        </div>

        {/* Monthly Spending Trend */}
        <div className="bg-slate-900 w-full mt-3 p-3 rounded-lg text-center h-[30rem] lg:h-[36rem] lg:max-h-[36rem]">
          <div className="flex flex-col items-center mb-4">
            <p className="text-lg mb-2">Monthly Spending</p>

            {/* Year label and navigation */}
            <div className="flex flex-row items-center gap-8 text-3xl">
              <button onClick={previousYear}>
                <i className="bx bx-left-arrow-alt" />
              </button>

              <p className="w-32 text-center">
                {spendingYear}
              </p>

              <button
                onClick={nextYear}
                className={`${isAtCurrentYear ? "text-gray-500" : "text-white"}`}
              >
                <i className="bx bx-right-arrow-alt" />
              </button>
            </div>

            <div className="h-10 flex items-center justify-center">
              {!isAtCurrentYear && (
                <button
                  onClick={goToCurrentYear}
                  className="text-sm hover:bg-slate-400/50 bg-slate-500/50 rounded-full px-2"
                >
                  Back to Current Year
                </button>
              )}
            </div>

            <MonthlySpending data={monthlySpendingData} year={spendingYear} />

          </div>
        </div>


      </div>

    </div>
  );
};

export default Analytics;
