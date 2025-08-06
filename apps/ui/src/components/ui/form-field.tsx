import { component$, Slot, type QRL } from '@builder.io/qwik';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
}

export const FormField = component$<FormFieldProps>(({ label, required = false, error, hint }) => {
  return (
    <div class="form-control">
      <label class="label">
        <span class="label-text">
          {label}
          {required && <span class="text-error ml-1">*</span>}
        </span>
      </label>
      <Slot />
      {error && (
        <label class="label">
          <span class="label-text-alt text-error">{error}</span>
        </label>
      )}
      {hint && !error && (
        <label class="label">
          <span class="label-text-alt text-base-content/70">{hint}</span>
        </label>
      )}
    </div>
  );
});

interface TextInputProps {
  value: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  required?: boolean;
  onInput$: QRL<(value: string) => void>;
}

export const TextInput = component$<TextInputProps>(
  ({ value, placeholder, type = 'text', required = false, onInput$ }) => {
    return (
      <input
        type={type}
        class="input input-bordered"
        placeholder={placeholder}
        value={value}
        required={required}
        onInput$={(e) => onInput$((e.target as HTMLInputElement).value)}
      />
    );
  },
);

interface TextareaProps {
  value: string;
  placeholder?: string;
  rows?: number;
  onInput$: QRL<(value: string) => void>;
}

export const Textarea = component$<TextareaProps>(({ value, placeholder, rows = 3, onInput$ }) => {
  return (
    <textarea
      class="textarea textarea-bordered"
      placeholder={placeholder}
      value={value}
      rows={rows}
      onInput$={(e) => onInput$((e.target as HTMLTextAreaElement).value)}
    />
  );
});
