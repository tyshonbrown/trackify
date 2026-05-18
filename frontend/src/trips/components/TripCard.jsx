import React, { useState } from 'react';
import ViewTrip from './ViewTrip';

// Clickable Card with Trip information
const TripCard = ({ trip, type, onDelete, onEdit }) => {
    const [showTripInfo, setShowTripInfo] = useState(false);

    // Calculate the days left from the current date
    const daysLeft = (trip_start) => {
        const d = new Date();
        const today = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
        );

        const tripDate = new Date(trip_start + "T00:00:00");

        const diff = tripDate - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    // Date Format
    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
        });
    };

    // Trip Card colors
    const colorClasses = {
        blue: "bg-blue-900 hover:bg-blue-700",
        green: "bg-green-900 hover:bg-green-700",
        purple: "bg-purple-900 hover:bg-purple-700",
        pink: "bg-pink-900 hover:bg-pink-700",
        orange: "bg-orange-900 hover:bg-orange-700",
        red: "bg-red-900 hover:bg-red-700",
    };

    const tripColorClass = colorClasses[trip.color] || colorClasses.blue;

    return (
        <div>
            {/* Open the trip information when card is clicked */}
            <div
                onClick={() => setShowTripInfo(true)}
                className={`group cursor-pointer flex flex-col justify-between ${tripColorClass} rounded-lg w-64 h-64 p-4 text-left 
hover:-translate-y-1 hover:scale-[1.02] transition duration-200`}>
                <div className="flex items-start justify-between gap-3">
                    {/* Trip Name */}
                    <p className="text-4xl font-light">{trip.name}</p>

                    <div className="space-x-2">

                        {/* Edit button on hover */}
                        <button title="Edit" onClick={(e) => {
                            e.stopPropagation();
                            onEdit(trip);
                        }}
                            className="text-xl hover:text-2xl text-yellow-400 hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-all">
                            <i className="bx bxs-pencil" />
                        </button>


                        {/* Delete Button on hover */}
                        <button title="Delete" onClick={(e) => {
                            e.stopPropagation();
                            onDelete(trip);
                        }}
                            className="text-xl hover:text-2xl text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                            <i className="bx bxs-trash" />
                        </button>
                    </div>



                </div>

                <div className="">
                    {/* Destination */}
                    <p className="text-md text-zinc-400">{trip.destination}</p>

                    {/* Dates */}
                    <p className="text-md text-zinc-300">
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </p>

                    {/* If upcoming or current trip, display both days left and spending status */}
                    {(type === "upcoming" || type === "current") && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs text-zinc-300 bg-white/10 rounded-full px-2 py-1">
                                {daysLeft(trip.start_date)} days left
                            </span>
                            <span className="text-xs text-zinc-300 bg-black/50 rounded-full px-2 py-1">
                                ${trip.total_spent} / ${trip.budget} spent
                            </span>
                        </div>
                    )}

                    {/* Past trips only show total spent */}
                    {type === "past" && (
                        <div className="mt-3 flex flex-wrap">
                            <span className="text-xs text-zinc-300 bg-black/50 rounded-full px-2 py-1">
                                ${trip.total_spent} spent
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* When card is clicked, call the ViewTrip */}
            {showTripInfo && (
                <ViewTrip
                    trip={trip}
                    type={type}
                    formatDate={formatDate}
                    daysLeft={daysLeft}
                    onClose={() => setShowTripInfo(false)} />
            )}
        </div>
    );
};

export default TripCard;