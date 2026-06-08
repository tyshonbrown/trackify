import { supabase } from "@/supabaseClient";

// Use a category name to lookup its category_id
const getCategoryMap = async () => {
  const { data, error } = await supabase
    .from("expense_categories")
    .select("id, name");

  if (error) throw error;

  const categoryMap = {};

  // Map each category name to its corresponding ID
  data.forEach((category) => {
    categoryMap[category.name] = category.id;
  });

  return categoryMap;
};

// Sample Monthly Budget
const demoMonthlyBudget = {
  income: 5000,
  entertainment: 100,
  housing: 1857,
  housing_insurance: 110,
  utilities: 200,
  car_payment: 350,
  car_insurance: 112,
  fuel: 200,
  public_transport: 25,
  internet: 50,
  mobile: 80,
  groceries: 200,
  eating_out: 150,
  shopping: 200,
  personal_care: 60,
  student_loans: 55,
  personal_loans: 0,
  subscriptions_entertainment: 25,
  subscriptions_health: 40,
  subscriptions_app: 25,
  total_budget: 3839,
};

// Category names with their corresponding Budget Group names
const budgetCategoryMap = {
  entertainment: "Entertainment",
  housing: "Rent / Mortgage",
  housing_insurance: "Housing Insurance",
  utilities: "Utilities",
  car_payment: "Car Payment & Insurance",
  car_insurance: "Car Payment & Insurance",
  fuel: "Fuel",
  public_transport: "Public Transportation",
  internet: "Internet",
  mobile: "Internet",
  groceries: "Groceries",
  eating_out: "Eating Out",
  shopping: "Shopping",
  personal_care: "Personal Care",
  student_loans: "Student Loan Payment",
  personal_loans: "Personal Loan Payment",
  subscriptions_entertainment: "Streaming",
  subscriptions_health: "Fitness & Health",
  subscriptions_app: "Apps & Software",
};

// Sample expense names for each category
const expenseNamesByBudgetKey = {
  housing: ["Rent Payment"],
  housing_insurance: ["GEICO Renter's Insurance"],
  utilities: ["Electric Bill", "Water Bill", "Gas Bill"],
  car_payment: ["Auto Loan Payment"],
  car_insurance: ["GEICO Car Insurance Payment"],
  fuel: ["Shell Gas", "Exxon", "BP Fuel", "Wawa Gas"],
  public_transport: ["Metro Fare", "Train Ticket"],
  internet: ["Xfinity Internet"],
  mobile: ["Verizon Mobile"],
  groceries: [
    "Trader Joe's",
    "Walmart Groceries",
    "Target Grocery",
    "Safeway",
    "Aldi",
  ],
  eating_out: [
    "Chipotle",
    "Starbucks",
    "Cava",
    "DoorDash",
    "Wendys",
    "Cheesecake Factory",
    "Olive Garden",
  ],
  shopping: [
    "Amazon",
    "Target",
    "Zara",
    "New Balance",
    "Walmart",
    "Urban Outfitters",
    "H&M",
    "Bath & Body Works",
    "Nike",
  ],
  entertainment: ["Movie Tickets", "Bowling", "Museum Ticket", "Event Ticket"],
  personal_care: ["Barber", "Hair Products", "Skincare", "Toiletries"],
  student_loans: ["Aidvantage Student Loan Payment"],
  personal_loans: ["Personal Loan Payment"],
  subscriptions_entertainment: ["Netflix", "Hulu", "Apple Music"],
  subscriptions_health: ["Gym Membership"],
  subscriptions_app: ["iCloud Storage", "Canva", "Notion", "GitHub"],
};

// Helper functions to make demo expenses look RANDOM
const createSeededRandom = (seed) => {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

// Generate a different seed for each month 
const getSeedForMonth = (year, monthIndex) => {
  return year * 100 + monthIndex + 1;
};

// Generate a random number between min and max
const randomBetween = (rand, min, max) => {
  return rand * (max - min) + min;
};

// Picks one random item from an array
const pickRandom = (rand, arr) => {
  return arr[Math.floor(rand * arr.length)];
};

// Number of expenses from each category for every month
const expenseCountByBudgetKey = {
  housing: 1,
  housing_insurance: 1,
  utilities: 3,
  car_payment: 1,
  car_insurance: 1,
  fuel: 3,
  public_transport: 2,
  internet: 1,
  mobile: 1,
  groceries: 4,
  eating_out: 5,
  shopping: 3,
  entertainment: 2,
  personal_care: 4,
  student_loans: 1,
  personal_loans: 0,
  subscriptions_entertainment: 3,
  subscriptions_health: 1,
  subscriptions_app: 4,
};

// Certain categorys should have an expense that overspends for the given month indices
// So fuel expenses will overspend in april and august
// Helps the data look more realistic
const shouldOverspendCategory = (budgetKey, monthIndex) => {
  const overspendSchedule = {
    eating_out: [1, 5, 9], // Feb, Jun, Oct
    shopping: [2, 10], // Mar, Nov
    entertainment: [6, 11], // Jul, Dec
    fuel: [3, 7], // Apr, Aug
    groceries: [4, 8], // May, Sep
    utilities: [0, 7], // Jan, Aug
  };

  return overspendSchedule[budgetKey]?.includes(monthIndex) || false;
};

// Categories that usually have the same amount every month, like fixed bills
const fixedBudgetKeys = [
  "housing",
  "housing_insurance",
  "car_payment",
  "car_insurance",
  "internet",
  "mobile",
  "student_loans",
  "subscriptions_entertainment",
  "subscriptions_health",
  "subscriptions_app",
];

// For a given category, how much should the dmeo user spend for the given month
const getTargetSpentForCategory = (
  budgetKey,
  budgetAmount,
  year,
  monthIndex,
  rand
) => {

  // If budget for a category is 0, then no money should be spent for it
  if (budgetAmount <= 0) return 0;

  // Check if the category is fixed and if the user shoudl overspend for the given month
  const isFixed = fixedBudgetKeys.includes(budgetKey);
  const shouldOverspend = shouldOverspendCategory(budgetKey, monthIndex);

  // If fixed, then the budget amount is whats spent for the month for that category
  if (isFixed) {
    return budgetAmount;
  }

  // Choose spending percentage range
  const minPercent = shouldOverspend ? 1.05 : 0.72;
  const maxPercent = shouldOverspend ? 1.25 : 0.98;

  // Choose the actual spending percentage at random
  const percent = randomBetween(rand(), minPercent, maxPercent);

  return Number((budgetAmount * percent).toFixed(2));
};

// Take the total monthly spending amount and splits it into many expenses
const splitAmount = (total, count, rand) => {

  // If no expenses to create or total given is 0, return an empty array
  if (count <= 0 || total <= 0) return [];

  // if category only needs 1 expense, it jsut returns the total in an array
  if (count === 1) {
    return [Number(total.toFixed(2))];
  }

  // Generate random weights to decide how big each expense should be compared to the others 
  // Larger weight means the expense gets a bigger peice of the total
  const weights = Array.from({ length: count }, () =>
    randomBetween(rand(), 0.5, 1.5)
  );
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);

  // Converts the weights into dollar amounts
  let amounts = weights.map((weight) =>
    Number(((weight / weightTotal) * total).toFixed(2))
  );

  // Makes sure the amounts all add up to the total, if not it adds the difference tot he last amount in the array
  const currentTotal = amounts.reduce((sum, amount) => sum + amount, 0);
  const difference = Number((total - currentTotal).toFixed(2));

  amounts[amounts.length - 1] = Number(
    (amounts[amounts.length - 1] + difference).toFixed(2)
  );

  return amounts;
};

const getExpenseDate = (year, monthIndex, day, endDate) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const safeDay = Math.min(day, daysInMonth);

  const date = new Date(year, monthIndex, safeDay);

  if (date > endDate) return null;

  return date.toISOString().split("T")[0];
};

// Decides which days of the month the expenses should happen on
const getDaysForExpenseCount = (count) => {
  const dayPatterns = {
    1: [1],
    2: [7, 21],
    3: [5, 15, 25],
    4: [4, 11, 18, 25],
    5: [3, 9, 15, 21, 27],
  };

  return dayPatterns[count] || [5, 12, 19, 26];
};

// Generate a full list of demo expense rows
export const generateDemoExpenses = (userId, categoryMap) => {
  const expenses = [];

  // Start and end dates of the fake data
  // Start expenses from Jan 2025 up to the current date
  const start = new Date(2025, 0, 1);
  const end = new Date();

  let current = new Date(start);

  // Loops through each month until it reaches today
  while (current <= end) {
    const year = current.getFullYear();
    const monthIndex = current.getMonth();

    // Creates a seeded random generator for the specific month
    // A month gets its own repeatable random pattern
    const rand = createSeededRandom(getSeedForMonth(year, monthIndex));

    // Loops through each demo monthly budget item
    Object.entries(demoMonthlyBudget).forEach(([budgetKey, budgetAmount]) => {
      if (budgetKey === "income" || budgetKey === "total_budget") return;

      // Get the category name and category ID for that budget item
      const categoryName = budgetCategoryMap[budgetKey];
      const categoryId = categoryMap[categoryName];

      if (!categoryId) {
        console.warn(`Missing category ID for ${categoryName}`);
        return;
      }

      // Get the number of expenses to be created
      const count = expenseCountByBudgetKey[budgetKey] || 1;

      if (count <= 0 || budgetAmount <= 0) return;

      // Decide total monthly spending for this category
      const targetSpent = getTargetSpentForCategory(
        budgetKey,
        budgetAmount,
        year,
        monthIndex,
        rand
      );

      // Convert category total into individual expenses
      const amounts = splitAmount(targetSpent, count, rand);
      // Get expense days
      const days = getDaysForExpenseCount(count);
      // Get possible expense names for the category
      const names = expenseNamesByBudgetKey[budgetKey] || [categoryName];

      // For each amount in the array, it creates an expense object
      amounts.forEach((amount, index) => {
        const date = getExpenseDate(year, monthIndex, days[index] || 15, end);

        if (!date) return;

        expenses.push({
          user_id: userId,
          category_id: categoryId, // your expenses table stores the category ID here
          name: pickRandom(rand(), names),
          amount,
          date,
        });
      });
    });

    // Move tot he enxt month
    current.setMonth(current.getMonth() + 1);
  }

  return expenses;
};

export const seedDemoUserData = async (userId) => {
  try {
    // Get the category map for ID lookup
    const categoryMap = await getCategoryMap();

    // Generate expenses using the new demo user's ID
    const demoExpenses = generateDemoExpenses(userId, categoryMap);

    // Insert the demo monthly budget
    const { error: budgetError } = await supabase.from("budget").insert({
      user_id: userId,
      ...demoMonthlyBudget,
    });

    if (budgetError) {
      throw budgetError;
    }

    // Insert first budget history entry for January 2025
    const { error: budgetHistoryError } = await supabase
      .from("budget_history")
      .insert({
        user_id: userId,
        month: "2025-01-01",
        ...demoMonthlyBudget,
      });

    if (budgetHistoryError) {
      throw budgetHistoryError;
    }

    // Insert a sample upcoming trip for the demo user
    const { data: demoTrip, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: userId,
        name: "Tokyo 2027",
        destination: "Tokyo, Japan",
        start_date: "2027-03-11",
        end_date: "2027-03-28",
        color: "blue",
        budget: 4500,
        notes: "Have fun!",
        total_spent: 2300,
      })
      .select()
      .single();

    if (tripError) {
      throw tripError;
    }

    // Create demo expenses attached to that trip
    const travelCategoryId = categoryMap["Travel"];
    const demoTripExpenses = [
      {
        user_id: userId,
        category_id: travelCategoryId,
        trip_id: demoTrip.id,
        name: "Flight to Tokyo",
        amount: 1250,
        date: "2026-05-15",
      },
      {
        user_id: userId,
        category_id: travelCategoryId,
        trip_id: demoTrip.id,
        name: "Tokyo Hotel Deposit",
        amount: 900,
        date: "2026-05-10",
      },
      {
        user_id: userId,
        category_id: travelCategoryId,
        trip_id: demoTrip.id,
        name: "Japan Rail Pass",
        amount: 150,
        date: "2026-05-20",
      },
    ];

    // Insert demo trip expenses
    const { error: tripExpensesError } = await supabase
      .from("expense")
      .insert(demoTripExpenses);

    if (tripExpensesError) {
      throw tripExpensesError;
    }

    // Insert all demo expenses
    const { error: expensesError } = await supabase
      .from("expense")
      .insert(demoExpenses);

    if (expensesError) {
      throw expensesError;
    }

    console.log("Demo budget and expenses created successfully.");
  } catch (error) {
    console.error("Error seeding demo data:", error.message);
    throw error;
  }
};
