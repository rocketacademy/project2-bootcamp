import React from "react";
import ReactApexChart from "react-apexcharts";

class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [44, 55, 13, 43, 22,29],
      options: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: [
          "Consumer discretionary",
          "financials",
          "Telecommunications",
          "Energy",
          "Utilities",
          "Basic Materials",
          // "Telecommunications",
          // "Health Care",
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
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="pie"
          width={480}
        />
      </div>
    );
  }
}

export default PieChart;
