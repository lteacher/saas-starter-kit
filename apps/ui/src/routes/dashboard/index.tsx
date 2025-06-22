import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useDashboardData } from './layout';
import { StatsGrid } from '../../components/dashboard/stats-grid';
import { QuickActions } from '../../components/dashboard/quick-actions';

export default component$(() => {
  const dashboardData = useDashboardData();
  const stats = dashboardData.value?.stats;

  return (
    <div class="space-y-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">
          Dashboard Overview
        </h1>
        <p class="text-base-content/70">
          Here's your system overview and quick actions
        </p>
      </div>

      <StatsGrid stats={stats} />
      <QuickActions />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Dashboard - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Your dashboard overview' }],
};