import React from 'react';

const BudgetSection = ({ title, description, isOpen, onOpen, children }) => {
    return (
        <div className="border-b border-zinc-700 py-4">

            {/* Header */}
            <button onClick={onOpen} className="w-full text-left">
                <h3 className="text-lg font-light">{title}</h3>
                <p className="text-xs text-zinc-500">{description}</p>
            </button>

            {/* Content */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden
            ${isOpen ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                {children}
            </div>
            
        </div>
    );
};

export default BudgetSection;