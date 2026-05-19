import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

const EditBudget = ({ section, budget, onClose, onSave }) => {

    const [form, setForm] = useState({});

    // if section or budget changed, the inside function runs
    useEffect(() => {
        if (!section || !budget) return;

        // Depending on the section, the form is set with the actual values extracted from the budget table
        switch (section) {
            case "Housing":
                setForm({
                    housing: budget.housing,
                    housing_insurance: budget.housing_insurance,
                    utilities: budget.utilities,
                });
                break;

            case "Transportation":
                setForm({
                    car_payment: budget.car_payment,
                    car_insurance: budget.car_insurance,
                    fuel: budget.fuel,
                    public_transport: budget.public_transport,
                });
                break;

            case "Phone":
                setForm({
                    mobile: budget.mobile,
                    internet: budget.internet,
                });
                break;

            case "Loans":
                setForm({
                    credit_cards: budget.credit_cards,
                    student_loans: budget.student_loans,
                    personal_loans: budget.personal_loans,
                });
                break;

            case "Subscriptions":
                setForm({
                    subscriptions_entertainment: budget.subscriptions_entertainment,
                    subscriptions_health: budget.subscriptions_health,
                    subscriptions_app: budget.subscriptions_app,
                });
                break;

            case "spending-budgets":
                setForm({
                    groceries: budget.groceries,
                    eating_out: budget.eating_out,
                    entertainment: budget.entertainment,
                    shopping: budget.shopping,
                    personal_care: budget.personal_care,
                });
                break;

            case "income":
                setForm({
                    income: budget.income,
                });
                break;

            default:
                break;

        }
    }, [section, budget]);

    // Updating form when input values change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value === "" ? "" : Number(value),
        }));
    };

    // Update budget table with form when a user saves their changes
    const handleSave = async () => {
        const cleanedFormData = Object.fromEntries(
            Object.entries(form).map(([key, value]) => [
                key,
                value === "" || value == null ? 0 : Number(value),
            ])
        );

        const now = new Date();
        const monthKey = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split("T")[0];

        // Full budget after this edit
        const updatedBudgetData = {
            ...budget,
            ...cleanedFormData,
        };

        const budgetFields = [
            "housing",
            "housing_insurance",
            "utilities",
            "car_payment",
            "car_insurance",
            "fuel",
            "public_transport",
            "internet",
            "mobile",
            "subscriptions_entertainment",
            "subscriptions_health",
            "subscriptions_app",
            "groceries",
            "eating_out",
            "entertainment",
            "shopping",
            "personal_care",
            "credit_cards",
            "student_loans",
            "personal_loans",
        ];

        const totalBudget = budgetFields.reduce(
            (sum, key) => sum + Number(updatedBudgetData[key] ?? 0),
            0
        );

        // Update budget
        const { error: updateError } = await supabase
            .from("budget")
            .update({
                ...cleanedFormData,
                total_budget: totalBudget,
            })
            .eq("id", budget.id);

        if (updateError) {
            console.error("Error updating budget:", updateError.message);
            return;
        }

        // Save full monthly snapshot into budget history table
        const { error: historyError } = await supabase
            .from("budget_history")
            .upsert(
                {
                    user_id: budget.user_id,
                    month: monthKey,
                    income: Number(updatedBudgetData.income ?? 0),
                    housing: Number(updatedBudgetData.housing ?? 0),
                    housing_insurance: Number(updatedBudgetData.housing_insurance ?? 0),
                    utilities: Number(updatedBudgetData.utilities ?? 0),
                    car_payment: Number(updatedBudgetData.car_payment ?? 0),
                    car_insurance: Number(updatedBudgetData.car_insurance ?? 0),
                    fuel: Number(updatedBudgetData.fuel ?? 0),
                    public_transport: Number(updatedBudgetData.public_transport ?? 0),
                    internet: Number(updatedBudgetData.internet ?? 0),
                    mobile: Number(updatedBudgetData.mobile ?? 0),
                    subscriptions_entertainment: Number(updatedBudgetData.subscriptions_entertainment ?? 0),
                    subscriptions_health: Number(updatedBudgetData.subscriptions_health ?? 0),
                    subscriptions_app: Number(updatedBudgetData.subscriptions_app ?? 0),
                    groceries: Number(updatedBudgetData.groceries ?? 0),
                    eating_out: Number(updatedBudgetData.eating_out ?? 0),
                    entertainment: Number(updatedBudgetData.entertainment ?? 0),
                    shopping: Number(updatedBudgetData.shopping ?? 0),
                    personal_care: Number(updatedBudgetData.personal_care ?? 0),
                    credit_cards: Number(updatedBudgetData.credit_cards ?? 0),
                    student_loans: Number(updatedBudgetData.student_loans ?? 0),
                    personal_loans: Number(updatedBudgetData.personal_loans ?? 0),
                    total_budget: totalBudget,
                },
                {
                    onConflict: "user_id,month",
                }
            );

        if (historyError) {
            console.error("Error upserting budget history:", historyError.message);
            return;
        }

        onSave();
        onClose();
    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">

                {/* Title */}
                <h2 className="text-xl mb-4 capitalize">
                    Edit {section.replace("-", " ")}
                </h2>

                {/* Map through form, setting labels and corresponding values */}
                <div className="space-y-4">
                    {Object.keys(form).map((key) => (
                        <div key={key}>
                            <label className="text-sm text-zinc-400 capitalize">
                                {key.replace("_", " ")}
                            </label>
                            <input
                                type="number"
                                name={key}
                                value={form[key] ?? ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    {/* Cancle edit */}
                    <button
                        onClick={onClose}
                        className="text-sm text-zinc-400 hover:text-white">
                        Cancel
                    </button>

                    {/* Save edit */}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm">
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditBudget