import { routeAction$ } from '@builder.io/qwik-city';
import { client } from '../../lib/api-client';

export const useAssignRole = routeAction$(async (data) => {
  try {
    const { userId, roleId } = data;
    const response = await client.api.users({ id: userId as string }).roles.post({
      roleId: roleId as string,
    });

    if (response.error) {
      return { success: false, error: response.error.message };
    }

    return { success: true, user: response.data };
  } catch {
    return { success: false, error: 'Failed to assign role' };
  }
});

export const useRemoveRole = routeAction$(async (data) => {
  try {
    const { userId, roleId } = data;
    const response = await client.api
      .users({ id: userId as string })
      .roles({ id: roleId as string })
      .delete();

    if (response.error) {
      return { success: false, error: response.error.message };
    }

    return { success: true, user: response.data };
  } catch {
    return { success: false, error: 'Failed to remove role' };
  }
});
