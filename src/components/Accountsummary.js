// import { Link } from "react-router-dom";
// import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

const Accountsummary = () => {
  const data = { amountInvested: 1000, cash: 500, portoflioValue: 50000 };
  return (
    <div className="container ">
     
      <div className="row ">
        <div className="col gx-1">
          <span className="mr-2 ">Amount Invested:</span>
          <span className="mr-2 pl-2">
            {data.amountInvested}</span>
        </div>
        <div className="col">
          <div className="">
            cash:
            <span>{data.cash}</span>
          </div>
        </div>
        <div className="col">
          <div className="">
            portfolio value:
            <span>{data.portoflioValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accountsummary;

// {
  /* <div className="">
            {" "}
            amount Invested
            <span className="">{data.amountInvested}</span>
          </div> */
// }
