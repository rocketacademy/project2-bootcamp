import LineGraph from "./LineGraph";
import News from "./News";
import React from "react";
import WatchLists from "./WatchLists";
import PieChart from "../components/PieChart";

const Performance = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-!2">
          <div className="d-flex flex-column">
            <LineGraph />
            <div className="fw-bold text-start mt-3">Pie chart of portfolio</div>
            <div className="d-flex flex-column flex-lg-row justify-content-between">
              <PieChart className="mb-3 mb-lg-0" />
              <WatchLists />
            </div>
          </div>
        </div>
        <News />
      </div>
    </div>
  );
};

export default Performance;
