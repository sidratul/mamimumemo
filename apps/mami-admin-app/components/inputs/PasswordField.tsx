import { TextInput } from 'react-native';

import { useAppTheme } from '../../theme/theme';
import { InputComponentProps } from '../form/form.types';

type PasswordFieldProps = InputComponentProps<string>;

export function PasswordField({ value, placeholder, onChange }: PasswordFieldProps) {
  const theme = useAppTheme();

  return (
    <TextInput
      value={value ?? ''}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      secureTextEntry
      onChangeText={onChange}
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: theme.colors.textPrimary,
      }}
    />
  );
}
