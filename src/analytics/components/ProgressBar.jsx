import React from 'react';

const ProgressBar = ({ label, spent, budget }) => {

    const spentAmount = Number(spent) || 0;
    const budgetAmount = Number(budget) || 0;

    const percent =
        budgetAmount > 0
            ? Math.min((spentAmount / budgetAmount) * 100, 100)
            : spentAmount > 0
                ? 100
                : 0;

    const barColor =
        budgetAmount === 0 && spentAmount > 0
            ? "bg-red-500"
            : spentAmount >= budgetAmount && budgetAmount > 0
                ? "bg-red-500"
                : "bg-green-500";

    const formatMoney = (amount) => {
        return Number(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>
                    ${formatMoney(spentAmount)} / ${formatMoney(budgetAmount)}
                </span>
            </div>

            <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} rounded-full transition-all duration-300`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;