import { useSignal, $, type QRL } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { client } from '~/lib/api-client';
import { getErrorMessage } from '~/lib/error-handling';

interface UseCreateUserOptions {
  onSuccess?: QRL<() => void>;
}

export const useCreateUser = (options?: UseCreateUserOptions) => {
  const navigate = useNavigate();
  const isLoading = useSignal(false);
  const error = useSignal<string | null>(null);

  const email = useSignal('');
  const username = useSignal('');
  const firstName = useSignal('');
  const lastName = useSignal('');
  const selectedRoles = useSignal<string[]>([]);
  const tempPassword = useSignal(false);

  const handleSubmit = $(async () => {
    if (!email.value || !username.value || selectedRoles.value.length === 0) {
      error.value = 'Please fill in all required fields';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await client.api.users.post({
        email: email.value,
        username: username.value,
        firstName: firstName.value || undefined,
        lastName: lastName.value || undefined,
        roleIds: selectedRoles.value,
        tempPassword: tempPassword.value,
      });

      if (response.error) {
        error.value = getErrorMessage(response);
        return;
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

  const handleRoleToggle = $((roleId: string) => {
    if (selectedRoles.value.includes(roleId)) {
      selectedRoles.value = selectedRoles.value.filter((id) => id !== roleId);
    } else {
      selectedRoles.value = [...selectedRoles.value, roleId];
    }
  });

  return {
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
  };
};
