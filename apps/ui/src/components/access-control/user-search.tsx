import { component$, useSignal } from '@builder.io/qwik';

export const UserSearch = component$(() => {
  const searchQuery = useSignal('');

  return (
    <div class="flex-1">
      <input
        type="text"
        placeholder="Search users..."
        class="input input-bordered w-full max-w-md"
        bind:value={searchQuery}
      />
    </div>
  );
});
