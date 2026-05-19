import React from "react";
import { useState } from "react";

const NewTrip = ({ onClose, onSave }) => {

  // For created with blue as the default color selection
  const [form, setForm] = useState({
    name: "",
    destination: "",
    start_date: "",
    end_date: "",
    budget: "",
    notes: "",
    color: "blue",
  });

  // Trip theme colors
  const tripColors = [
    { name: "blue", className: "bg-blue-900" },
    { name: "green", className: "bg-green-900" },
    { name: "purple", className: "bg-purple-900" },
    { name: "pink", className: "bg-pink-900" },
    { name: "orange", className: "bg-orange-900" },
    { name: "red", className: "bg-red-900" },
  ];

  // Change to the form, updates the form values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // On Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.destination ||
      !form.start_date ||
      !form.end_date
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Sends the form info to handleSaveTrip function in Trips.jsx
    onSave({
      ...form,
      name: form.name.trim(),
      destination: form.destination.trim(),
      budget: form.budget ? Number(form.budget) : 0,
      notes: form.notes.trim(),
      color: form.color,
    });

    // Close the form
    onClose();

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">

        {/* Title */}
        <h2 className="text-xl mb-4 capitalize">
          Add New Trip
        </h2>

        {/* Call handleSubmit on submit */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Trip Name */}
          <div>
            <label className="text-sm text-zinc-400 capitalize">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-sm text-zinc-400 capitalize">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="e.g. Lisbon, Portugal"
              className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="text-sm text-zinc-400 capitalize">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm text-zinc-400 capitalize">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded"
                min={form.start_date || undefined}
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-sm text-zinc-400 capitalize">
              Budget
            </label>

            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                $
              </span>

              <input
                type="number"
                name="budget"
                min="1"
                step="0.01"
                value={form.budget}
                onChange={handleChange}
                className="w-full pl-7 pr-2 py-2 bg-black border border-zinc-700 rounded"
              />
            </div>
          </div>

          {/* Trip Color */}
          <div>
            <label className="text-sm text-zinc-400 capitalize">
              Trip Card Color
            </label>

            <div className="flex gap-3 mt-2">
              {tripColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      color: color.name,
                    }))
                  }
                  className={`
          w-8 h-8 rounded-full ${color.className}
          ${form.color === color.name ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900" : ""}
        `}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-zinc-400 capitalize">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={5}
              placeholder="Add any trip notes..."
              className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded resize-none"
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
              Save Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTrip;
