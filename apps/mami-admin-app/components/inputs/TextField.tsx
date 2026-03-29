import { TextInput } from 'react-native';

import { useAppTheme } from '../../theme/theme';
import { InputComponentProps } from '../form/form.types';

type TextFieldProps = InputComponentProps<string>;

export function TextField({ value, placeholder, onChange }: TextFieldProps) {
  const theme = useAppTheme();

  return (
    <TextInput
      value={value ?? ''}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      autoCapitalize="none"
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
