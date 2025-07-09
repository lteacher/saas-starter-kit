import { component$ } from '@builder.io/qwik';

export const InviteUserButton = component$(() => {
  return (
    <div class="flex gap-2">
      <button class="btn btn-primary">Invite User</button>
    </div>
  );
});
