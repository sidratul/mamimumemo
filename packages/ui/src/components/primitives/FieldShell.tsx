import type { ReactNode } from 'react';
import { View } from 'react-native';

import { TextError, TextLabel, TextMuted } from './Typography';

export type FieldShellProps = {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
};

export function FieldShell({ label, required, helperText, error, children }: FieldShellProps) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <TextLabel required={required}>{label}</TextLabel> : null}
      {children}
      {error ? <TextError>{error}</TextError> : helperText ? <TextMuted>{helperText}</TextMuted> : null}
    </View>
  );
}
