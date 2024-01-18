import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const InsightChart = () => {
  const [chartData] = useState({
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  });
  async function getdata() {

      const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-insights',
        params: {symbol: 'AAPL'},
        headers: {
          'X-RapidAPI-Key': 'd6da08cc1fmsh2ffc0e825183be8p1c8245jsn3ba9199a4d47',
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      };
      
      try {
        const response = await axios.request(options);
        // console.log(response.data.finance.result);
        // console.log(response.data.finance.result.instrumentInfo.keyTechnicals.support);
        // console.log(response?.data?.finance.result.instrumentInfo);
      } catch (error) {
        console.error(error);
      }
      
    }
    useEffect(() => {
      getdata();
    }, []);
  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default InsightChart;
