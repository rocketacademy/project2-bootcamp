// import { Link } from "react-router-dom";
// import Container from "react-bootstrap/Container";
// import{ chart} from 'react-google-charts';
import PieChat from "../components/PieChart";
import Grid from "../components/Grid";
import LineGraph from "./LineGraph";
import Dropdown from "react-bootstrap/Dropdown";
import triangle from "../assets/triangle.png";
import DropdownButton from "react-bootstrap/DropdownButton";
const Performance = () => {
  // Sample data for the pie chart
  // const piechartdata = [
  //   ['', ''],
  //   ['Work', 11],
  //   ['Eat', 2],
  //   ['Sleep', 7],
  // ];
  return (
    // <div className="container">
    //   <div className="row">
    //     <div className="col gx-4">
    <div className="container ">
      <div className="row">
        <div className="col gx-5">
          <div className="d-flex justify-content-between">
            <div className="fw-bold">Perfomance over the past 6 months </div>{" "}
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                <img src={triangle} alt="" width={30} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Apple Inc</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Stanchart</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="fw-bold">Pie chart of portfolio</div>
          <LineGraph />

          <div>
            <div className="d-flex justify-content-between">
              <PieChat />
              <Grid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
