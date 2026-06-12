## 1. Get Total Spending by Category

Look at all users expenses
connect category ids from expenses to their name in expenses_categories
group expenses by categories
son

```sql
SELECT 
  expense_categories.name AS "Category Name",
  SUM(expense.amount) AS "Total Spending"
FROM expense
INNER JOIN expense_categories -- join expense with matching category
  ON expense.category_id = expenses_catgories.id
WHERE expense.user_id = 'USER_ID'
GROUP BY expense_categories.name   -- group by category names
ORDER BY "Total Spending" DESC;    -- show highest spending categories first
```

## 2. Get a users Total Monthly Spending

```sql
SELECT
  -- convert each expense date into the first day of its month
  DATE_TRUNC('month', date) AS "Month",

  -- add up all expense amounts for each month
  SUM(expense.amount) AS "Total Spending"
FROM expense
WHERE expense.user_id = 'USER_ID'
GROUP BY DATE_TRUNC('month', date)
ORDER BY "Month";
```

## 3. Get a specific Trip's Total Spending

```sql
SELECT
  trips.name AS "Trip Name",
  SUM(expense.amount) AS "Total Spending"
FROM expense
INNER JOIN trips
  ON expense.trip_id = trips.id
WHERE expense.user_id = 'USER_ID'
  AND trips.id = 'TRIP_ID'
GROUP BY trips.name;
```

## 4. Get all Trips Remaining Budget's

```sql
SELECT 
  trips.name AS "Trip Name",
  trips.budget AS "Budget",
  COALESCE(SUM(expense.amount), 0) AS "Total Spent",
  trips.budget - COALESCE(SUM(expense.amount), 0) AS "Remaining Budget"
FROM trips

-- left join because want all trips including those with no expenses yet
LEFT JOIN expenses
  ON expense.trip_id = trips.id
WHERE trips.user_id = 'USER_ID'
GROUP BY trips.id, trips.name, trips.budget;