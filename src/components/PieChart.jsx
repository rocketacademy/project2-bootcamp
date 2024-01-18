// import React, { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import axios from "axios";

// const PieChart = () => {
//   const [chartData] = useState({
//     series1: [44, 50, 23, 3, 22, 9],
//     series2: [12, 15, 33, 53, 32, 59],
//     series3: [33, 25, 43, 43, 42, 49],
//     series4: [14, 35, 53, 33, 52, 39],
//     series5: [12, 20, 30, 10, 16, 12],
//     options: {
//       chart: {
//         width: 380,
//         type: "pie",
//       },
//       labels: [
//         "Consumer discretionary",
//         "Financials",
//         "Telecommunications",
//         "Energy",
//         "Utilities",
//         "Basic Materials",
//       ],
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             chart: {
//               width: 400,
//             },
//             legend: {
//               position: "bottom",
//             },
//           },
//         },
//       ],
//     },
//   });
//   const [companyname, setCompanyName] = useState("apple");
//   async function getyahhochartdata() {
//     const options = {
//       method: "GET",
//       url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart",
//       params: {
//         interval: "1mo",
//         symbol: "AMRN",
//         range: "5y",
//         region: "US",
//         includePrePost: "false",
//         useYfid: "true",
//         includeAdjustedClose: "true",
//         events: "capitalGain,div,split",
//       },
//       headers: {
//         "X-RapidAPI-Key": "d6da08cc1fmsh2ffc0e825183be8p1c8245jsn3ba9199a4d47",
//         "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
//       },
//     };

//     try {
//       const response = await axios.request(options);
//       console.log(response?.data?.chart?.result[0].meta);
//       console.log(response?.data?.chart?.result[0]?.timestamp);
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   useEffect(() => {
//     getyahhochartdata();
//   }, []);
//   return(
//     <div id="chart">
//       {" "}
//       <select onChange={(e) => setCompanyName(e.target.value)}>
//         <option value="apple">Apple Inc</option>
//         <option value="stanchart">Stanchart</option>
//         <option value="sumsung">Sumsung</option>
//         <option value="vivo">Vivo</option>{" "}
//         <option value="realme">Realme</option>
//       </select>
//       <ReactApexChart
//         options={chartData.options}
//         series={
//           // chartData.series1

//           (() => {
//             switch (companyname) {
//               case "apple":
//                 return chartData.series1;
//               case "stanchart":
//                 return chartData.series2;
//               case "sumsung":
//                 return chartData.series3;
//               case "vivo":
//                 return chartData.series4;
//               case "realme":
//                 return chartData.series5;
//               default:
//                 return [];
//             }
//           })()
//         }
//         type="pie"
//         width={480}
//       />
//     </div>
//   );
// };

// export default PieChart;
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const PieChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: [],
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

  const getYahooChartData = async () => {
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
      console.log(response?.data);
      const timestamps = response?.data?.chart?.result[0]?.timestamp;
      const closePrices = response?.data?.chart?.result[0]?.indicators?.adjclose[0]?.adjclose;
  
      if (timestamps && closePrices) {
        const dateLabels = timestamps
          .map((timestamp) => new Date(timestamp * 1000))
          .filter((date) => date.getFullYear() >= 2024)
          .map((filteredDate) => filteredDate.toLocaleDateString());
  
        setChartData({
          series: closePrices.slice(dateLabels.length * -1), // Only take the data from 2021 onwards
          options: {
            ...chartData.options,
            labels: dateLabels,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching Yahoo Finance data:", error);
    }
  };
  
  useEffect(() => {
    getYahooChartData();
  }, []);

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
        options={chartData.options}
        series={chartData.series}
        type="pie"
        width={480}
      />
    </div>
  );
};

export default PieChart;
