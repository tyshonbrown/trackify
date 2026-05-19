import { supabase } from '@/supabaseClient';
import React from 'react'
import { useState, useEffect } from 'react'

const EditExtraIncome = ({ extraIncome, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: "",
        amount: "",
        date: "",
    });

    // Setting extra income form with current values
    useEffect(() => {
        if (extraIncome) {
          setForm({
            name: extraIncome.name || "",
            amount: extraIncome.amount || "",
            date: extraIncome.date || "",
          });
        }
      }, [extraIncome]);

    // Updating form on input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Updating Extra income
    const handleUpdate = async () => {
        const { error } = await supabase
            .from("extra_income")
            .update({
                name: form.name,
                amount: form.amount,
                date: form.date,
            })
            .eq("id", extraIncome.id);

        if (error) {
            console.error("Error updating extra income.", error.message);
            return;
        }

        onSave();
        onClose();
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl mb-4">Edit Extra Income</h2>
  
          {/* Name */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Name</label>
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
              <label className="text-sm text-zinc-400">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
              />
            </div>
  
            {/* Date */}
            <div>
              <label className="text-sm text-zinc-400">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
              />
            </div>
          </div>
  
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
  
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
}

export default EditExtraIncome;