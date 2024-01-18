// import { Link } from "react-router-dom";
// import Container from "react-bootstrap/Container";
// import{ chart} from 'react-google-charts';
import PieChat from "../components/PieChart";
import Grid from "../components/Grid";
import LineGraph from "./LineGraph";
import Dropdown from "react-bootstrap/Dropdown";
import triangle from "../assets/triangle.png";
import DropdownButton from "react-bootstrap/DropdownButton";
import News from "./News";
import React, { useState } from "react";
import StockList from "./StockList";import WatchLists from "./WatchLists";
;

const Performance = () => {
  // Sample data for the pie chart
  // const piechartdata = [
  //   ['', ''],
  //   ['Work', 11],
  //   ['Eat', 2],
  //   ['Sleep', 7],
  // ];
  const [companyname, setCompanyName] = useState("apple");

  return (
    // <div className="container">
    //   <div className="row">
    //     <div className="col gx-4">
    <div className="container ">
      <div className="row">
        <div className="col gx-5">
          <div
           className="d-flex "
          >
            <div className="fw-bold">Perfomance over the past 6 months </div>{" "}
            {/* <select onChange={(e) => setCompanyName(e.target.value)}>
              <option value="apple">Apple Inc</option>
              <option value="stanchart">Stanchart</option>
              <option value="sumsung">Sumsung</option>
              <option value="vivo">Vivo</option>{" "}
              <option value="realme">Realme</option>
            </select> */}
          </div>
          <div className="fw-bold">Pie chart of portfolio</div>
          {/* <LineGraph /> */}
          <LineGraph 
          // companyname={companyname}
           />

          <div>
            <div className="d-flex justify-content-between">
              <PieChat />
              {/* <Grid /> */}
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
