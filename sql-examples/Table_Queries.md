## 1. Create Expense Table

```sql
CREATE TABLE expense (
    id int PRIMARY KEY,
    user_id varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    amount int NOT NULL,
    date DATE NOT NULL,
    -- category_id references an id inside the categories table
    CONSTRAINT fk_expense_category 
        FOREIGN KEY (category_id) REFERENCES categories(id),

    -- trip_id references an id inside the trips table
    CONSTRAINT fk_expense_trip
        FOREIGN KEY (trip_id) REFERENCES trips(id)
);
```

## 2. Drop the Expense table form the database

```sql
-- Prevents error expense table DNE already
DROP TABLE IF EXISTS expense;
```