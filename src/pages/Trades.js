// React
import { useState, useEffect } from "react";

// Components
import Navbar from "../components/Navbar.js";
import TradeLineItem from "../components/Trades/TradeLineItem.js";
import FilterInputModal from "../components/Trades/FilterInputModal.js";
import TradesDropdown from "../components/Trades/TradesDropdown.js";
import AddTradeLineItem from "../components/Trades/AddTradeLineItem.js";

// Firebase
import { onChildAdded, ref, remove } from "firebase/database";
import { database } from "../firebase.js";
import { auth } from "../firebase.js";

// CSS
import "./Trades.css";
import EditTradeModal from "../components/Trades/EditTradeModal.js";

const TRADES_KEY = "trades";

const Trades = () => {
  const [user, setUser] = useState("noUser");
  const [sort, setSort] = useState("timeA");
  const [filter, setFilter] = useState("none");
  const [filterCat, setFilterCat] = useState("none");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTrade, setEditTrade] = useState(false);
  const [tradesArr, setTradesArr] = useState([]);
  const [tradelines, setTradelines] = useState(<div></div>);
  const [masterTradesArr, setMasterTradesArr] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser === null) {
        setUser("noUser");
      } else {
        setUser(auth.currentUser.uid);
      }
    });
    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    let loadedTrades = [];
    const tradesRef = ref(database, `${user}/${TRADES_KEY}`);

    const unsubscribe = onChildAdded(tradesRef, (data) => {
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
          uid={obj.key}
          val={obj.val}
          handleDel={handleDel}
          handleEdit={handleEdit}
        />
      ))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDel = (tradeUid) => {
    remove(ref(database, `${user}/${TRADES_KEY}/${tradeUid}`)).then(() => {
      let newTradesArr = tradesArr;
      for (let i = 0; i < newTradesArr.length; i++) {
        if (newTradesArr[i].key === tradeUid) {
          newTradesArr.splice(i, 1);
          setTradesArr([...newTradesArr]);
          setMasterTradesArr([...newTradesArr]);
          break;
        }
      }
    });
  };

  const handleEdit = (trade) => {
    setEditTrade(trade);
    setShowEditModal(true);
  };

  const handleClose = (setter) => {
    setEditTrade(false);
    setter(false);
  };

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
          close={() => handleClose(setShowModal)}
          setFilter={setFilter}
        />
        <EditTradeModal
          show={showEditModal}
          close={() => handleClose(setShowEditModal)}
          trade={editTrade}
          tradesArr={tradesArr}
          setTradesArr={setTradesArr}
        />
        <div>
          <div className="trades-header">
            <h1>
              {auth.currentUser.displayName
                ? auth.currentUser.displayName + "'s"
                : "Your"}{" "}
              Trades
            </h1>
            <div className="flex-row">
              <AddTradeLineItem setFilter={setFilter} />
              <TradesDropdown
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
              <p className="trade-info mb-0">Buy/Sell</p>
              <p className="trade-info mb-0">Trade Time</p>
              <p className="trade-info mb-0">Price</p>
              <p className="trade-info mb-0">Platform</p>
              <p className="trade-info mb-0"></p>
            </div>
            {tradesArr.length === 0 ? noDisplayMessage : tradelines}
            {/* to-do, sort objects by date adn display from database */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trades;
