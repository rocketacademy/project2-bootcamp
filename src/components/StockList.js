import React, { useEffect, useState } from "react";
import { onValue, ref as databaseRef, remove } from "firebase/database";
import { database } from "../firebase";
import { Table } from "react-bootstrap";
const StockList = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Fetch stock data from Firebase
    const stockListRef = databaseRef(database, "stock");
    const unsubscribe = onValue(stockListRef, (snapshot) => {
      const stockArray = [];
      snapshot.forEach((childSnapshot) => {
        const stockItem = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        stockArray.push(stockItem);
      });
      setStockData(stockArray);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    // Remove stock entry from Firebase
    const stockItemRef = databaseRef(database, `stock/${id}`);
    remove(stockItemRef);
  };

  return (
    <div>
      <h2>Watchlist</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stockData?.map((stockItem) => (
            <tr key={stockItem.id}>
              <td>{stockItem.title}</td>
              <td>{stockItem.description}</td>

              <td>
                {/* <button onClick={() => handleDelete(stockItem.id)}>
                  Delete
                </button> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="red"
                  className="w-3 h-3"
                  style={{
                    width: "25px",
                    height: "25px",
                  }}
                  onClick={() => handleDelete(stockItem.id)}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StockList;
