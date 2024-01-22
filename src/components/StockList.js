import React, { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import axios from "axios";

const StockList = () => {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);

  async function getData() {
    const apiKey = "HYYWPKPI7YSU0TXJ"; // Replace with your Alpha Vantage API key
    const symbols = ["TSLA", "NFLX", "IBM", "KO"]; // Add more company symbols as needed

    const promises = symbols.map(async (symbol) => {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

      try {
        const response = await axios.get(url);
        return { [symbol]: response?.data?.["Global Quote"] || {} };
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return { [symbol]: {} };
      }
    });

    try {
      const results = await Promise.all(promises);
      const mergedData = Object.assign({}, ...results);
      setStockData(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  const [analyticsData, setAnalyticsData] = useState({});
  // const [loading, setLoading] = useState(true);
  const symbolsAnalytics = ["AAPL", "MSFT", "GOOGL", "AMZN", "NFLX", "IBM"];

  async function getAnalyticsData() {
    const apiKey = "HYYWPKPI7YSU0TXJ";

    // Fetch data from Analytics API for multiple symbols
    const urlAnalytics = `https://alphavantageapi.co/timeseries/analytics?SYMBOLS=${symbolsAnalytics.join(
      ","
    )}&RANGE=2023-07-01&RANGE=2023-08-31&INTERVAL=DAILY&OHLC=close&CALCULATIONS=MEAN,STDDEV,CORRELATION&apikey=${apiKey}`;

    try {
      const response = await axios.get(urlAnalytics);
      const data = response?.data?.payload?.RETURNS_CALCULATIONS || {};
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching data from Analytics API:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAnalyticsData();
  }, []);

  return (
    <div className="w-100  py-4 border mt-2 rounded shadow bg-light">
      <h2 className="mb-4 text-primary">Metrics</h2>
      {loading ? (
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover responsive className="mb-4">
          <thead className="bg-primary text-white">
            <tr className="text-center">
              <th>Company</th>
              <th>Previous Close</th>
              <th>Change</th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody>
            {Object?.entries(stockData)?.map(([symbol, data]) => (
              <tr key={symbol} className="text-center">
                <td>{symbol}</td>
                <td>{data["08. previous close"]}</td>
                <td>{data["09. change"]}</td>
                <td>{data["05. price"]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Table striped bordered hover responsive>
        <thead className="bg-primary text-white">
          <tr className="text-center">
            <th>Symbol</th>
            <th>Mean</th>
            <th>StdDev</th>
            <th>Correlation</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(analyticsData?.MEAN || {}).map(
            ([symbol, mean], index) => (
              <tr key={symbol} className="text-center">
                <td>{symbol}</td>
                <td>{analyticsData?.STDDEV?.[symbol]}</td>
                <td>{mean}</td>
                <td>
                  {symbolsAnalytics.map((targetSymbol, targetIndex) => (
                    <div key={targetSymbol} className="text-primary">
                      {targetSymbol !== symbol && targetIndex < index ? (
                        <span>
                          {targetSymbol}:{" "}
                          {
                            analyticsData?.CORRELATION?.correlation?.[
                              index - 1
                            ]?.[targetIndex]
                          }
                        </span>
                      ) : null}
                    </div>
                  ))}
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default StockList;
