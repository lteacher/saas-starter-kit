import { component$ } from '@builder.io/qwik';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  description?: string;
}

export const StatCard = component$<StatCardProps>(
  ({ title, value, change, changeType = 'neutral', icon, description }) => {
    const getChangeColor = () => {
      switch (changeType) {
        case 'increase':
          return 'text-success';
        case 'decrease':
          return 'text-error';
        default:
          return 'text-base-content/70';
      }
    };

    const getChangeIcon = () => {
      switch (changeType) {
        case 'increase':
          return '↗️';
        case 'decrease':
          return '↘️';
        default:
          return '➡️';
      }
    };

    return (
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-sm font-medium text-base-content/70">{title}</h3>
              <p class="text-2xl font-bold text-base-content mt-1">{value}</p>
              {description && <p class="text-xs text-base-content/60 mt-1">{description}</p>}
            </div>
            {icon && <div class="text-2xl opacity-80">{icon}</div>}
          </div>

          {change && (
            <div class="flex items-center mt-2">
              <span class={`text-sm font-medium ${getChangeColor()}`}>
                {getChangeIcon()} {change}
              </span>
              <span class="text-xs text-base-content/60 ml-2">vs last period</span>
            </div>
          )}
        </div>
      </div>
    );
  },
);
