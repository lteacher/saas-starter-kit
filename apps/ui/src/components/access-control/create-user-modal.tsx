import { component$, $, type QRL } from '@builder.io/qwik';
import { useRoles } from '~/context/roles';
import { Modal, ModalActions } from '~/components/ui/modal';
import { FormField, TextInput } from '~/components/ui/form-field';
import { RoleSelector } from '~/components/ui/role-selector';
import { useCreateUser } from '~/hooks/use-create-user';

interface CreateUserModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Function to call when modal should close */
  onClose$: QRL<() => void>;
}

export const CreateUserModal = component$<CreateUserModalProps>(({ open, onClose$ }) => {
  const { availableRoles } = useRoles();
  const {
    isLoading,
    error,
    email,
    username,
    firstName,
    lastName,
    selectedRoles,
    tempPassword,
    handleSubmit,
    handleRoleToggle,
  } = useCreateUser({
    onSuccess: onClose$,
  });

  return (
    <Modal open={open} onClose$={onClose$} title="Create User" maxWidth="md">
      {error.value && (
        <div class="alert alert-error">
          <span>{error.value}</span>
        </div>
      )}

      <FormField label="Email" required>
        <TextInput
          type="email"
          placeholder="user@example.com"
          value={email.value}
          onInput$={(value) => (email.value = value)}
          required
        />
      </FormField>

      <FormField label="Username" required>
        <TextInput
          type="text"
          placeholder="username"
          value={username.value}
          onInput$={(value) => (username.value = value)}
          required
        />
      </FormField>

      <div class="grid grid-cols-2 gap-4">
        <FormField label="First Name">
          <TextInput
            type="text"
            placeholder="John"
            value={firstName.value}
            onInput$={(value) => (firstName.value = value)}
          />
        </FormField>

        <FormField label="Last Name">
          <TextInput
            type="text"
            placeholder="Doe"
            value={lastName.value}
            onInput$={(value) => (lastName.value = value)}
          />
        </FormField>
      </div>

      <RoleSelector
        roles={availableRoles.value}
        selectedRoles={selectedRoles.value}
        onRoleToggle$={handleRoleToggle}
        required
      />

      <div class="form-control">
        <label class="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" class="checkbox checkbox-primary" bind:checked={tempPassword} />
          <span class="label-text">
            Use temporary password (user will be prompted to set password on first login)
          </span>
        </label>
      </div>

      <ModalActions
        loading={isLoading.value}
        onCancel$={onClose$}
        onConfirm$={handleSubmit}
        cancelText="Cancel"
        confirmText="Create User"
        confirmLoadingText="Creating..."
        confirmVariant="primary"
      />
    </Modal>
  );
});
