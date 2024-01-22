import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Row, Col, Form } from 'react-bootstrap';

const InsightChart = () => {
  const [options] = useState({});
  const [series, setSeries] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("GOOGL");
  const [selectedTimeRange, setSelectedTimeRange] = useState("last6Months");

  const getAlphaVantageData = async () => {
    const apiKey = "HYYWPKPI7YSU0TXJ";

    let url = "";
    if (selectedTimeRange === "lastMonth") {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${selectedCompany}&apikey=${apiKey}`;
    } else if (selectedTimeRange === "last12Months") {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${selectedCompany}&apikey=${apiKey}`;
    } else {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${selectedCompany}&apikey=${apiKey}`;
    }

    try {
      const response = await axios.get(url);
      console.log(response?.data);

      const timeSeriesKey =
        selectedTimeRange === "lastMonth"
          ? "Time Series (Daily)"
          : selectedTimeRange === "last12Months"
          ? "Monthly Adjusted Time Series"
          : "Monthly Adjusted Time Series";

      const data = response?.data?.[timeSeriesKey];

      const extractedData = Object.entries(data)
        .slice(
          0,
          selectedTimeRange === "lastMonth"
            ? 30
            : selectedTimeRange === "last12Months"
            ? 12
            : 6
        )
        .map(([date, item]) => ({
          x:
            selectedTimeRange === "lastMonth"
              ? new Date(date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                })
              : new Date(date).toLocaleDateString("en-US", {
                  month: "long",
                }),
          y: parseFloat(
            selectedTimeRange === "lastMonth"
              ? item["5. adjusted close"]
              : selectedTimeRange === "last12Months"
              ? item["5. adjusted close"]
              : item["4. close"]
          ),
        }));

      setSeries([
        {
          name: "Adjusted Close Price",
          data: extractedData,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setSelectedTimeRange(event.target.value);
  };

  useEffect(() => {
    getAlphaVantageData();
  }, [selectedCompany, selectedTimeRange]);

  return (
    <div className="mt-5 p-4 border rounded shadow bg-light">
    <Row className="fw-bold d-flex align-items-center justify-content-around mb-3">
      <Col>
        <Form>
          <Form.Group controlId="companySelect">
            <Form.Label>Select Company:</Form.Label>
            <Form.Select
              value={selectedCompany}
              onChange={handleCompanyChange}
            >
              <option value="GOOGL">Google (GOOGL)</option>
              <option value="NFLX">Netflix (NFLX)</option>
              <option value="MSFT">Microsoft (MSFT)</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Col>
      <Col>
        <Form>
          <Form.Group controlId="timeRangeSelect">
            <Form.Label>Select Time Range:</Form.Label>
            <Form.Select
              value={selectedTimeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="last6Months">Last 6 Months</option>
              <option value="lastMonth">Last Month</option>
              <option value="last12Months">Last Year</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Col>
    </Row>

    <div className="fw-bold mb-3">Performance over the selected time range</div>
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  </div>
  );
};

export default InsightChart;
