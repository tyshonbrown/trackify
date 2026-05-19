import React, { useEffect } from "react";
import NewTrip from "../components/NewTrip";
import { useState } from "react";
import { supabase } from "@/supabaseClient";
import TripCard from "../components/TripCard";
import EditTrip from "../components/EditTrip";

const Trips = () => {
  const [showAddNewTrip, setShowAddNewTrip] = useState(false);
  const [trips, setTrips] = useState([]);
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Fetch all Trips from supabase
  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*");

    if (error) {
      console.error("Error fetching trips.", error.message);
      return;
    }

    setTrips(data);
  }

  useEffect(() => {
    fetchTrips();
  }, []);

  // Save a new Trip
  const handleSaveTrip = async (newTrip) => {

    // Insertion
    const { error } = await supabase
      .from("trips")
      .insert([{
        name: newTrip.name,
        destination: newTrip.destination,
        start_date: newTrip.start_date,
        end_date: newTrip.end_date,
        budget: newTrip.budget,
        notes: newTrip.notes,
        color: newTrip.color,
      },
      ]);

    if (error) {
      console.error("Error saving new trip.", error.message);
      return;
    }

    // Refresh trups
    fetchTrips();
    setShowAddNewTrip(false);
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setShowEditTrip(true);
  };

  // Delete Trip
  const handleDeleteTrip = async (trip) => {

    // Confirmation
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${trip.name}"? This cannot be undone.`
    );

    if (!confirmDelete) return;

    // Deletion
    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("id", trip.id);

    if (error) {
      console.error("Error deleting trip.", error.message);
      return;
    }

    // Refresh trips
    fetchTrips();
  };

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // Get all upcoming/futre trips and sort
  const upcomingTrips = trips
    .filter((trip) => trip.start_date > today)
    .sort(
      (a, b) =>
        new Date(a.start_date + "T00:00:00") -
        new Date(b.start_date + "T00:00:00")
    );

  // Get current trips
  const currentTrips = trips
    .filter((trip) => trip.start_date <= today && trip.end_date >= today)
    .sort(
      (a, b) =>
        new Date(a.start_date + "T00:00:00") -
        new Date(b.start_date + "T00:00:00")
    );

  // Get past trips
  const pastTrips = trips
    .filter((trip) => trip.end_date < today)
    .sort(
      (a, b) =>
        new Date(b.start_date + "T00:00:00") -
        new Date(a.start_date + "T00:00:00")
    );

  return (
    <div className="flex flex-col items-start space-y-4 p-4 bg-black">
      {/* TRIPS Header */}
      <div className="w-full border-b border-gray-900">
        <h1 className="text-4xl md:text-5xl font-thin mb-2">TRIPS</h1>
      </div>

      {/* New Trip Button */}
      <div className="flex justify-start">
        <button
          onClick={() => setShowAddNewTrip(true)}
          className="bg-green-700 hover:bg-green-800 rounded py-3 px-14">
          + New Trip
        </button>
      </div>

      {/* Show CURRENT trips first, if applicable */}
      {currentTrips.length > 0 && (
        <div className="flex flex-col w-full">
          <div className="w-full border-b border-gray-900">
            <h1 className="text-2xl font-thin md:text-2xl mb-2">In Progress</h1>
          </div>

          {/* TripCard component with the trip object, type set, and functions to call
          onDelete and onEdit */}
          <div className="flex flex-row overflow-x-auto gap-4 mt-4">
            {currentTrips.map((trip) => {
              return (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  type="current"
                  onDelete={handleDeleteTrip}
                  onEdit={handleEditTrip}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Show UPCOMING Trips */}
      {upcomingTrips.length > 0 ? (
        <div className="flex flex-col w-full">
          <div className="w-full border-b border-gray-900">
            <h1 className="text-2xl font-thin md:text-2xl mb-2">Upcoming</h1>
          </div>

          <div className="flex flex-row overflow-x-auto gap-4 mt-4">
            {upcomingTrips.map((trip) => {
              return (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  type="upcoming"
                  onDelete={handleDeleteTrip}
                  onEdit={handleEditTrip}
                />
              );
            })}
          </div>
        </div>
      ) : (<p className="text-lg text-zinc-500 mt-4">No upcoming trips.</p>)}

      {/* Show PAST Trups last */}
      {pastTrips.length > 0 && (
        <div className="flex flex-col w-full">
          <div className="w-full border-b border-gray-900">
            <h1 className="text-2xl font-thin md:text-2xl mb-2">Past</h1>
          </div>

          <div className="flex flex-row overflow-x-auto gap-4 mt-2">
            {pastTrips.map((trip) => {
              return (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  type="past"
                  onDelete={handleDeleteTrip}
                  onEdit={handleEditTrip}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Open New Trip form */}
      {showAddNewTrip && (
        <NewTrip
          onClose={() => setShowAddNewTrip(false)}
          onSave={handleSaveTrip}
        />
      )}

      {/* Open Edit Trip form */}
      {showEditTrip && selectedTrip && (
        <EditTrip
          trip={selectedTrip}
          onClose={() => {
            setShowEditTrip(false);
            setSelectedTrip(null);
          }}
          onSave={fetchTrips}
        />
      )}
    </div>
  );
};

export default Trips;
