import { component$ } from '@builder.io/qwik';

interface StatsGridProps {
  stats?: {
    totalUsers: number;
    activeSessions: number;
    accountStatus: string;
  } | null;
}

export const StatsGrid = component$<StatsGridProps>(({ stats }) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">Total Users</div>
        <div class="stat-value text-primary">{stats?.totalUsers || 0}</div>
        <div class="stat-desc">Registered users</div>
      </div>
      
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">Active Sessions</div>
        <div class="stat-value text-secondary">{stats?.activeSessions || 0}</div>
        <div class="stat-desc">Current sessions</div>
      </div>
      
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">Account Status</div>
        <div class="stat-value text-accent">{stats?.accountStatus || 'Unknown'}</div>
        <div class="stat-desc">System status</div>
      </div>
    </div>
  );
});