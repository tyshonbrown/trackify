import DisplayBudgets from '@/budgets/components/DisplayBudgets';
import DisplayBills from '@/budgets/components/DisplayBills';
import DisplayIncome from '../components/DisplayIncome';
import EditBudget from '@/budgets/components/EditBudget';
import EditExtraIncome from '../components/EditExtraIncome';
import { supabase } from '@/supabaseClient';
import React from 'react';
import { useState, useEffect } from 'react';

const Budgets = () => {
  const [openSection, setOpenSection] = useState("");
  const [editSection, setEditSection] = useState(null);
  const [budget, setBudget] = useState(null);

  const [extraIncome, setExtraIncome] = useState([]);
  const [extraIncomeTotal, setExtraIncomeTotal] = useState(0);
  const [selectedExtraIncome, setSelectedExtraIncome] = useState(null);
  const [showEditExtraIncome, setShowEditExtraIncome] = useState(false);

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from("budget")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching budgets:", error.message);
      return;
    }

    setBudget(data);
  };

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
      .select("id, name, amount, date")
      .gte("date", firstDay)
      .lte("date", lastDay);

    if (error) {
      console.error("Error fetching extra income.", error.message);
      return;
    }

    setExtraIncome(data || []);
    const total = (data || []).reduce((sum, item) => sum + Number(item.amount), 0);
    setExtraIncomeTotal(total);

  };

  useEffect(() => {
    fetchBudgets();
    fetchExtraIncome();
  }, []);


  const handleEditClick = (extraIncome) => {
    setSelectedExtraIncome(extraIncome);
    setShowEditExtraIncome(true);
  };

  const handleDeleteClick = async (extraIncome) => {
    const confirm = window.confirm(
      `Are you sure you want to delete extra income from: "${extraIncome.name}"? This cannot be undone.`
    );

    if (!confirm) { return; }

    const { error } = await supabase
      .from("extra_income")
      .delete()
      .eq("id", extraIncome.id);

    if (error) {
      console.error("Error deleting extra income", error.message);
      return;
    }

    fetchExtraIncome();

    if (selectedExtraIncome?.id === extraIncome.id) {
      setShowEditExtraIncome(false);
      setSelectedExtraIncome(null);
    }
  }

  return (
    <div className="flex flex-col items-start p-4 bg-black">
      {/* Title */}
      <div
        onClick={() => setOpenSection("")}
        className="w-full border-b border-gray-900 mb-4">
        <h1 className="text-4xl md:text-5xl font-thin mb-2">BUDGETS</h1>
      </div>

      {/* Income ------------------------------------------------------------- */}
      <div className="w-full pb-8">
        <div onClick={() => setOpenSection("")}>
          <h2 className="text-2xl text-gray-400">Income</h2>
          <p className="italic font-thin text-sm"></p>
        </div>

        <DisplayIncome
          title="Monthly Income"
          description="Recurring income received each month"
          isOpen={openSection === "monthly-income"}
          onOpen={() => setOpenSection("monthly-income")}
          onEdit={() => setEditSection("income")}>
          <div className="flex justify-center">
            <p className="text-green-400">${budget?.income}</p>
          </div>
        </DisplayIncome>

        <DisplayIncome
          title="Extra Income"
          description="One-time income added for the current month"
          isOpen={openSection === "extra-income"}
          onOpen={() => setOpenSection("extra-income")}
          onEdit={() => setEditSection("extra-income")}>

          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <p className="opacity-80 text-lg">Total: </p>
              <p className="text-green-400 text-lg">${extraIncomeTotal.toFixed(2)}</p>
            </div>

            {extraIncome.length === 0 ? (
              <p className="text-center text-sm text-zinc-500">
                No extra income added this month.
              </p>
            ) : (
              <ul className="space-y-2">
                {extraIncome.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-center justify-between border-b border-zinc-800 pb-2"
                  >
                    <div>
                      <p className="text-sm">{item.name || "Extra Income"}</p>
                      <p className="text-xs text-zinc-500">{item.date}</p>
                    </div>

                    <div className="flex flex-end">
                      <p className="text-green-400 group-hover:hidden">${Number(item.amount).toFixed(2)}</p>

                      <div className="space-x-2">
                        {/* Edit Button on hover */}
                        <button onClick={() => handleEditClick(item)}
                          className="hidden group-hover:inline-block text-lg text-yellow-400 hover:text-yellow-200">
                          <i className="bx bxs-pencil" />
                        </button>

                        {/* Delete Button on hover */}
                        <button onClick={() => handleDeleteClick(item)}
                          className="hidden group-hover:inline-block text-lg text-red-400 hover:text-red-200">
                          <i className="bx bxs-trash" />
                        </button>
                      </div>

                    </div>

                  </li>
                ))}
              </ul>
            )}
          </div>
        </DisplayIncome>

      </div>

      {/* Monthly Bills ------------------------------------------------------------- */}
      <div className="w-full pb-8">
        <div onClick={() => setOpenSection("")}>
          <h2 className="text-2xl text-gray-400">Monthly Bills</h2>
          <p className="italic font-thin text-sm">Regular payments you don't want to miss.</p>
        </div>

        <DisplayBills
          title="Housing"
          description="Rent/Mortgage, Insurance, Utilities"
          isOpen={openSection === "Housing"}
          onOpen={() => setOpenSection("Housing")}
          onEdit={() => setEditSection("Housing")}>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl flex flex-row justify-between">

              <div className="flex flex-col items-center">
                <p className="text-sm">Rent / Mortgage</p>
                <p className="text-green-400">${budget?.housing}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Insurance</p>
                <p className="text-green-400">${budget?.housing_insurance}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Utilities</p>
                <p className="text-green-400">${budget?.utilities}</p>
              </div>

            </div>
          </div>
        </DisplayBills>

        <DisplayBills
          title="Transportation"
          description="Car Loan/Lease, Insurance, Fuel, Public Transportation"
          isOpen={openSection === "Transportation"}
          onOpen={() => setOpenSection("Transportation")}
          onEdit={() => setEditSection("Transportation")}>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl flex flex-row justify-between">

              <div className="flex flex-col items-center">
                <p className="text-sm">Car Payments</p>
                <p className="text-green-400">${budget?.car_payment}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Insurance</p>
                <p className="text-green-400">${budget?.car_insurance}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Fuel / Charging</p>
                <p className="text-green-400">${budget?.fuel}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Public Transportation</p>
                <p className="text-green-400">${budget?.public_transport}</p>
              </div>

            </div>
          </div>
        </DisplayBills>

        <DisplayBills
          title="Mobile & Internet"
          description="Phone Plans & Device Payments, Home Internet"
          isOpen={openSection === "Phone"}
          onOpen={() => setOpenSection("Phone")}
          onEdit={() => setEditSection("Phone")}>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl flex flex-row justify-between">

              <div className="flex flex-col items-center">
                <p className="text-sm">Mobile Plans</p>
                <p className="text-green-400">${budget?.mobile}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Internet</p>
                <p className="text-green-400">${budget?.internet}</p>
              </div>

            </div>
          </div>
        </DisplayBills>

        <DisplayBills
          title="Loans & Credit"
          description="Credit Cards, Student & Personal Loans"
          isOpen={openSection === "Loans"}
          onOpen={() => setOpenSection("Loans")}
          onEdit={() => setEditSection("Loans")}>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl flex flex-row justify-between">

              <div className="flex flex-col items-center">
                <p className="text-sm">Credit Cards</p>
                <p className="text-green-400">${budget?.credit_cards}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Student Loans</p>
                <p className="text-green-400">${budget?.student_loans}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Personal Loans</p>
                <p className="text-green-400">${budget?.personal_loans}</p>
              </div>

            </div>
          </div>
        </DisplayBills>

        <DisplayBills
          title="Subscriptions"
          description="Entertainment, Health, & App Subscriptions"
          isOpen={openSection === "Subscriptions"}
          onOpen={() => setOpenSection("Subscriptions")}
          onEdit={() => setEditSection("Subscriptions")}>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl flex flex-row justify-between">

              <div className="flex flex-col items-center">
                <p className="text-sm">Entertainment</p>
                <p className="text-green-400">${budget?.subscriptions_entertainment}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Health</p>
                <p className="text-green-400">${budget?.subscriptions_health}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">Apps</p>
                <p className="text-green-400">${budget?.subscriptions_app}</p>
              </div>

            </div>
          </div>
        </DisplayBills>
      </div>

      {/* Spending Budgets ------------------------------------------------------------- */}
      <div onClick={() => setOpenSection("")} className="w-full">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-gray-400">Spending Budgets</h2>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditSection("spending-budgets");
              }}
              className="text-sm text-blue-400 hover:text-blue-300">
              Edit
            </button>
          </div>

          <p className="italic font-thin text-sm">Limits where spending can vary month to month.</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2">

          <DisplayBudgets
            title="Groceries"
            amount={budget?.groceries}>
          </DisplayBudgets>

          <DisplayBudgets
            title="Eating Out"
            amount={budget?.eating_out}>

          </DisplayBudgets>

          <DisplayBudgets
            title="Entertainment"
            amount={budget?.entertainment}>
          </DisplayBudgets>

          <DisplayBudgets
            title="Shopping"
            amount={budget?.shopping}>

          </DisplayBudgets>

          <DisplayBudgets
            title="Personal Care"
            amount={budget?.personal_care}>

          </DisplayBudgets>
        </div>

        {/* When edit section is set and not null, the Edit modal opens */}
        {editSection && (
          <EditBudget
            section={editSection}
            budget={budget}
            onClose={() => setEditSection(null)}
            onSave={fetchBudgets}
          />
        )}

        {showEditExtraIncome && (
          <EditExtraIncome
            extraIncome={selectedExtraIncome}
            onClose={() => {
              setShowEditExtraIncome(false);
              setSelectedExtraIncome(null);
            }}
            onSave={fetchExtraIncome}
          />
        )}
      </div>

    </div>
  );
};

export default Budgets;