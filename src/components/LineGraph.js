// import React, { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import axios from "axios";

// const LineGraph = ({ companyname }) => {
//   const [series1] = useState([
//     {
//       name: "Sales",
//       data: [-10, 3, 10, 9, 29, 79, 22, 9, 12, 7, 19, 55, 13, 49, 17, 2, 89, 5],
//     },
//   ]);
//   const [series2] = useState([
//     {
//       name: "Sales",
//       data: [
//         34, 43, 50, 69, 79, 85, 82, 70, 82, 71, 39, 5, 43, 66, 37, 32, 47, 55,
//       ],
//     },
//   ]);
//   const [series4] = useState([
//     {
//       name: "Sales",
//       data: [
//         -10, 13, 17, 19, 29, 49, 22, 9, 12, 27, 19, 55, 43, 49, 17, 12, 80, 51,
//       ],
//     },
//   ]);
//   const [series3] = useState([
//     {
//       name: "Sales",
//       data: [
//         43, 34, 16, 79, 39, 29, 32, 19, 42, 37, 59, 53, 13, 39, 17, 2, 7, 5,
//       ],
//     },
//   ]);
//   const [series5] = useState([
//     {
//       name: "Sales",
//       data: [
//         -10, 3, 10, 19, 29, 79, 22, 9, 12, 70, 19, 55, 13, 49, 17, 12, 59, 15,
//       ],
//     },
//   ]);
//   const [options] = useState({
//     chart: {
//       height: 350,
//       type: "line",
//     },
//     forecastDataPoints: {
//       count: 7,
//     },
//     stroke: {
//       width: 5,
//       curve: "smooth",
//     },
//     xaxis: {
//       type: "datetime",
//       categories: [
//         "1/11/2000",
//         "2/11/2000",
//         "3/11/2000",
//         "4/11/2000",
//         "5/11/2000",
//         "6/11/2000",
//         "7/11/2000",
//         "8/11/2000",
//         "9/11/2000",
//         "10/11/2000",
//         "11/11/2000",
//         "12/11/2000",
//         "1/11/2001",
//         "2/11/2001",
//         "3/11/2001",
//         "4/11/2001",
//         "5/11/2001",
//         "6/11/2001",
//       ],
//       tickAmount: 10,
//       labels: {
//         formatter: function (value, timestamp, opts) {
//           return opts.dateFormatter(new Date(timestamp), "dd MMM");
//         },
//       },
//     },
//     title: {
//       text: "Forecast",
//       align: "left",
//       style: {
//         fontSize: "16px",
//         color: "#666",
//       },
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shade: "dark",
//         gradientToColors: ["#FDD835"],
//         shadeIntensity: 1,
//         type: "horizontal",
//         opacityFrom: 1,
//         opacityTo: 1,
//         stops: [0, 100, 100, 100],
//       },
//     },
//     yaxis: {
//       min: -10,
//       max: 90,
//     },
//   });

//   // const [companyname, setCompanyName] = useState("apple");
//   const getyahoodata = async () => {
//     const optionss = {
//       method: "GET",
//       url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
//       params: {
//         symbol: "AMRN",
//         region: "US",
//       },
//       headers: {
//         "X-RapidAPI-Key": "d6da08cc1fmsh2ffc0e825183be8p1c8245jsn3ba9199a4d47",
//         "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
//       },
//     };

//     try {
//       const response = await axios.request(optionss);
//       console.log(response.data.earnings.financialsChart.yearly);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   useEffect(() => {
//     getyahoodata()
//   }, [])

//   return (
//     <div id="chart">
//       <ReactApexChart
//         options={options}
//         series={(() => {
//           switch (companyname) {
//             case "apple":
//               return series1;
//             case "stanchart":
//               return series2;
//             case "sumsung":
//               return series3;
//             case "vivo":
//               return series4;
//             case "realme":
//               return series5;
//             default:
//               return [];
//           }
//         })()}
//         type="line"
//         height={350}
//       />
//     </div>
//   );
// };

// export default LineGraph;
// import React, { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import axios from "axios";

// const LineGraph = () => {
//   const [options] = useState({
//     // your existing options
//   });

//   const [series, setSeries] = useState([]);

//   const getAlphaVantageData = async () => {
//     const symbol = "TSLA"; // Replace with the desired stock symbol
//     const apiKey = "S23I1KOF539FHN0W"; // Replace with your Alpha Vantage API key

//     const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${apiKey}`;

//     try {
//       const response = await axios.get(url);
//       console.log(response?.data);

//       const monthlyData = response?.data?.["Monthly Adjusted Time Series"];

//       // Extract relevant data for the graph
//       const extractedData = Object.entries(monthlyData)
//         .slice(0, 6) // Get only the last six months
//         .map(([date, item]) => ({
//           x: new Date(date).toLocaleDateString("en-US", { month: "long" }), // Format month name
//           y: parseFloat(item["5. adjusted close"]), // Adjusted close price as a floating-point number
//         }));

//       setSeries([
//         {
//           name: "Adjusted Close Price",
//           data: extractedData,
//         },
//       ]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     getAlphaVantageData();
//   }, []);

//   return (
//     <div id="chart">
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="line"
//         height={350}
//       />
//     </div>
//   );
// };

// export default LineGraph;

//
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const LineGraph = () => {
  const [options] = useState({
    // your existing options
  });

  const [series, setSeries] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("TSLA"); // Default selected company

  const getAlphaVantageData = async () => {
    const apiKey = "HYYWPKPI7YSU0TXJ"; // Replace with your Alpha Vantage API key

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${selectedCompany}&apikey=${apiKey}`;

    try {
      const response = await axios.get(url);
      console.log(response?.data);

      const monthlyData = response?.data?.["Monthly Adjusted Time Series"];

      // Extract relevant data for the graph
      const extractedData = Object.entries(monthlyData)
        .slice(0, 6) // Get only the last six months
        .map(([date, item]) => ({
          x: new Date(date).toLocaleDateString("en-US", { month: "long" }), // Format month name
          y: parseFloat(item["5. adjusted close"]), // Adjusted close price as a floating-point number
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

  useEffect(() => {
    getAlphaVantageData();
  }, [selectedCompany]); // Trigger the effect when the selectedCompany changes

  return (
    <div>
     <div className="mt-4 p-3 border rounded shadow bg-light">
      <div className="d-flex align-items-center">
        <label htmlFor="companySelect" className="fw-bold me-2">
          Select Company:
        </label>
        <select
          id="companySelect"
          value={selectedCompany}
          onChange={handleCompanyChange}
          className="form-select"
        >
          <option value="TSLA">Tesla (TSLA)</option>
          <option value="AAPL">Apple (AAPL)</option>
          <option value="MSFT">Microsoft (MSFT)</option>
        </select>
      </div>
      <div className="fw-bold ">Performance over the past 6 months</div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
          // className="mt-4 p-3 border rounded shadow bg-light "
        />
      </div>
    </div>
    </div>
  );
};

export default LineGraph;
