import { PasswordInput as SharedPasswordInput } from '@mami/ui';

import { InputComponentProps } from '../form/form.types';
import { useSharedInputProps } from './shared';

type PasswordFieldProps = InputComponentProps<string> & {
  disabled?: boolean;
};

export function PasswordField({ value, placeholder, onChange, disabled }: PasswordFieldProps) {
  const inputProps = useSharedInputProps();

  return (
    <SharedPasswordInput
      value={value ?? ''}
      disabled={disabled}
      placeholder={placeholder}
      onChangeText={onChange}
      textColor={inputProps.textColor}
      backgroundColor={inputProps.backgroundColor}
      borderRadius={inputProps.borderRadius}
    />
  );
}
