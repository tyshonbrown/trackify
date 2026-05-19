const Step = ({ number, title, text }) => {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-sm text-gray-300">
                {number}
            </div>

            <div>
                <h3 className="text-lg font-light mb-1">{title}</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default Step;