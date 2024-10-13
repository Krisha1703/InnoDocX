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
    const category = posLabelMapping[item.pos] || 'Other'; 
    acc[category] = (acc[category] || 0) + item.count; 
    return acc;
  }, {});

  // Prepare the data for the pie chart
  const data = {
    labels: Object.keys(categoryCounts), 
    datasets: [
      {
        data: Object.values(categoryCounts), 
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
        position: 'bottom',
        labels: {
            boxWidth: 20, 
            usePointStyle: true, 
            pointStyle: 'rect', 
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

  return <Pie data={data} options={options} className='xl:mt-5'/>;
};

export default PieChart;
