import { component$ } from '@builder.io/qwik';
import { ChartWrapper } from './chart-wrapper';

export const RoleDistributionChart = component$(() => {
  // Sample data for role distribution - keeping proportional to typical SaaS usage
  const chartData = {
    labels: ['Admin', 'User', 'Manager'],
    datasets: [
      {
        data: [2, 15, 5],
        backgroundColor: [
          '#ef4444', // red
          '#3b82f6', // blue
          '#10b981', // green
        ],
        borderColor: ['#dc2626', '#2563eb', '#059669'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'User Role Distribution',
      },
    },
  };

  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Role Distribution</h2>
        <ChartWrapper
          type="doughnut"
          data={chartData}
          options={chartOptions}
          height={300}
          class="w-full"
        />
      </div>
    </div>
  );
});
