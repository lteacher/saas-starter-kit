import { component$ } from '@builder.io/qwik';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const Alert = component$<AlertProps>(({ type = 'info', message }) => {
  return (
    <div class={`alert alert-${type} mb-4`}>
      <span>{message}</span>
    </div>
  );
});
