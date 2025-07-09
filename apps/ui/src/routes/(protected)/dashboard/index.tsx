import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useProtectedData } from '../layout';
import { StatCard } from '~/components/dashboard/stat-card';
import { UserActivityChart } from '~/components/charts/user-activity-chart';
import { RoleDistributionChart } from '~/components/charts/role-distribution-chart';
import { SystemMetricsChart } from '~/components/charts/system-metrics-chart';
import { RecentActivity } from '~/components/dashboard/recent-activity';

export default component$(() => {
  const protectedData = useProtectedData();
  const stats = protectedData.value?.stats;

  return (
    <div class="space-y-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Dashboard Overview</h1>
        <p class="text-base-content/70">Welcome to your SaaS dashboard - here's what's happening</p>
      </div>

      {/* Stats Cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change={stats?.totalUsers ? `${stats.activeUsers} active` : '0 active'}
          changeType="increase"
          icon="👥"
          description="All users in system"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          change={stats?.pendingUsers ? `${stats.pendingUsers} pending` : '0 pending'}
          changeType="increase"
          icon="✅"
          description="Currently active users"
        />
        <StatCard
          title="Total Roles"
          value={stats?.totalRoles || 0}
          change="Permission groups"
          changeType="neutral"
          icon="🛡️"
          description="Available user roles"
        />
        <StatCard
          title="System Status"
          value="Healthy"
          change="99.9%"
          changeType="increase"
          icon="🔋"
          description="Uptime this month"
        />
      </div>

      {/* Charts Section */}
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <UserActivityChart />
        <RoleDistributionChart />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SystemMetricsChart />
        <RecentActivity />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Dashboard - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Your dashboard overview' }],
};
