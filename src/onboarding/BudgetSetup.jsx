import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useState } from "react";
import LogoLanding from "@/marketing/components/LogoLanding";
import BudgetSection from "@/budgets/components/BudgetSection";
import { supabase } from "@/supabaseClient";

const BudgetSetup = () => {
  const navigate = useNavigate();

  // Sections
  const billsRef = useRef(null);
  const budgetsRef = useRef(null);
  const [displayBills, setDisplayBills] = useState(false);
  const [displayBudgets, setDisplayBudgets] = useState(false);
  const [openSection, setOpenSection] = useState("housing");

  // Transportation
  const [displayCar, setDisplayCar] = useState(false);
  const [displayPublic, setDisplayPublic] = useState(false);
  const [bothTransport, setBothTransport] = useState(false);
  const [transportType, setTransportType] = useState(null);
  const transportBtnBase = "p-4 rounded-md transition border";
  const transportBtnActive = "bg-sky-600 border-sky-400 ring-2 ring-sky-400";
  const transportBtnInactive = "bg-sky-800 hover:bg-sky-600 border-transparent";


  const [income, setIncome] = useState("");
  const [groceries, setGroceries] = useState("");
  const [eat, setEat] = useState("");
  const [entertainment, setEntertainment] = useState("");
  const [shopping, setShopping] = useState("");
  const [personalCare, setPersonalCare] = useState("");
  const [housing, setHousing] = useState({
    payment: "",
    insurance: "",
    utilities: "",
  });
  const [transport, setTransport] = useState({
    payment: "",
    insurance: "",
    fuel: "",
    public: "",
  });
  const [connected, setConnected] = useState({
    mobile: "",
    internet: "",
  });
  const [loans, setLoans] = useState({
    cards: "",
    student: "",
    personal: "",
  });
  const [subscriptions, setSubscriptions] = useState({
    entertainment: "",
    health: "",
    apps: "",
  });

  // Scroll to next section when section changes
  useEffect(() => {
    if (displayBills && billsRef.current) {
      billsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [displayBills]);

  useEffect(() => {
    if (displayBudgets && budgetsRef.current) {
      budgetsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [displayBudgets]);


  // Save budget
  const handleSaveBudgets = async () => {

    // Getting date
    const monthKey = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString().split("T")[0];

    const payload = {
      income: Number(income) || 0,
      housing: Number(housing.payment) || 0,
      housing_insurance: Number(housing.insurance) || 0,
      utilities: Number(housing.utilities) || 0,
      car_payment: Number(transport.payment) || 0,
      car_insurance: Number(transport.insurance) || 0,
      fuel: Number(transport.fuel) || 0,
      public_transport: Number(transport.public) || 0,
      internet: Number(connected.internet) || 0,
      mobile: Number(connected.mobile) || 0,
      subscriptions_entertainment: Number(subscriptions.entertainment) || 0,
      subscriptions_health: Number(subscriptions.health) || 0,
      subscriptions_app: Number(subscriptions.apps) || 0,
      groceries: Number(groceries) || 0,
      eating_out: Number(eat) || 0,
      entertainment: Number(entertainment) || 0,
      shopping: Number(shopping) || 0,
      personal_care: Number(personalCare) || 0,
      credit_cards: Number(loans.cards) || 0,
      student_loans: Number(loans.student) || 0,
      personal_loans: Number(loans.personal) || 0,
    };

    // Calculating the total budget
    const totalBudget =
      payload.housing +
      payload.housing_insurance +
      payload.utilities +
      payload.car_payment +
      payload.car_insurance +
      payload.fuel +
      payload.public_transport +
      payload.internet +
      payload.mobile +
      payload.subscriptions_entertainment +
      payload.subscriptions_health +
      payload.subscriptions_app +
      payload.groceries +
      payload.eating_out +
      payload.entertainment +
      payload.shopping +
      payload.personal_care +
      payload.credit_cards +
      payload.student_loans +
      payload.personal_loans;

    // Save main budget row
    const { data: savedBudget, error: budgetError } = await supabase
      .from("budget")
      .insert({
        ...payload,
        total_budget: totalBudget,
      })
      .select() // gives the inserted row back for use
      .single();

    if (budgetError) {
      console.error("Error saving budget:", budgetError.message);
      return;
    }

    // Save/update this month's budget history for future use
    const { error: historyError } = await supabase
      .from("budget_history")
      .upsert(
        {
          user_id: savedBudget.user_id,
          month: monthKey,
          ...payload,
          total_budget: totalBudget,
        },
        {
          onConflict: "user_id,month",
        }
      );

    if (historyError) {
      console.error("Error saving budget history:", historyError.message);
      return;
    }

    // Go to Profile Pic setup when budgets are complete
    navigate("/profile-picture-setup");
  };

  return (
    <div className="min-h-screen py-4 px-4 lg:px-10 bg-slate-700/40">
      {/* Logo */}
      <div>
        <LogoLanding />
      </div>

      {/* Back Button to Landing */}
      <div className="text-lg mt-5 text-white">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-gray-300 transition-colors font-thin text-md"
        >
          <i class="bx bx-chevron-left"></i>
          Home
        </Link>
      </div>


      <div className="px-20 py-6">

        <h1 className="text-4xl lg:text-5xl font-thin pb-10">Let's setup your budget...</h1>

        {/* Income */}
        <div className="pb-12">
          <h2 className="text-2xl mb-2">Income</h2>
          <p className="italic font-thin mb-4">
            Enter your total monthly income after taxes
          </p>

          <div className="flex items-center gap-4">
            <input
              type="number"
              placeholder="$0"
              value={income}
              onChange={(e) =>
                setIncome(e.target.value)
              }
              className="w-40 rounded-md bg-slate-200 border border-zinc-300 px-3 py-2 text-black" />

            {/* Open the Bill section after setting Income */}
            <button onClick={() => setDisplayBills(true)}
              className="px-6 py-2 rounded-md bg-emerald-600 font-light hover:bg-emerald-400 transition">
              Next
            </button>
          </div>
        </div>

        {/* Monthly Bills */}
        {displayBills && (<div className="pb-12">
          <div ref={billsRef} className="pb-6">
            <h2 className="text-2xl">Monthly Bills</h2>
            <p className="italic font-thin">These are regular payments you don't want to miss.</p>
          </div>

          {/* Housing Costs -------------------------------------------------------------------- */}
          <BudgetSection
            title="Housing"
            description="Monthly housing costs."
            isOpen={openSection === "housing"}
            onOpen={() => setOpenSection("housing")}>
            <p className="italic font-thin opacity-50 mb-4">
              Enter the amount you pay each month. Leave blank if it doesn't apply.
            </p>

            {/* Rent / Morgage */}
            <div className="space-y-4">
              <div>
                <label className="mr-4">Rent or Mortgage</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={housing.payment}
                  onChange={(e) =>
                    setHousing({ ...housing, payment: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>
              
              {/* Housing Insurance */}
              <div>
                <label className="mr-4">Housing Insurance</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={housing.insurance}
                  onChange={(e) =>
                    setHousing({ ...housing, insurance: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>
                
              {/* Utilities */}
              <div>
                <label className="mr-4">
                  Estimated Utilities
                  <span className="text-xs italic opacity-50 ml-1">
                    (Electric, gas, water)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={housing.utilities}
                  onChange={(e) =>
                    setHousing({ ...housing, utilities: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              {/* To Transportation section */}
              <button
                onClick={() => setOpenSection("transportation")}
                className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                Next
              </button>

            </div>
          </BudgetSection>

          {/* Transportation Costs --------------------------------------------------------------------------*/}
          <BudgetSection
            title="Transportation"
            description="Getting around."
            isOpen={openSection === "transportation"}
            onOpen={() => setOpenSection("transportation")}>

            <div className="flex flex-col items-start">
              <p className="font-light opacity-90 mb-4">
                How do you get around?
              </p>

              <div className="flex flex-row">

                <div className="flex flex-col space-y-6">
                  {/* Drive a Car Selection */}
                  <button onClick={() => {
                    setTransportType("car");
                    setDisplayPublic(false);
                    setBothTransport(false);
                    setDisplayCar(true);
                  }} className={`${transportBtnBase} ${transportType === "car" ? transportBtnActive : transportBtnInactive
                    }`}>I drive a Car</button>

                  {/* Public Transportation Selection*/}
                  <button onClick={() => {
                    setTransportType("public");
                    setDisplayCar(false);
                    setBothTransport(false);
                    setDisplayPublic(true);
                  }} className={`${transportBtnBase} ${transportType === "public" ? transportBtnActive : transportBtnInactive
                    }`}>I use Public Transportation / Rideshare</button>

                  {/* BOTH Drive AND use Public Transportation selection*/}
                  <button onClick={() => {
                    setTransportType("both");
                    setDisplayPublic(false);
                    setDisplayCar(false);
                    setBothTransport(true);
                  }} className={`${transportBtnBase} ${transportType === "both" ? transportBtnActive : transportBtnInactive
                    }`}>Both</button>

                  <button
                    onClick={() => setOpenSection("phone")}
                    className="px-6 py-2 text-sm underline opacity-50 font-thin">
                    Skip this section
                  </button>

                </div>

                <div className="ml-10 p-2">

                  {/* Display Car Section */}
                  {displayCar && (<div className="space-y-4 mb-4">
                    <div>
                      {/* Car payment */}
                      <label className="mr-4">Car Loan or Lease Payment</label>
                      <input
                        type="number"
                        placeholder="$0"
                        value={transport.payment}
                        onChange={(e) =>
                          setTransport({ ...transport, payment: e.target.value })
                        }
                        className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
                    </div>

                    {/* Car Insurance */}
                    <div>
                      <label className="mr-4">Car Insurance</label>
                      <input
                        type="number"
                        placeholder="$0"
                        value={transport.insurance}
                        onChange={(e) =>
                          setTransport({ ...transport, insurance: e.target.value })
                        }
                        className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
                    </div>

                    {/* Fuel costs */}
                    <div>
                      <label className="mr-4">
                        Estimated Monthly Fuel Cost
                        <span className="text-xs italic opacity-50 ml-1">
                          (Gasoline, charging, etc.)
                        </span>
                      </label>
                      <input
                        type="number"
                        placeholder="$0"
                        value={transport.fuel}
                        onChange={(e) =>
                          setTransport({ ...transport, fuel: e.target.value })
                        }
                        className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
                    </div>

                    <button
                      onClick={() => setOpenSection("phone")}
                      className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                      Next
                    </button>
                  </div>)}

                  {/* Display Public Transportation Section*/}
                  {displayPublic && (<div className="space-y-4">
                    <div>
                      <label className="mr-4">Estimated monthly transportation cost</label>
                      <input
                        type="number"
                        placeholder="$0"
                        value={transport.public}
                        onChange={(e) =>
                          setTransport({ ...transport, public: e.target.value })
                        }
                        className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
                    </div>

                    <button
                      onClick={() => setOpenSection("phone")}
                      className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                      Next
                    </button>
                  </div>)}

                  {/* Display BOTH Transportation */}
                  {bothTransport && (<div className="space-y-4">
                    <div>
                      <label className="mr-4">Car Finance or Lease Payment</label>
                      <input
                        type="number"
                        placeholder="$0"
                        value={transport.payment}
                        onChange={(e) =>
                          setTransport({ ...transport, payment: e.target.value })
                        }
                        className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
                    </div>

                    <div>
                      <label className="mr-4">Car Insurance</label>
                      <input
                        type="number"
                        placeholder="$0"
                        value={transport.insurance}
                        onChange={(e) =>
                          setTransport({ ...transport, insurance: e.target.value })
                        }
                        className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
                    </div>

                    <div>
                      <label className="mr-4">
                        Estimated Monthly Fuel Cost
                        <span className="text-xs italic opacity-50 ml-1">
                          (Gasoline, charging, etc.)
                        </span>
                      </label>
                      <input
                        type="number"
                        placeholder="$0"
                        value={transport.fuel}
                        onChange={(e) =>
                          setTransport({ ...transport, fuel: e.target.value })
                        }
                        className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
                    </div>
                    <div>
                      <label className="mr-4">Estimated Monthly Public Transportation Cost</label>
                      <input
                        type="number"
                        placeholder="$0"
                        value={transport.public}
                        onChange={(e) =>
                          setTransport({ ...transport, public: e.target.value })
                        }
                        className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
                    </div>

                    <button
                      onClick={() => setOpenSection("phone")}
                      className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                      Next
                    </button>
                  </div>)}

                </div>
              </div>
            </div>
          </BudgetSection>

          {/* Phone and Internet Costs --------------------------------------------------------------------- */}
          <BudgetSection
            title="Mobile & Internet"
            description="Staying connected."
            isOpen={openSection === "phone"}
            onOpen={() => setOpenSection("phone")}>
            <p className="italic font-thin opacity-50 mb-4">
              Enter the amount you pay each month. Leave blank if it doesn't apply.
            </p>

            {/* Internet */}
            <div className="space-y-4">
              <div>
                <label className="mr-4">
                  Monthly Internet Costs
                  <span className="text-xs italic opacity-50 ml-1">
                    (Home Internet or broadband service)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={connected.mobile}
                  onChange={(e) =>
                    setConnected({ ...connected, mobile: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>
              
              {/* Mobile */}
              <div>
                <label className="mr-4">
                  Monthly Mobile Costs
                  <span className="text-xs italic opacity-50 ml-1">
                    (Phone plans, device payments, tablets, smartwatches)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={connected.internet}
                  onChange={(e) =>
                    setConnected({ ...connected, internet: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <button
                onClick={() => setOpenSection("loans")}
                className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                Next
              </button>

            </div>
          </BudgetSection>

          {/* Loans and Credit --------------------------------------------------------------------- */}
          <BudgetSection
            title="Loans & Credit"
            description="Payments toward credit cards and loans."
            isOpen={openSection === "loans"}
            onOpen={() => setOpenSection("loans")}>
            <p className="italic font-thin opacity-50 mb-4">
              Enter the amount you pay each month. Leave blank if it doesn't apply.
            </p>

            {/* inputs */}
            <div className="space-y-4">
              <div>
                <label className="mr-4">
                  Credit Cards
                  <span className="text-xs italic opacity-50 ml-1">
                    (Monthly payment toward your balance)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={loans.cards}
                  onChange={(e) =>
                    setLoans({ ...loans, cards: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <div>
                <label className="mr-4">
                  Student Loans
                  <span className="text-xs italic opacity-50 ml-1">
                    (Monthly federal or private student loan payments)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={loans.student}
                  onChange={(e) =>
                    setLoans({ ...loans, student: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <div>
                <label className="mr-4">
                  Personal Loans
                  <span className="text-xs italic opacity-50 ml-1">
                    (Monthly non-auto loan payments)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={loans.personal}
                  onChange={(e) =>
                    setLoans({ ...loans, personal: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <button
                onClick={() => setOpenSection("subscriptions")}
                className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                Next
              </button>

            </div>
          </BudgetSection>

          {/* Subscriptions ----------------------------------------------------------------------- */}
          <BudgetSection
            title="Subscriptions"
            description="Entertainment, mobile, gym, etc."
            isOpen={openSection === "subscriptions"}
            onOpen={() => setOpenSection("subscriptions")}>
            <p className="italic font-thin opacity-50 mb-4">
              Enter the amount you pay each month. Leave blank if it doesn't apply.
            </p>

            <div className="space-y-4">

              {/* Entertainment Subscriptions */}
              <div>
                <label className="mr-4">
                  Entertainment
                  <span className="text-xs italic opacity-50 ml-1">
                    (Streaming services, music, gaming, etc.)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={subscriptions.entertainment}
                  onChange={(e) =>
                    setSubscriptions({ ...subscriptions, entertainment: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              {/* Healtha nd Wellness Subscriptions */}
              <div>
                <label className="mr-4">
                  Health & Wellness
                  <span className="text-xs italic opacity-50 ml-1">
                    (Gym memberships and classes)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={subscriptions.health}
                  onChange={(e) =>
                    setSubscriptions({ ...subscriptions, health: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              {/* App Subscriptions */}
              <div>
                <label className="mr-4">
                  Apps
                  <span className="text-xs italic opacity-50 ml-1">
                    (Paid mobile & desktop apps)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={subscriptions.apps}
                  onChange={(e) =>
                    setSubscriptions({ ...subscriptions, apps: e.target.value })
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <button
                onClick={() => {
                  setOpenSection("groceries");
                  setDisplayBudgets(true);
                }}
                className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                Next
              </button>
            </div>
          </BudgetSection>
        </div>
        )}

        {/* Spending Budgets ------------------------------------------------------------------------------- */}
        {displayBudgets && (<div>
          <div ref={budgetsRef} className="pb-6">
            <h2 className="text-2xl">Spending Budgets</h2>
            <p className="italic font-thin">Set limits for categories where spending can vary month to month.</p>
          </div>

          {/* Grocery Budget -------------------------------------------------------------------- */}
          <BudgetSection
            title="Groceries"
            description="Food at home."
            isOpen={openSection === "groceries"}
            onOpen={() => setOpenSection("groceries")}>

            <div className="space-y-4">
              <div>
                <label className="mr-4 font-light">
                  How much do you want to spend on groceries each month?
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={groceries}
                  onChange={(e) =>
                    setGroceries(e.target.value)
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <button
                onClick={() => setOpenSection("eating-out")}
                className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                Next
              </button>

            </div>
          </BudgetSection>

          {/* Eating Out Budget -------------------------------------------------------------------- */}
          <BudgetSection
            title="Eating Out"
            description="Food away from home."
            isOpen={openSection === "eating-out"}
            onOpen={() => setOpenSection("eating-out")}>
            <p className="italic font-thin opacity-50 mb-4">
              Restaurants, cafes, takeout, and delivery.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mr-4 font-light">
                  How much do you want to spend on eating out each month?
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={eat}
                  onChange={(e) =>
                    setEat(e.target.value)
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <button
                onClick={() => setOpenSection("entertainment")}
                className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                Next
              </button>

            </div>
          </BudgetSection>

          {/* Entertainment Budget -------------------------------------------------------------------- */}
          <BudgetSection
            title="Entertainment"
            description="Money for fun!"
            isOpen={openSection === "entertainment"}
            onOpen={() => setOpenSection("entertainment")}>
            <p className="italic font-thin opacity-50 mb-4">
              Movies, events, hobbies, etc.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mr-4 font-light">
                  How much do you want to spend on entertainment each month?
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={entertainment}
                  onChange={(e) =>
                    setEntertainment(e.target.value)
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <button
                onClick={() => setOpenSection("shopping")}
                className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                Next
              </button>

            </div>
          </BudgetSection>

          {/* Shopping Budget -------------------------------------------------------------------- */}
          <BudgetSection
            title="Shopping"
            description="Everyday splurges."
            isOpen={openSection === "shopping"}
            onOpen={() => setOpenSection("shopping")}>
            <p className="italic font-thin opacity-50 mb-4">
              Clothes, accessories, and personal items.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mr-4 font-light">
                  How much do you want to spend on shopping each month?
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={shopping}
                  onChange={(e) =>
                    setShopping(e.target.value)
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              <button
                onClick={() => setOpenSection("personal-care")}
                className="mt-4 px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-400 transition">
                Next
              </button>

            </div>
          </BudgetSection>

          {/* Personal Care Budget -------------------------------------------------------------------- */}
          <BudgetSection
            title="Personal Care"
            description="Care essentials."
            isOpen={openSection === "personal-care"}
            onOpen={() => setOpenSection("personal-care")}>
            <p className="italic font-thin opacity-50 mb-4">
              Haircuts, grooming, skincare, etc.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mr-4 font-light">
                  How much do you want to spend on personal care each month?
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={personalCare}
                  onChange={(e) =>
                    setPersonalCare(e.target.value)
                  }
                  className="w-36 rounded-md bg-slate-200 px-3 py-2 text-black" />
              </div>

              {/* SAVE BUDGETS --------------------------------------------------------------------------- */}
              <button
                onClick={handleSaveBudgets}
                className="mt-4 px-6 py-2 rounded-md bg-green-600 hover:bg-green-400 transition">
                Save Budgets
              </button>

            </div>
          </BudgetSection>

        </div>)}

      </div>


    </div>
  );
};

export default BudgetSetup;
