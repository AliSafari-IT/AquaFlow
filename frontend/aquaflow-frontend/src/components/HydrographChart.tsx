// components/HydrographChart.tsx
import { Line } from 'react-chartjs-2';

interface HydrographDataPoint {
  timeHours: number;
  flowCubicMetersPerSecond: number;
}

interface HydrographChartProps {
  data: HydrographDataPoint[];
}

export default function HydrographChart({ data }: HydrographChartProps) {
  const chartData = {
    labels: data.map(d => `${d.timeHours}h`),
    datasets: [{
      label: 'Flow (m³/s)',
      data: data.map(d => d.flowCubicMetersPerSecond),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Hydrograph - Flow Rate Over Time'
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (hours)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Flow Rate (m³/s)'
        }
      }
    },
  };

  return <Line data={chartData} options={options} />;
}
