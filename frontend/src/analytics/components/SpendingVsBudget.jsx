import React from 'react';
import ProgressBar from './ProgressBar';

const SpendingVsBudget = ({ expenses, categories, budgetByGroup }) => {

    const budget_groups = {};

    // For every category, look at its budget_group, it that roup DNE in the object yet, create it
    categories.forEach((category) => {
        const groupName = category.budget_group;

        if (groupName === "Travel") return;

        if (!budget_groups[groupName]) {
            budget_groups[groupName] = {
                name: groupName,
                spent: 0,
                budget: Number(budgetByGroup[groupName]) || 0,
            };
        }
    });

    // Lookup connecting category_id to its budget group
    const categoryIdToBudgetGroup = Object.fromEntries(
        categories.map((category) => [category.id, category.budget_group])
    );

    // Add each expenses amount to its corresponding budget group
    expenses.forEach((expense) => {
        const budgetGroupName = categoryIdToBudgetGroup[expense.category_id];

        if (budget_groups[budgetGroupName]) {
            budget_groups[budgetGroupName].spent += Number(expense.amount) || 0;
        }
    });

    // Conver budget group object into an array
    // Sort the groups so the ones with spending values come first
    const budgetGroupArray = Object.values(budget_groups).sort((a, b) => {
        const aHasAmount = a.spent > 0;
        const bHasAmount = b.spent > 0;

        if (aHasAmount && !bHasAmount) return -1;
        if (!aHasAmount && bHasAmount) return 1;

        return b.spent - a.spent;
    });

    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="text-center text-lg">Spending vs. Budget</div>

            <div className="w-full max-w-md mt-4 space-y-4 overflow-y-auto pr-2 max-h-[22rem]">
                {budgetGroupArray.map((group) => (
                    <ProgressBar
                        key={group.name}
                        label={group.name}
                        spent={group.spent.toFixed(2)}
                        budget={group.budget.toFixed(2)}
                    />
                ))}
            </div>
        </div>
    )
}

export default SpendingVsBudget