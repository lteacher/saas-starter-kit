import { component$, useSignal, useVisibleTask$, noSerialize } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  scales?: Record<string, unknown>;
  plugins?: Record<string, unknown>;
}

interface ChartWrapperProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: ChartData;
  options?: ChartOptions;
  height?: number;
  width?: number;
  class?: string;
}

export const ChartWrapper = component$<ChartWrapperProps>(
  ({ type, data, options = {}, height = 300, width = 600, class: className }) => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    const chartRef = useSignal<unknown>();

    useVisibleTask$(async () => {
      if (!isBrowser) return;

      // Dynamic import for client-side only
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (canvasRef.value) {
        // Destroy existing chart if it exists
        if (chartRef.value) {
          chartRef.value.destroy();
        }

        // Create new chart
        chartRef.value = noSerialize(
          new Chart(canvasRef.value, {
            type,
            data,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    usePointStyle: true,
                    padding: 20,
                  },
                },
              },
              ...options,
            },
          }),
        );
      }
    });

    return (
      <div
        class={`relative ${className || ''}`}
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <canvas ref={canvasRef} width={width} height={height} class="max-w-full max-h-full" />
      </div>
    );
  },
);
