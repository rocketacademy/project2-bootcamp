import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = () => {
  const [chartData] = useState({
    series1: [44, 50, 23, 3, 22, 9],
    series2: [12, 15, 33, 53, 32, 59],
    series3: [33, 25, 43, 43, 42, 49],
    series4: [14, 35, 53, 33, 52, 39],
    series5: [12, 20, 30, 10, 16, 12],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: [
        "Consumer discretionary",
        "Financials",
        "Telecommunications",
        "Energy",
        "Utilities",
        "Basic Materials",
      ],
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
  const [companyname, setCompanyName] = useState("apple");

  return (
    
    <div id="chart"> <select onChange={(e) => setCompanyName(e.target.value)}>
        <option value="apple">Apple Inc</option>
        <option value="stanchart">Stanchart</option>
        <option value="sumsung">Sumsung</option>
        <option value="vivo">Vivo</option>{" "}
        <option value="realme">Realme</option>
      </select>
      <ReactApexChart
        options={chartData.options}
        series={
          // chartData.series1
        
         (() => {
      switch (companyname) {
        case "apple":
          return chartData.series1;
        case "stanchart":
          return chartData.series2;
        case "sumsung":
          return chartData.series3;    
        case "vivo":
          return chartData.series4;        
        case "realme":
          return chartData.series5;
        default:
          return [];
      } })()}
        type="pie"
        width={480}
      />
    </div>
  );
};

export default PieChart;
