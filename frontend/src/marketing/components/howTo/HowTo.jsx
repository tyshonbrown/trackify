import React from "react";
import GetStartedSection from "./GetStartedSection";
import LogExpenseSection from "./LogExpenseSection";
import SetBudgetsSection from "./SetBudgetsSection";
import TrendsSection from "./TrendsSection";
import TripsSection from "./TripsSection";

const HowTo = () => {
  return (
    <section className="bg-black text-white px-5 py-20">
      <div className="max-w-7xl mx-auto">
        <GetStartedSection />
        <LogExpenseSection />
        <SetBudgetsSection />
        <TrendsSection />
        <TripsSection />
      </div>
    </section>
  );
};

export default HowTo;