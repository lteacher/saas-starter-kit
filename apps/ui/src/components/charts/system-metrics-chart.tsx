import { component$ } from '@builder.io/qwik';
import { ChartWrapper } from './chart-wrapper';

export const SystemMetricsChart = component$(() => {
  // Sample data for system metrics
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'API Calls',
        data: [1200, 1900, 1500, 2100],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Database Queries',
        data: [800, 1200, 1000, 1400],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'System Performance Metrics',
      },
    },
  };

  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">System Metrics</h2>
        <ChartWrapper
          type="bar"
          data={chartData}
          options={chartOptions}
          height={300}
          class="w-full"
        />
      </div>
    </div>
  );
});
