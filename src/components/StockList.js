import React, { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import axios from "axios";

// Function to convert "4Q2022" to a more readable date format
const convertToReadableDate = (quarterYear) => {
  const match = quarterYear.match(/(\d)Q(\d{4})/);
  if (match) {
    const quarter = match[1];
    const year = match[2];
    const month = (parseInt(quarter) - 1) * 3 + 1;
    return new Date(`${year}-${month}-01`).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
  return quarterYear; // Return original string if the format is not as expected
};

const StockList = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getdata() {
    const options = {
      method: "GET",
      url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
      params: {
        symbol: "AMRN",
        region: "US",
      },
      headers: {
        "X-RapidAPI-Key": "d6da08cc1fmsh2ffc0e825183be8p1c8245jsn3ba9199a4d47",
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setStockData(response?.data?.earnings.financialsChart.quarterly || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getdata();
  }, []);

  return (
    <div className="w-25">
      <h2>Metrics</h2>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>Date</th>
              <th>$</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stockItem, i) => (
              <tr key={i} className="text-center">
                <td>{convertToReadableDate(stockItem?.date)}</td>
                <td className="text-center">{stockItem?.revenue?.fmt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StockList;
