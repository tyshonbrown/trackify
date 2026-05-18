import { supabase } from '@/supabaseClient';
import React, { useState, useEffect } from 'react'

const AddToTrip = ({ expense, onClose, onSave, onRemove }) => {

    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [removeTrip, setRemoveTrip] = useState(false);
    const today = new Date().toISOString().split("T")[0];

    // Fetching Trip data
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
        fetchTrips();
    }, []);


    useEffect(() => {
        setSelectedTrip(expense?.trip_id || null);
    }, [expense]);

    // Organizing Trips by Upcoming, Past, and Current
    const upcomingTrips = trips.filter((trip) => trip.start_date > today);
    const currentTrips = trips.filter(
        (trip) => trip.start_date <= today && trip.end_date >= today
    );
    const pastTrips = trips.filter((trip) => trip.end_date < today);

    const orderedTrips = [...currentTrips, ...upcomingTrips, ...pastTrips];

    // Getting a trips status
    const getTripStatus = (trip) => {
        const today = new Date().toISOString().split("T")[0];
        if (trip.start_date > today) return "Upcoming";
        if (trip.start_date <= today && trip.end_date >= today) return "In Progress";
        return "Past";
    }

    // Finding the trip an expense is already connected to
    const assignedTrip = orderedTrips.find((trip) => trip.id === expense?.trip_id);
    const otherTrips = orderedTrips.filter((trip) => trip.id !== expense?.trip_id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col">

                {expense.trip_id ? (
                    <>
                        <div className="text-sm text-zinc-400">Current trip assigned</div>
                        <div className="text-xs text-zinc-400/40 mb-2">Click to Remove</div>

                        {/* Current Trip assigned is already selected */}
                        {assignedTrip && (
                            <button
                                onClick={() => {
                                    if (selectedTrip === assignedTrip.id) {
                                        setSelectedTrip(null);
                                        setRemoveTrip(true);
                                    } else {
                                        setSelectedTrip(assignedTrip.id);
                                        setRemoveTrip(false);
                                    }
                                }}
                                className={`rounded-md border px-3 py-2 text-left mb-6 ${(selectedTrip === assignedTrip.id)
                                    ? "border-blue-500 bg-blue-500/20"
                                    : "border-zinc-700"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>
                                        {assignedTrip.name}{" "}
                                        <span className="opacity-50 italic">
                                            - {getTripStatus(assignedTrip)}
                                        </span>
                                    </span>

                                    {selectedTrip === assignedTrip.id && (
                                        <span className="text-blue-400">✓</span>
                                    )}
                                </div>
                            </button>
                        )}

                        <div className="text-sm text-zinc-400 mb-2">Change to another trip</div>
                    </>
                ) : (
                    <div className="text-sm text-zinc-400 mb-2">Select a trip...</div>
                )}

                <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                    {(expense.trip_id ? otherTrips : orderedTrips).map((trip) => (
                        <button
                            key={trip.id}
                            onClick={() => {
                                setSelectedTrip(trip.id);
                                setRemoveTrip(false);
                            }}
                            className={`rounded-md border px-3 py-2 text-left ${selectedTrip === trip.id
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-zinc-700"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>
                                    {trip.name}{" "}
                                    <span className="opacity-50 italic">- {getTripStatus(trip)}</span>
                                </span>

                                {selectedTrip === trip.id && (
                                    <span className="text-blue-400">✓</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="text-sm text-zinc-400 hover:text-white"
                    >
                        Cancel
                    </button>

                    {removeTrip ? (

                        <button
                            onClick={onRemove}
                            className="px-3 py-2 rounded-md bg-red-500 text-white text-sm"
                        >
                            Remove Expense from Trip
                        </button>

                    ) : (
                        <button
                            onClick={() => onSave(selectedTrip)}
                            disabled={!selectedTrip}
                            className="px-3 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50 text-sm"
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddToTrip