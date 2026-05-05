import type { ReactNode } from 'react';

import type { ButtonVariant } from './Button';

export type OverlayAction = {
  label: string;
  variant?: ButtonVariant;
  onPress?: () => void | Promise<void>;
};

export type AlertOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

export type ModalOptions = {
  title: string;
  description?: string;
  content?: ReactNode;
  dismissible?: boolean;
  actions?: OverlayAction[];
};

export type DrawerOptions = {
  title: string;
  description?: string;
  content?: ReactNode;
  dismissible?: boolean;
  actions?: OverlayAction[];
};
