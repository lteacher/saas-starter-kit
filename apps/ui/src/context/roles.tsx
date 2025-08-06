import {
  createContextId,
  useContext,
  useSignal,
  component$,
  Slot,
  useContextProvider,
} from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import type { Role } from '@saas-starter/types';

export interface RolesContext {
  availableRoles: Signal<Role[]>;
}

export const RolesContextId = createContextId<RolesContext>('roles-context');

export const useRoles = () => {
  const context = useContext(RolesContextId);
  if (!context) {
    throw new Error('useRoles must be used within RolesProvider');
  }
  return context;
};

interface RolesProviderProps {
  initialRoles: Role[];
}

export const RolesProvider = component$<RolesProviderProps>(({ initialRoles }) => {
  const availableRoles = useSignal<Role[]>(initialRoles);

  const rolesContext: RolesContext = {
    availableRoles,
  };

  useContextProvider(RolesContextId, rolesContext);

  return <Slot />;
});
