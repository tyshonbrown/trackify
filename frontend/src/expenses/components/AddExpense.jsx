import React from 'react';
import { supabase } from '@/supabaseClient';
import { useState, useEffect } from 'react';

const AddExpense = ({ onClose, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [trips, setTrips] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  // fetch the categories for category selection
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("expense_categories")
      .select("id, name");

    if (error) {
      console.error("Error fetching categories", error.message);
      return;
    }

    setCategories(data);
  };

  // Fetch trips
  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("id, name, start_date, end_date");

    if (error) {
      console.error("Error fetching trips.", error.message);
      return;
    }

    setTrips(data);

  }

  useEffect(() => {
    fetchCategories();
    fetchTrips();
  }, []);

  // Form
  const [form, setForm] = useState({
    expenseName: "",
    amount: "",
    category_id: "",
    date: "",
    trip_id: "",
  });

  // takes the user input and set the form for each
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // checks that all fields have user input
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.expenseName.trim() ||
      !form.amount ||
      !form.category_id ||
      !form.date
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // sends the form to handleSaveExpense function in Expenses.jsx
    onSave({
      ...form,
      amount: Number(form.amount),
    });

    onClose();

  }

  // organize add to trip selection by trip status
  const upcomingTrips = trips.filter((trip) => trip.start_date > today);
  const currentTrips = trips.filter(
    (trip) => trip.start_date <= today && trip.end_date >= today
  );
  const pastTrips = trips.filter((trip) => trip.end_date < today);

  const orderedTrips = [...currentTrips, ...upcomingTrips, ...pastTrips];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl mb-4 capitalize">
          Add New Expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Expense Name */}
          <div>
            <label className="text-sm text-zinc-400 capitalize">
              Name
            </label>
            <input
              type="text"
              name="expenseName"
              value={form.title}
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

          {/* Category Selection */}
          <div>
            <label className="text-sm text-zinc-400 capitalize">
              Category
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-white outline-none focus:border-green-300"
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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

          {/* Add Trip */}
          <div>
            <label className="text-sm text-zinc-400">
              Add expense to a trip?
            </label>
            <select
              name="trip_id"
              value={form.trip_id}
              onChange={handleChange}
              className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-white outline-none focus:border-blue-300"
            >
              <option value="">Select a Trip</option>

              {orderedTrips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
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
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense