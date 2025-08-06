import { component$, type QRL } from '@builder.io/qwik';
import { DEFAULT_PERMISSIONS, type Permission } from '~/lib/constants';
import { Modal, ModalActions } from '~/components/ui/modal';
import { FormField, TextInput, Textarea } from '~/components/ui/form-field';
import { PermissionSelector } from '~/components/ui/permission-selector';
import { useCreateRole } from '~/hooks/use-create-role';

interface CreateRoleModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Function to call when modal should close */
  onClose$: QRL<() => void>;
}

// Modal component for creating new roles with permission assignment
export const CreateRoleModal = component$<CreateRoleModalProps>(({ open, onClose$ }) => {
  const { isLoading, error, formData, handleSubmit, handlePermissionToggle, updateFormField } =
    useCreateRole({
      onSuccess: onClose$,
    });

  return (
    <Modal open={open} onClose$={onClose$} title="Create Role" maxWidth="2xl">
      {error.value && (
        <div class="alert alert-error">
          <span>{error.value}</span>
        </div>
      )}

      <FormField label="Role Name" required>
        <TextInput
          type="text"
          placeholder="Enter role name"
          value={formData.value.name}
          onInput$={(value) => updateFormField('name', value)}
          required
        />
      </FormField>

      <FormField label="Description">
        <Textarea
          placeholder="Enter role description"
          value={formData.value.description}
          onInput$={(value) => updateFormField('description', value)}
          rows={3}
        />
      </FormField>

      <PermissionSelector
        permissions={DEFAULT_PERMISSIONS}
        selectedPermissions={formData.value.selectedPermissions}
        onPermissionToggle$={handlePermissionToggle}
      />

      <ModalActions
        loading={isLoading.value}
        onCancel$={onClose$}
        onConfirm$={handleSubmit}
        cancelText="Cancel"
        confirmText="Create Role"
        confirmLoadingText="Creating..."
        confirmVariant="primary"
      />
    </Modal>
  );
});
