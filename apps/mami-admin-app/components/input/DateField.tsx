import { TextInput } from 'react-native-paper';

import { useAppTheme } from '../../theme/theme';
import { InputComponentProps } from '../form/form.types';

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
