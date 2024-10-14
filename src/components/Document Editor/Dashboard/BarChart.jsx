import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useWordFrequencyArray } from '../Text Editor/TextEditor'; 
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = () => {
    const wordFrequencies = useWordFrequencyArray();
    const tokens = wordFrequencies.map(item => item.token);
    const frequencies = wordFrequencies.map(item => item.frequency);

    const data = {
        labels: tokens,
        datasets: [
            {
                label: 'Word Frequency',
                data: frequencies,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Frequency',
                },
            },
            x: {
                title: {
                    display: true,
                },
                ticks: {
                    autoSkip: false, 
                    maxRotation: 90, 
                    minRotation: 45, 
                    font: {
                        size: 12, 
                    },
                },
            },
        },
    };

    return <Bar data={data} options={options} className='xl:mt-5'/>;
};

export default BarChart;
