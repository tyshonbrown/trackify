import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const MonthlySpending = ({ data, year }) => {

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Valid months are those that are not future and have a spending amount
    const validMonths = data.filter((month, index) => {
        const isFutureMonth =
            year === currentYear && index > currentMonth;

        const hasSpending = month.totalSpent > 0;

        return !isFutureMonth && hasSpending;
    });

    // Check that the year has valid months
    const hasValidMonths = validMonths.length > 0;

    // Highest Spending month
    const highestMonth = hasValidMonths
        ? validMonths.reduce((highest, month) => {
            return month.totalSpent > highest.totalSpent ? month : highest;
        }, validMonths[0])
        : null;

    // Lowest spending month
    const lowestMonth = hasValidMonths
        ? validMonths.reduce((lowest, month) => {
            return month.totalSpent < lowest.totalSpent ? month : lowest;
        }, validMonths[0])
        : null;

    // Average monthly spending
    const averageMonthlySpending = hasValidMonths
        ? validMonths.reduce((sum, month) => sum + month.totalSpent, 0) /
        validMonths.length
        : 0;


    return (
        <div className="w-full h-[18rem] sm:h-[20rem] lg:h-[24rem] min-w-0">

            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, "Spent"]}
                    />

                    <Line
                        type="monotone"
                        dataKey="totalSpent"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="text-sm mt-2">
                {hasValidMonths ? (
                    <>
                        <p>
                            Highest spending month: {highestMonth.month} - $
                            {highestMonth.totalSpent.toFixed(2)}
                        </p>

                        <p>
                            Lowest spending month: {lowestMonth.month} - $
                            {lowestMonth.totalSpent.toFixed(2)}
                        </p>

                        <p>
                            Average monthly spending: ${averageMonthlySpending.toFixed(2)}
                        </p>
                    </>
                ) : (
                    <p className="text-zinc-400">
                        No spending data available for this year yet.
                    </p>
                )}
            </div>
        </div>
    )
}

export default MonthlySpending