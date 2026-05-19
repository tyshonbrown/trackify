import React from "react";
import Keys from "./Keys";
import { useState } from "react";

const Calc = () => {

  // Calculator buttons/keys
  const keys = [
    "AC",
    "C",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    ".",
    "0",
    "EQUALS",
  ];

  const [showResult, setShowResult] = useState(false);

  // Stores what displays on the calc screen
  const [display, setDisplay] = useState("");

  // User cannot type more than 15 characters into the calculator
  const maxLimit = 15;

  // Runs when equal button is clicked
  const calculateResult = () => {

    // Make sure there was user input
    if (display.length !== 0) {
      try {

        // evaluates the input string as JS Math
        let calcResult = eval(display);

        // Round result to 3 decimal places
        calcResult = parseFloat(calcResult.toFixed(3));

        // Display the result
        setDisplay(calcResult);
        setShowResult(true);

      } catch (error) {
        setDisplay("Error");
      }
    } else setDisplay("");
  }

  // Runs everytime a button is clicked
  const handleButton = (value) => {

    setShowResult(false);

    // AC clears the display
    if (value === "AC") {
      setDisplay("");

    // C deletes one char at the end
    } else if (value === "C") {
      setDisplay(display.slice(0, -1));

    // Checks if button clicked is an operator
    } else if (isOperator(value)) {

      if (display == "" || isOperator(display[display.length - 1])) return;
      setDisplay(display + value);

    // Calculate the result when equals is clicked
    } else if (value === "EQUALS") {
      calculateResult();

    } else if (display.length >= maxLimit) {
      alert(`maximum characters allowed : ${maxLimit}`);

    } else { setDisplay(display + value); }
  }

  // Checks whether a character is an operator
  const isOperator = (char) => {
    return ["*", "/", "%", "+", "-"].includes(char);
  }

  const operationClass =
    "text-[1.2rem] tracking-[2px] flex gap-[5px] items-center text-[rgba(255,255,255,0.5)] justify-end";
  const resultClass = "text-[1.7rem]";

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-black">
      {/* Title */}
      <div className="w-full border-b border-gray-900 mb-10">
        <h1 className="text-4xl md:text-5xl font-thin mb-2">CALCULATOR</h1>
      </div>


      <div className="min-w-[320px] bg-gray-900 flex flex-col gap-4 p-6 rounded-2xl">
        <div
          className="overflow-x-auto bg-[#141414] min-h-[100px] 
        flex items-end justify-end flex-col p-4 rounded-[10px]"
        >
          {/* Shows the current value of display */}
          <div className={`${showResult ? resultClass : operationClass}`}>
            {display}
          </div>
        </div>

        {/* Render buttons / keys */}
        <div className="grid grid-cols-[repeat(4,1fr)] gap-[0.3rem]">
          {keys.map((item, index) => (
            <Keys
              label={item}
              key={index}
              keyClass={item === "EQUALS" && "equals"}
              onButtonClick={handleButton}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calc;
