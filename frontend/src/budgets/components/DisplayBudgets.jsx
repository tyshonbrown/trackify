import React from 'react'

const SpendBudget = ({ title, amount, children }) => {
    return (
        <div className="flex flex-row border-b border-zinc-700/40 py-4">

            <div className="grid grid-cols-[1fr_auto] items-center gap-8">
                <span className="text-white font-light">{title}</span>
                <span className="text-green-400 font-semibold">${amount}</span>
                
            </div>

            <div>
                {children}
            </div>

        </div>
    )
}

export default SpendBudget