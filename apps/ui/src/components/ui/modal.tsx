import { component$, Slot, type QRL } from '@builder.io/qwik';
import { LuX } from '@qwikest/icons/lucide';

interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Function to call when modal should close */
  onClose$: QRL<() => void>;
  /** Modal title */
  title?: string;
  /** Maximum width of modal */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Whether to show close button */
  showCloseButton?: boolean;
}

/**
 * Reusable modal component using DaisyUI modal
 * Provides proper accessibility and consistent styling
 */
export const Modal = component$<ModalProps>(
  ({ open, onClose$, title, maxWidth = 'md', showCloseButton = true }) => {
    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    };

    return (
      <div class={`modal ${open ? 'modal-open' : ''}`}>
        <div class={`modal-box ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto`}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div class="flex items-center justify-between mb-4">
              {title && <h3 class="font-bold text-lg">{title}</h3>}
              {showCloseButton && (
                <button
                  class="btn btn-ghost btn-sm btn-circle ml-auto"
                  onClick$={onClose$}
                  aria-label="Close modal"
                >
                  <LuX class="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div class="space-y-4">
            <Slot />
          </div>
        </div>

        {/* Backdrop */}
        <div class="modal-backdrop" onClick$={onClose$} />
      </div>
    );
  },
);

interface ModalActionsProps {
  /** Whether actions are in a loading state */
  loading?: boolean;
  /** Function to call when cancel is clicked */
  onCancel$?: QRL<() => void>;
  /** Function to call when confirm is clicked */
  onConfirm$?: QRL<() => void>;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Confirm button loading text */
  confirmLoadingText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'secondary' | 'accent' | 'error' | 'warning';
}

/**
 * Modal actions footer component
 * Provides consistent styling for modal action buttons
 */
export const ModalActions = component$<ModalActionsProps>(
  ({
    loading = false,
    onCancel$,
    onConfirm$,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    confirmLoadingText = 'Loading...',
    confirmVariant = 'primary',
  }) => {
    return (
      <div class="modal-action">
        {onCancel$ && (
          <button class="btn btn-ghost" onClick$={onCancel$} disabled={loading}>
            {cancelText}
          </button>
        )}
        {onConfirm$ && (
          <button
            class={`btn btn-${confirmVariant} ${loading ? 'loading' : ''}`}
            onClick$={onConfirm$}
            disabled={loading}
          >
            {loading ? confirmLoadingText : confirmText}
          </button>
        )}
      </div>
    );
  },
);
