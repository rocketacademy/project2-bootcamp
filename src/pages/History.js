// Components
import Navbar from "../components/Navbar";

// CSS
import "./History.css";

// dummy data
import database from "./historyDummyData";

const TradeLineItem = (props) => {
  return (
    <div className="trade-line">
      <p className="trade-info mb-0">{props.stockName}</p>
      <p className="trade-info mb-0">
        {new Date(props.tradeTime).toLocaleDateString()}
      </p>
      <p className="trade-info mb-0">{props.tradePrice}</p>
      <p className="trade-info mb-0">{props.platform}</p>
    </div>
  );
};

const History = () => {
  return (
    <div>
      <Navbar />
      <div className="col nav-margin">
        {/* Input here */}
        <div>
          <h1>Your Trades</h1>
          <div className="trades-container">
            <TradeLineItem
              stockName="AAPL"
              tradeTime={1702808925892}
              tradePrice={12.8 + "USD"}
              platform="thinkorswim"
            />
            {/* to-do, sort objects by date adn display from database */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
