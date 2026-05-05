import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { AlertDialog, Drawer, Modal, Toast } from '../components/primitives';
import type { AlertOptions, DrawerOptions, ModalOptions } from '../components/primitives';

type OverlayState =
  | { type: 'idle' }
  | { type: 'alert'; options: AlertOptions }
  | { type: 'modal'; options: ModalOptions }
  | { type: 'drawer'; options: DrawerOptions };

type ToastOptions = {
  message: string;
  tone?: 'default' | 'success' | 'danger';
  duration?: number;
};

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

type OverlayContextValue = {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: ConfirmOptions) => void;
  showModal: (options: ModalOptions) => void;
  showDrawer: (options: DrawerOptions) => void;
  showToast: (options: ToastOptions) => void;
  closeOverlay: () => void;
  closeToast: () => void;
};

const OverlayContext = createContext<OverlayContextValue>({
  showAlert: () => undefined,
  showConfirm: () => undefined,
  showModal: () => undefined,
  showDrawer: () => undefined,
  showToast: () => undefined,
  closeOverlay: () => undefined,
  closeToast: () => undefined,
});

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OverlayState>({ type: 'idle' });
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const value = useMemo<OverlayContextValue>(
    () => ({
      showAlert: (options) => setState({ type: 'alert', options }),
      showConfirm: (options) =>
        setState({
          type: 'alert',
          options: {
            confirmLabel: 'Ya',
            cancelLabel: 'Batal',
            ...options,
          },
      }),
      showModal: (options) => setState({ type: 'modal', options }),
      showDrawer: (options) => setState({ type: 'drawer', options }),
      showToast: (options) => setToast(options),
      closeOverlay: () => setState({ type: 'idle' }),
      closeToast: () => setToast(null),
    }),
    []
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}
      <AlertDialog
        visible={state.type === 'alert'}
        title={state.type === 'alert' ? state.options.title : ''}
        description={state.type === 'alert' ? state.options.description : undefined}
        confirmLabel={state.type === 'alert' ? state.options.confirmLabel : undefined}
        cancelLabel={state.type === 'alert' ? state.options.cancelLabel : undefined}
        onConfirm={state.type === 'alert' ? state.options.onConfirm : undefined}
        onCancel={state.type === 'alert' ? state.options.onCancel : undefined}
        onClose={() => setState({ type: 'idle' })}
      />
      <Modal
        visible={state.type === 'modal'}
        title={state.type === 'modal' ? state.options.title : ''}
        description={state.type === 'modal' ? state.options.description : undefined}
        content={state.type === 'modal' ? state.options.content : undefined}
        dismissible={state.type === 'modal' ? state.options.dismissible : true}
        actions={state.type === 'modal' ? state.options.actions : undefined}
        onClose={() => setState({ type: 'idle' })}
      />
      <Drawer
        visible={state.type === 'drawer'}
        title={state.type === 'drawer' ? state.options.title : ''}
        description={state.type === 'drawer' ? state.options.description : undefined}
        content={state.type === 'drawer' ? state.options.content : undefined}
        dismissible={state.type === 'drawer' ? state.options.dismissible : true}
        actions={state.type === 'drawer' ? state.options.actions : undefined}
        onClose={() => setState({ type: 'idle' })}
      />
      <Toast
        visible={Boolean(toast)}
        message={toast?.message ?? ''}
        tone={toast?.tone}
        duration={toast?.duration}
        onDismiss={() => setToast(null)}
      />
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  return useContext(OverlayContext);
}

export function useAlert() {
  const { showAlert, closeOverlay } = useOverlay();
  return { showAlert, closeAlert: closeOverlay };
}

export function useConfirm() {
  const { showConfirm, closeOverlay } = useOverlay();
  return { showConfirm, closeConfirm: closeOverlay };
}

export function useModal() {
  const { showModal, closeOverlay } = useOverlay();
  return { showModal, closeModal: closeOverlay };
}

export function useDrawer() {
  const { showDrawer, closeOverlay } = useOverlay();
  return { showDrawer, closeDrawer: closeOverlay };
}

export function useToast() {
  const { showToast, closeToast } = useOverlay();
  return { showToast, closeToast };
}
