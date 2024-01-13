import React from "react";
import PieChart from "../components/PieChart";
import LineGraph from "../components/LineGraph";
import InsightChart from "../components/InsightChart";
import Navbar from "../components/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import StockList from "../components/StockList"
const Insights = () => {
  return (
    <div className="p-5">
      <Navbar />
      <div className="py-5">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Currently Showing Full Portfolio
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Last Month</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Last Year</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <h5 className="text-center ">Past six months performance</h5>
        <InsightChart />
        {/* <h4>Metrics</h4>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>twitter</td>
            </tr>
          </tbody>
        </table> */}
        <StockList/>
      </div>
    </div>
  );
};

export default Insights;
