## 1. Get all expenses for a user

```sql
SELECT
  expense.id,
  expense.name,
  expense.amount,
  expense.date,
  -- get category name from empense_categories
  -- and display it as category_name in the final result
  expense_categories.name AS category_name
FROM expense

-- Join each expense with its matching category
INNER JOIN expense_categories

  -- match the category_id stores on the expense
  -- with the id of the category in expense_categories
  ON expense.category_id = expense_categories.id

-- only return expenses belonging to a specific user USER_ID
WHERE expense.user_id = 'USER_ID'

-- Show newest expenses first
ORDER BY expense.date DESC;
```

## 2. Add a new expense to the expense table

```sql
INSERT INTO expense (
  name,
  amount,
  date,
  category_id,
  user_id,
  trip_id
)
VALUES (
  'Chipotle',
  12.35,
  '2026-06-10',
  'CATEGORY_ID' -- given a category_id to connect it to
  'USER_ID',  -- given a user_id
  NULL  -- Trip set to null
);
```

## 3. Update a current expense in the expense table

```sql
UPDATE expense
SET amount = 100.20
WHERE id = 'EXPENSE_ID';
```

## 4. Delete an expense from the expense table

```sql
DELETE FROM expense
WHERE id = 'EXPENSE_ID';
```

## 5. Get 5 most recent expenses of a user

```sql
SELECT TOP 5 *
FROM expense;
```

## 6. Get the number of user expenses that are NOT connected to a trip

```sql
SELECT COUNT(expense.id) AS
FROM expense
WHERE expense.trip_id IS NULL;
```