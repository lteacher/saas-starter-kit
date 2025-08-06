import { component$, useSignal } from '@builder.io/qwik';
import { CreateUserModal } from './create-user-modal';

export const CreateUserButton = component$(() => {
  const isModalOpen = useSignal(false);

  return (
    <>
      <button class="btn btn-primary" onClick$={() => (isModalOpen.value = true)}>
        Create User
      </button>

      <CreateUserModal open={isModalOpen.value} onClose$={() => (isModalOpen.value = false)} />
    </>
  );
});
