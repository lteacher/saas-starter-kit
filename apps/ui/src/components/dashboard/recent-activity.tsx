import { component$ } from '@builder.io/qwik';

interface ActivityItem {
  id: string;
  type: 'user_login' | 'user_created' | 'role_assigned' | 'system_event';
  user: string;
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export const RecentActivity = component$(() => {
  // Sample activity data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'user_login',
      user: 'admin@example.com',
      action: 'Logged in successfully',
      timestamp: '2 minutes ago',
      status: 'success',
    },
    {
      id: '2',
      type: 'user_created',
      user: 'admin@example.com',
      action: 'Created new user: john.doe@example.com',
      timestamp: '15 minutes ago',
      status: 'success',
    },
    {
      id: '3',
      type: 'role_assigned',
      user: 'admin@example.com',
      action: 'Assigned admin role to user',
      timestamp: '1 hour ago',
      status: 'success',
    },
    {
      id: '4',
      type: 'system_event',
      user: 'System',
      action: 'Database backup completed',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      id: '5',
      type: 'user_login',
      user: 'test@test.com',
      action: 'Failed login attempt',
      timestamp: '3 hours ago',
      status: 'warning',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_login':
        return '🔑';
      case 'user_created':
        return '👤';
      case 'role_assigned':
        return '🛡️';
      case 'system_event':
        return '⚙️';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-base-content';
    }
  };

  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Recent Activity</h2>
        <div class="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} class="flex items-start space-x-3">
              <div class="flex-shrink-0 text-lg">{getActivityIcon(activity.type)}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-base-content truncate">{activity.user}</p>
                  <span class="text-xs text-base-content/60 ml-2">{activity.timestamp}</span>
                </div>
                <p class={`text-sm ${getStatusColor(activity.status)} mt-1`}>{activity.action}</p>
              </div>
            </div>
          ))}
        </div>
        <div class="card-actions justify-end mt-4">
          <button class="btn btn-sm btn-outline">View All</button>
        </div>
      </div>
    </div>
  );
});
