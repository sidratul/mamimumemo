import { PasswordInput as SharedPasswordInput } from '@mami/ui';

import { useAppTheme } from '../../theme/theme';
import { InputComponentProps } from '../form/form.types';

type PasswordFieldProps = InputComponentProps<string> & {
  disabled?: boolean;
};

export function PasswordField({ value, placeholder, onChange, disabled }: PasswordFieldProps) {
  const theme = useAppTheme();

  return (
    <SharedPasswordInput
      value={value ?? ''}
      disabled={disabled}
      placeholder={placeholder}
      onChangeText={onChange}
      textColor={theme.colors.textPrimary}
      backgroundColor={theme.colors.surface}
      borderRadius={10}
    />
  );
}
