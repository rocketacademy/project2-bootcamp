// React
import { useState, useEffect } from "react";

// Components
import Navbar from "../components/Navbar";
import TradeLineItem from "../components/TradeLineItem";
import FilterInputModal from "../components/FilterInputModal";
import HistoryDropdown from "../components/HistoryDropdown";

// CSS
import "./History.css";

// dummy data
import database from "./historyDummyData";

const History = () => {
  const [sort, setSort] = useState("timeA");
  const [filter, setFilter] = useState("none");
  const [filterCat, setFilterCat] = useState("none");
  const [showModal, setShowModal] = useState(false);
  const [tradesArr, setTradesArr] = useState(database[12345].trades[1]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => setTradesArr(sortTrades(tradesArr, sort)), [tradesArr, sort]);
  useEffect(() => filterTrades(filter), [filter]);

  const sortTrades = (arr, sortMethod) => {
    const isAscending = sortMethod === "timeA" ? true : false;
    const sortedArr = arr.sort(
      (objA, objB) => (isAscending ? 1 : -1) * (objB.date - objA.date)
    );
    return sortedArr;
  };

  const filterTradesInput = (filterCat) => {
    setFilterCat(filterCat);
    setShowModal(true);
  };

  const filterTrades = (filter) => {
    if (filter === "none") {
      return;
    }
    const loadedTrades = [];
    const trades = database[12345].trades[1];
    for (let i = 0; i < trades.length; i++) {
      if (trades[i][filterCat] === filter) {
        loadedTrades.push(trades[i]);
      }
    }
    setTradesArr(loadedTrades);
  };

  const handleClose = () => setShowModal(false);

  const noDisplayMessage = (
    <div className="no-display-message">
      <h2>Oops, there's nothing to display.</h2>
      <p>Try changing the filters or refreshing the page</p>
    </div>
  );

  const tradeLines = tradesArr.map((lineItem, index) => (
    <TradeLineItem
      key={index}
      stockName={lineItem.stockName}
      stockCode={lineItem.stockCode}
      tradeTime={lineItem.date}
      tradePrice={lineItem.price + lineItem.currency}
      platform={lineItem.platform}
    />
  ));

  return (
    <div>
      <Navbar />
      <div className="col nav-margin">
        <FilterInputModal
          filterCat={filterCat}
          show={showModal}
          close={handleClose}
          setFilter={setFilter}
        />
        {/* Input here */}
        <div>
          <div className="trades-header">
            <h1>Your Trades</h1>
            <HistoryDropdown
              isDark={isDark}
              setSort={setSort}
              filterTradesInput={filterTradesInput}
            />
          </div>
          <div className="trades-container">
            <div className="trade-line">
              <p className="trade-info mb-0">Stock Name</p>
              <p className="trade-info mb-0">Stock Code</p>
              <p className="trade-info mb-0">Trade Time</p>
              <p className="trade-info mb-0">Price</p>
              <p className="trade-info mb-0">Platform</p>
            </div>
            {tradesArr.length === 0 ? noDisplayMessage : tradeLines}
            {/* to-do, sort objects by date adn display from database */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
