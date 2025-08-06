import { component$, useSignal } from '@builder.io/qwik';
import { CreateRoleModal } from './create-role-modal';

export const CreateRoleButton = component$(() => {
  const isModalOpen = useSignal(false);

  return (
    <>
      <button class="btn btn-primary" onClick$={() => (isModalOpen.value = true)}>
        Create Role
      </button>

      <CreateRoleModal open={isModalOpen.value} onClose$={() => (isModalOpen.value = false)} />
    </>
  );
});
