import React from "react";
import InsightChart from "../components/InsightChart";
import Navbar from "../components/Navbar";
import StockList from "../components/StockList";
const Insights = () => {
  return (
    <div className="p-5">
      <Navbar />
      <div className="py-5 ">
        <InsightChart />
        <StockList />
      </div>
    </div>
  );
};

export default Insights;
