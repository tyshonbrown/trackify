import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const EditExpense = ({ expense, onClose, onSave }) => {

  // Form
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category_id: "",
    date: "",
  });
  const [categories, setCategories] = useState([]);

  // Get Categories
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("expense_categories")
      .select("id, name");

    if (error) {
      console.error("Error fetching categories.", error.message);
      return;
    }

    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Set form data with expense current info
  useEffect(() => {
    if (!expense) return;

    setFormData({
      name: expense.name,
      amount: expense.amount,
      category_id: expense.category_id,
      date: expense.date,
    });
  }, [expense]);

  // Update form when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update expense
  const handleUpdate = async () => {

    // Upfate trips total spent if expense is connected to it
    if (expense.trip_id) {
      const { data: tripData, error: tripFetchError } = await supabase
        .from("trips")
        .select("total_spent")
        .eq("id", expense.trip_id)
        .single();

      if (tripFetchError) {
        console.error("Error fetching trip", tripFetchError.message);
        return;
      }

      const currentTotalSpent = Number(tripData.total_spent) || 0;
      const oldExpenseAmount = Number(expense.amount) || 0;
      const newexpenseAmount = Number(formData.amount) || 0;
      const updatedTotalSpent = (currentTotalSpent - oldExpenseAmount) + newexpenseAmount;

      const { error: tripUpdateError } = await supabase
        .from("trips")
        .update({
          total_spent: updatedTotalSpent,
        })
        .eq("id", expense.trip_id);

      if (tripUpdateError) {
        console.error("Error updating trip's total spent", tripUpdateError.message);
        return;
      }
    }

    // Update the expense itself
    const { error } = await supabase
      .from("expense")
      .update({
        name: formData.name,
        amount: formData.amount,
        category_id: formData.category_id,
        date: formData.date,
      })
      .eq("id", expense.id);

    if (error) {
      console.error("Error editing expense.", error.message);
      return;
    }

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        {/* Title */}
        <h2 className="text-xl mb-4">Edit Expense</h2>

        <div className="space-y-4">
          <div>

            {/* Name */}
            <label className="text-sm text-zinc-400">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              value={formData.amount}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
            />
          </div>

          {/* Category selection */}
          <div>
            <label className="text-sm text-zinc-400">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
            >
              <option value="">Select category</option>
              {/* For each category, create an option with the category name */}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-zinc-400">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {/* Cancel */}
          <button
            onClick={onClose}
            className="text-sm text-zinc-400 hover:text-white"
          >
            Cancel
          </button>

          {/* Save */}
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExpense;