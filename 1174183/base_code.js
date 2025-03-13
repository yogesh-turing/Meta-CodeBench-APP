// ChartComponent.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function ChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    if (userInput) {
      fetch(`https://api.example.com/data?q=${userInput}`)
        .then((response) => response.json())
        .then((data) => {
          const chartDataProcessed = data.map((item) => item.value);
          setChartData(chartDataProcessed);
        })
        .catch((error) => console.error('Error fetching chart data:', error));
    }
  }, [userInput]);


  useEffect(() => {
    const chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'My Dataset',
            data: chartData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Chart.js Example',
        },
      },
    });


    return () => chart.destroy();
  }, [chartData]);

  return (
    <div>
      <h1>Chart Example</h1>
      <input
        type="text"
        placeholder="Enter query"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)} 
      />
      <canvas id="myChart"></canvas>
    </div>
  );
}