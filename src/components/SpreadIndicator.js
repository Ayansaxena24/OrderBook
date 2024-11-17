"use client";

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Tooltip);

export default function SpreadIndicator({ spreadHistory, tradingPairs }) {
  console.log(tradingPairs, 'tradingPairs');
  const handleLabel = () => {
    if (tradingPairs === 'btc') {
      return 'Spread (BTC-USD)';
    }
    else if (tradingPairs === 'eth') {
      return 'Spread (ETH-USD)';
    }
    else if (tradingPairs === 'ltc') {
      return 'Spread (LTC-USD)';
    }
  }
  const data = {
    datasets: [
      {
        label: handleLabel(),
        data: spreadHistory,
        borderColor: 'blue',
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'nearest',
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Spread',
        },
        min: 0,
      },
    },
  };

  return <Line data={data} options={options} />;
}
