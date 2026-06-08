import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingByCategory = ({ expenses, totalSpending, categories, type }) => {
    const isSmallScreen = window.innerWidth < 640;

    // Expenses hold category_id NOT name
    // Categories here are gonna be budget_group

    // Category lookup. get a Category object by looking up with category id
    // categoryMap[expense.category_id] gets the category OBJECT of the expense
    const categoryMap = categories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
    }, {});

    // Calculate the totals of each group and store it into an object
    const spendingByGroup = expenses.reduce((totals, expense) => {

        // Get the category object of the expense
        const category = categoryMap[expense.category_id];

        if (!category) return totals;

        // Get the budget group of the category object
        const group = category.budget_group || "Other";

        // Get the amount of the expense
        const amount = Number(expense.amount) || 0;

        // updating the total amount of the group of the expense
        totals[group] = (totals[group] || 0) + amount;

        return totals;
    }, {});

    // Convert from Object to an ARRAY of objects to seperate each category and its total
    // Looks like { category: "", total: # }
    // Sorted by the highest amount first
    const spendingByCategoryData = Object.entries(spendingByGroup)
        .map(([group, total]) => ({
            category: group,
            total,
        }))
        .sort((a, b) => b.total - a.total);

    // Pie Chart data
    const chartData = {
        labels: spendingByCategoryData.map((item) => item.category),
        datasets: [
            {
                label: "Spending By Category",
                data: spendingByCategoryData.map((item) => item.total),
                backgroundColor: [
                    "#38bdf8", // sky blue
                    "#84cc16", // lime green
                    "#ef4444", // red
                    "#a855f7", // purple
                    "#facc15", // yellow
                    "#ec4899", // pink
                    "#f97316", // orange
                    "#15803d", // dark green
                    "#1d4ed8", // dark blue
                    "#8b5e3c", // brown
                ],
                borderColor: "white",
                borderWidth: 1,
                cutout: "45%",
            },
        ],
    };

    // Pie Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "white",
                    font: {
                        size: isSmallScreen ? 12 : 14,
                    },
                    boxWidth: 20,
                    boxHeight: 14,
                    padding: 10,
                },

            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        return `${context.label}: $${value}`;
                    },
                },
            },
        },
    };


    return (
        <div className="flex flex-col items-center w-full">
            {type === "dash" && (
                <div className="text-center text-lg">This Month's Spending By Category</div>
            )}

            {type === "analytics" && (
                <div className="text-center text-lg">Spending By Category</div>
            )}
            <div className="mt-2">
                <p className="text-gray-400 text-sm">- Click a category label to hide or show it in the chart</p>
                <p className="text-gray-400 text-sm">- Hover over the diagram to view exact amounts</p>
            </div>

            <div className="w-full max-w-[17rem] sm:max-w-[18rem] md:max-w-[20rem] aspect-square">
                <Doughnut data={chartData} options={options} />
            </div>

            <div>
                <p className="font-bold"><span className="text-gray-300 font-normal">Total Spent: </span>${Number(totalSpending).toFixed(2)}</p>
            </div>

        </div>
    )
}

export default SpendingByCategory;