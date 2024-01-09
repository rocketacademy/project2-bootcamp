import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineGraph = ({ companyname }) => {
  const [series1] = useState([
    {
      name: "Sales",
      data: [-10, 3, 10, 9, 29, 79, 22, 9, 12, 7, 19, 55, 13, 49, 17, 2, 89, 5],
    },
  ]);
  const [series2] = useState([
    {
      name: "Sales",
      data: [
        34, 43, 50, 69, 79, 85, 82, 70, 82, 71, 39, 5, 43, 66, 37, 32, 47, 55,
      ],
    },
  ]);
  const [series4] = useState([
    {
      name: "Sales",
      data: [
        -10, 13, 17, 19, 29, 49, 22, 9, 12, 27, 19, 55, 43, 49, 17, 12, 80, 51,
      ],
    },
  ]);
  const [series3] = useState([
    {
      name: "Sales",
      data: [
        43, 34, 16, 79, 39, 29, 32, 19, 42, 37, 59, 53, 13, 39, 17, 2, 7, 5,
      ],
    },
  ]);
  const [series5] = useState([
    {
      name: "Sales",
      data: [
        -10, 3, 10, 19, 29, 79, 22, 9, 12, 70, 19, 55, 13, 49, 17, 12, 59, 15,
      ],
    },
  ]);
  const [options] = useState({
    chart: {
      height: 350,
      type: "line",
    },
    forecastDataPoints: {
      count: 7,
    },
    stroke: {
      width: 5,
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "1/11/2000",
        "2/11/2000",
        "3/11/2000",
        "4/11/2000",
        "5/11/2000",
        "6/11/2000",
        "7/11/2000",
        "8/11/2000",
        "9/11/2000",
        "10/11/2000",
        "11/11/2000",
        "12/11/2000",
        "1/11/2001",
        "2/11/2001",
        "3/11/2001",
        "4/11/2001",
        "5/11/2001",
        "6/11/2001",
      ],
      tickAmount: 10,
      labels: {
        formatter: function (value, timestamp, opts) {
          return opts.dateFormatter(new Date(timestamp), "dd MMM");
        },
      },
    },
    title: {
      text: "Forecast",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#FDD835"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    yaxis: {
      min: -10,
      max: 90,
    },
  });
  
  // const [companyname, setCompanyName] = useState("apple");
  return (
    <div id="chart">
      {/* <select onChange={(e) => setCompanyName(e.target.value)}>
        <option value="apple">Apple Inc</option>
        <option value="stanchart">Stanchart</option>
        <option value="sumsung">Sumsung</option>
        <option value="vivo">Vivo</option>{" "}
        <option value="realme">Realme</option>
      </select> */}
      <ReactApexChart
        options={options}
        series={(() => {
          switch (companyname) {
            case "apple":
              return series1;
            case "stanchart":
              return series2;
            case "sumsung":
              return series3;
            case "vivo":
              return series4;
            case "realme":
              return series5;
            default:
              return [];
          }
        })()}
        type="line"
        height={350}
      />
    </div>
  );
};

export default LineGraph;
