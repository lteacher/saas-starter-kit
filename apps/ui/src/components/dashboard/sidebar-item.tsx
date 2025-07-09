import { component$ } from '@builder.io/qwik';

interface SidebarItemProps {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
}

export const SidebarItem = component$<SidebarItemProps>(
  ({ href, icon, label, isActive = false }) => {
    return (
      <li>
        <a
          href={href}
          class={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-200'
          }`}
        >
          <span class="text-lg">{icon}</span>
          <span class="font-medium">{label}</span>
        </a>
      </li>
    );
  },
);
