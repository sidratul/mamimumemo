import { TextInput } from 'react-native-paper';
import { type InputComponentProps } from '@mami/ui';

import { useAppTheme } from '../../theme/theme';

type DateFieldProps = InputComponentProps<string> & {
  disabled?: boolean;
};

export function DateField({ value, placeholder, onChange, disabled }: DateFieldProps) {
  const theme = useAppTheme();

  return (
    <TextInput
      value={value ?? ''}
      mode="outlined"
      disabled={disabled}
      outlineStyle={{ borderRadius: 10 }}
      placeholder={placeholder ?? 'YYYY-MM-DD'}
      onChangeText={onChange}
      textColor={theme.colors.textPrimary}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );
}
