import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const PieChart = () => {
  const [chartData] = useState({
    series1: [33, 27, 40],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["invesment", "cash", "Portfolio"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  // const [companyname, setCompanyName] = useState("apple");
  async function getyahhochartdata() {
    const options = {
      method: "GET",
      url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart",
      params: {
        interval: "1mo",
        symbol: "AMRN",
        range: "5y",
        region: "US",
        includePrePost: "false",
        useYfid: "true",
        includeAdjustedClose: "true",
        events: "capitalGain,div,split",
      },
      headers: {
        "X-RapidAPI-Key": "d6da08cc1fmsh2ffc0e825183be8p1c8245jsn3ba9199a4d47",
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response?.data?.chart?.result[0].meta);
      console.log(response?.data?.chart?.result[0]?.timestamp);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getyahhochartdata();
  }, []);
  return (
    <div id="chart" >
    <ReactApexChart
      options={chartData.options}
      series={chartData.series1}
      className="mt-4 p-3 border rounded shadow bg-light mx-2"
      type="pie"
      width={480}
    />
  </div>
  );
};

export default PieChart;
