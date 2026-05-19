import React from 'react'

const DisplayIncome = ({ title, description, isOpen, onOpen, onEdit, children }) => {
  return (
    <div
            onClick={onOpen}
            className={`border-b border-zinc-700 py-4 cursor-pointer transition-all duration-200 ease-in-out
            ${isOpen ? "bg-slate-950 rounded" : "hover:bg-zinc-900/60"}`}
        >

            {/* Header */}
            <div className="flex items-center justify-between">

                {/* Title and Description */}
                <div className="text-left flex flex-col">
                    <h3 className="text-lg font-light">{title}</h3>
                    <p className="text-xs text-zinc-500">{description}</p>
                </div>

                {/* Edit Button */}
                {title === "Monthly Income" && (<button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                >
                    Edit
                </button>)}
            </div>

            {/* Content */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden
    ${isOpen ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
            >
                {children}
            </div>
        </div>
  )
}

export default DisplayIncome