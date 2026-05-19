import React from 'react'
import { supabase } from '@/supabaseClient';
import { useState, useEffect } from 'react';

// Allows users to select a category and show expenses based on that selection
const Categories = ({ activeCategory, setActiveCategory, setActiveCategoryName }) => {
    const [categories, setCategories] = useState([]);
    const [categorySearch, setCategorySearch] = useState("");

    // Filter categories based on search input
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // get categories
    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from("expense_categories")
            .select("id, name, budget_group");

        if (error) {
            console.error(error);
            return;
        }

        setCategories(data);

    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div
            className="flex-1 border border-gray-600 rounded bg-gray-500/15 p-4
          flex flex-col"
        >
            {/* Title */}
            <h2 className="text-xl font-semibold mb-4 text-center">Categories</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search categories..."
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white text-sm outline-none
            focus:ring-2 focus:ring-green-300" />


            {/* Categoy Options */}
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-28 lg:max-h-64 pr-1">

                {/* ALL Option */}
                <button
                    onClick={() => {
                        setActiveCategory("all");
                        setActiveCategoryName("All");
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition
        ${activeCategory === "all"
                            ? "bg-green-400 text-black"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                >
                    All
                </button>

                {/* Specific Options */}
                {filteredCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveCategory(cat.id);
                            setActiveCategoryName(cat.name);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
          ${activeCategory === cat.id
                                ? "bg-green-400 text-black"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Categories;