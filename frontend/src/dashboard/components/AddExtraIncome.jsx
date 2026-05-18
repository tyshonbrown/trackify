import React from 'react';
import { useState } from 'react';

const AddExtraIncome = ({ onClose, onSave }) => {
    const [form, setForm] = useState({
        name: "",
        amount: "",
        date: "",

    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !form.amount ||
            !form.date
        ) {
            alert("Please fill in all fields.");
            return;
        }

        // sends the form to handleSaveExpense function in Dashboard.jsx
        onSave({
            ...form,
            name: form.name.trim() || null,
            amount: Number(form.amount),
        });

        onClose();
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl mb-4 capitalize">
                    Add Extra Income
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Expense Name */}
                    <div>
                        <label className="text-sm text-zinc-400 capitalize">
                            Name / Source
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-sm text-zinc-400 capitalize">
                            Amount
                        </label>

                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                $
                            </span>

                            <input
                                type="number"
                                name="amount"
                                min="0"
                                step="0.01"
                                value={form.amount}
                                onChange={handleChange}
                                className="w-full pl-7 pr-2 py-2 bg-black border border-zinc-700 rounded"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="text-sm text-zinc-400 capitalize">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
                        />
                    </div>

                    {/* Cancel and Save */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm text-zinc-400 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm"
                        >
                            Save Extra Income
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddExtraIncome;