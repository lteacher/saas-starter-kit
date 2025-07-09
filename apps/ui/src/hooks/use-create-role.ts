import { useSignal, $, type QRL } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { client } from '~/lib/api-client';
import { type Permission } from '~/lib/constants';
import { getErrorMessage } from '~/lib/error-handling';

interface CreateRoleFormData {
  name: string;
  description: string;
  selectedPermissions: Permission[];
}

interface UseCreateRoleOptions {
  onSuccess?: QRL<() => void>;
}

export const useCreateRole = (options?: UseCreateRoleOptions) => {
  const navigate = useNavigate();
  const isLoading = useSignal(false);
  const error = useSignal<string | null>(null);

  const formData = useSignal<CreateRoleFormData>({
    name: '',
    description: '',
    selectedPermissions: [],
  });

  const handleSubmit = $(async () => {
    if (!formData.value.name) {
      error.value = 'Role name is required';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const roleResponse = await client.api.roles.post({
        name: formData.value.name,
        description: formData.value.description || undefined,
        isActive: true,
      });

      if (roleResponse.error) {
        error.value = getErrorMessage(roleResponse);
        return;
      }

      if (formData.value.selectedPermissions.length > 0) {
        const roleId = roleResponse.data?.id;
        if (roleId) {
          const permissionResponse = await client.api.roles({ id: roleId }).permissions.post({
            permissions: formData.value.selectedPermissions,
          });

          if (permissionResponse.error) {
            error.value = getErrorMessage(permissionResponse);
            return;
          }
        }
      }

      if (options?.onSuccess) {
        await options.onSuccess();
      } else {
        navigate('/access-control');
      }
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      isLoading.value = false;
    }
  });

  const handlePermissionToggle = $((permission: Permission) => {
    const isSelected = formData.value.selectedPermissions.some((p) => p.name === permission.name);

    if (isSelected) {
      formData.value = {
        ...formData.value,
        selectedPermissions: formData.value.selectedPermissions.filter(
          (p) => p.name !== permission.name,
        ),
      };
    } else {
      formData.value = {
        ...formData.value,
        selectedPermissions: [...formData.value.selectedPermissions, permission],
      };
    }
  });

  const updateFormField = $((field: keyof CreateRoleFormData, value: string) => {
    formData.value = {
      ...formData.value,
      [field]: value,
    };
  });

  return {
    isLoading,
    error,
    formData,
    handleSubmit,
    handlePermissionToggle,
    updateFormField,
  };
};
