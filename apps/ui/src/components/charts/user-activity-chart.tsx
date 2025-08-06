import { component$ } from '@builder.io/qwik';
import { ChartWrapper } from './chart-wrapper';

export const UserActivityChart = component$(() => {
  // Sample data for user activity over time - realistic SaaS growth pattern
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Users',
        data: [8, 12, 15, 18, 20, 22],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'New Users',
        data: [2, 3, 2, 4, 3, 5],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
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
        text: 'User Activity Over Time',
      },
    },
  };

  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">User Activity</h2>
        <ChartWrapper
          type="line"
          data={chartData}
          options={chartOptions}
          height={300}
          class="w-full"
        />
      </div>
    </div>
  );
});
