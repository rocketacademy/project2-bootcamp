// React
import { useState, useEffect } from "react";

// Components
import Navbar from "../components/Navbar";
import TradeLineItem from "../components/History/TradeLineItem";
import FilterInputModal from "../components/History/FilterInputModal";
import HistoryDropdown from "../components/History/HistoryDropdown";
import AddTradeLineItem from "../components/History/AddTradeLineItem";

// Firebase
import { onChildAdded, ref, get } from "firebase/database";
import { database } from "../firebase.js";
import { auth } from "../firebase.js";

// CSS
import "./History.css";

const TRADES_KEY = "trades";

const History = () => {
  const [user, setUser] = useState("noUser");
  const [userDisplayName, setUserDisplayName] = useState("noUserDisplayName");
  const [sort, setSort] = useState("timeA");
  const [filter, setFilter] = useState("none");
  const [filterCat, setFilterCat] = useState("none");
  const [showModal, setShowModal] = useState(false);
  const [tradesArr, setTradesArr] = useState([]);
  const [tradelines, setTradelines] = useState(<div></div>);
  const [masterTradesArr, setMasterTradesArr] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser === null) {
        setUser("noUser");
        setUserDisplayName("noUserDisplayName");
      } else {
        setUser(auth.currentUser.uid);
        setUserDisplayName(auth.currentUser.displayName);
      }
    });
    return () => {
      unsubscribe();
    };
  });
  useEffect(() => {
    let loadedTrades = [];
    const tradesRef = ref(database, `${user}/${TRADES_KEY}`);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    const unsubscribe = onChildAdded(tradesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      loadedTrades = [...loadedTrades, { key: data.key, val: data.val() }];
      setTradesArr(loadedTrades);
      setMasterTradesArr(loadedTrades);
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => filterTrades(filter), [filter]);
  useEffect(() => {
    setTradesArr(sortTrades(tradesArr, sort));
    setTradelines(
      tradesArr.map((obj) => (
        <TradeLineItem
          key={obj.key}
          stockName={obj.val.stockName}
          stockCode={obj.val.stockCode}
          tradeTime={obj.val.date}
          tradePrice={obj.val.price + obj.val.currency}
          platform={obj.val.platform}
        />
      ))
    );
  }, [tradesArr, sort]);

  const sortTrades = (arr, sortMethod) => {
    const sortedArr = arr.sort(
      (objA, objB) =>
        (sortMethod === "timeA" ? -1 : 1) * (objB.val.date - objA.val.date)
    );
    return sortedArr;
  };

  const filterTradesInput = (filterCat) => {
    setFilterCat(filterCat);
    setShowModal(true);
  };

  const filterTrades = (filter) => {
    const loadedTrades = [];
    let trades = {};
    const tradesRef = ref(database, `${user}/${TRADES_KEY}`);
    if (filter === "none") {
      setTradesArr(masterTradesArr);
    } else {
      for (let i = 0; i < masterTradesArr.length; i++) {
        if (masterTradesArr[i].val[filterCat] === filter) {
          loadedTrades.push(masterTradesArr[i]);
        }
      }
      setTradesArr(loadedTrades);
    }
  };

  const handleClose = () => setShowModal(false);

  const noDisplayMessage = (
    <div className="no-display-message">
      <h2>Oops, there's nothing to display.</h2>
      <p>Try changing the filters or refreshing the page</p>
    </div>
  );

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
        <div>
          <div className="trades-header">
            <h1>Your Trades</h1>
            <div className="flex-row">
              <AddTradeLineItem />
              <HistoryDropdown
                isDark={isDark}
                setSort={setSort}
                filterTradesInput={filterTradesInput}
                setFilter={setFilter}
              />
            </div>
          </div>
          <div className="trades-container">
            <div className="trade-line">
              <p className="trade-info mb-0">Stock Name</p>
              <p className="trade-info mb-0">Stock Code</p>
              <p className="trade-info mb-0">Trade Time</p>
              <p className="trade-info mb-0">Price</p>
              <p className="trade-info mb-0">Platform</p>
            </div>
            {tradesArr.length === 0 ? noDisplayMessage : tradelines}
            {/* to-do, sort objects by date adn display from database */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
