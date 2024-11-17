"use client";

// MarketDepthChart.js

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-annotation';

ChartJS.register(LinearScale, LineElement, PointElement, Tooltip, Legend);

function MarketDepthChart({ bids = [], asks = [] }) {
    if (!Array.isArray(bids) || !Array.isArray(asks)) {
      console.error("Invalid data received for bids or asks:", { bids, asks });
      return <div>Market depth data is unavailable.</div>;
    }
  
    // Prepare cumulative bid and ask data for the depth chart
    const cumulativeBids = [];
    const cumulativeAsks = [];
    let cumulativeBidQuantity = 0;
    let cumulativeAskQuantity = 0;
  
    bids.forEach(([price, quantity]) => {
      cumulativeBidQuantity += parseFloat(quantity);
      cumulativeBids.push({ x: parseFloat(price), y: cumulativeBidQuantity });
    });
  
    asks.forEach(([price, quantity]) => {
      cumulativeAskQuantity += parseFloat(quantity);
      cumulativeAsks.push({ x: parseFloat(price), y: cumulativeAskQuantity });
    });
  
    // Chart configuration data
    const data = {
      datasets: [
        {
          label: 'Bids',
          data: cumulativeBids,
          borderColor: 'green',
          backgroundColor: 'rgba(0, 255, 0, 0.3)',
          fill: true,
          pointRadius: 0,
        },
        {
          label: 'Asks',
          data: cumulativeAsks,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
          fill: true,
          pointRadius: 0,
        },
      ],
    };
  
    // Chart options
    const options = {
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Price',
            color: '#ffffff',
          },
          grid: {
            display: false,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Quantity',
            color: '#ffffff',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Quantity: ${context.raw.y}`;
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  
    return (
      <div style={{ height: '400px', width: '100%' }}>
        <Line data={data} options={options} />
      </div>
    );
  }
  

export default MarketDepthChart;
