import React, { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import posLabelMapping from './POSCategories';
import { usePosDataArray } from './TextEditor';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const posDataArray = usePosDataArray(); // Get POS data using custom hook

  // Create a map to aggregate counts by category
  const categoryCounts = posDataArray.reduce((acc, item) => {
    const category = posLabelMapping[item.pos] || 'Other'; // Map using the label mapping or fallback to 'Other'
    acc[category] = (acc[category] || 0) + item.count; // Aggregate counts for each category
    return acc;
  }, {});

  // Prepare the data for the pie chart
  const data = {
    labels: Object.keys(categoryCounts), // Human-readable category labels
    datasets: [
      {
        data: Object.values(categoryCounts), // Corresponding counts for each category
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
            boxWidth: 10, // Makes the legend boxes smaller (squared)
            usePointStyle: true, // Enables custom point style (e.g., square)
            pointStyle: 'rect', // Makes the points square-shaped
          },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = data.labels[tooltipItem.dataIndex];
            const count = data.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: ${count}`;
          },
        },
      },
    },
  };

  useEffect(() => {
    console.log("POS Data Array in Pie Chart: ", posDataArray);
  }, [posDataArray]);

  return <Pie data={data} options={options} className='xl:-mt-5'/>;
};

export default PieChart;
