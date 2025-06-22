import { component$, Slot } from '@builder.io/qwik';

interface FormFieldProps {
  label: string;
  error?: string;
}

export const FormField = component$<FormFieldProps>(({ label, error }) => {
  return (
    <div class="form-control">
      <label class="label">
        <span class="label-text">{label}</span>
      </label>
      <Slot />
      {error && (
        <label class="label">
          <span class="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
});