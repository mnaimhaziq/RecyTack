import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function Dashboard() {
  const chartRef = useRef();

  useEffect(() => {
    const chartInstance = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Recycling Waste",
            data: [120, 190, 90, 100, 220, 300],
            fill: true,
            borderColor: "#9c27b0",
            tension: 0.1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            color: "#ffffff", // change this to the color you want
          },
          legend: {
            labels: {
              color: "#ffffff", // change this to the color you want
            },
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "#ffffff",
                color: "#ffffff",
              },
            },
            
          ],
          xAxes: [
            {
              ticks: {
                fontColor: "#ffffff", // change this to the color you want for the tick labels
                color: "#ffffff", // change this to the color you want for the tick lines
              },
            },],
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, []);

  return (
    <>
      <div>
        <canvas
          ref={chartRef}
          style={{
            width: "400px",
            height: "300px",
            maxWidth: "100%",
            maxHeight: "100%",
            margin: "0 auto",
            display: "block",
          }}
        />
      </div>
      
    </>
  );
}

export default Dashboard;
