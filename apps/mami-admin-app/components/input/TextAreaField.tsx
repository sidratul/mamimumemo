import { TextInput } from 'react-native-paper';

import { useAppTheme } from '../../theme/theme';
import { InputComponentProps } from '../form/form.types';

type TextAreaFieldProps = InputComponentProps<string> & {
  disabled?: boolean;
  numberOfLines?: number;
};

export function TextAreaField({ value, placeholder, onChange, disabled, numberOfLines = 4 }: TextAreaFieldProps) {
  const theme = useAppTheme();

  return (
    <TextInput
      value={value ?? ''}
      mode="outlined"
      multiline
      numberOfLines={numberOfLines}
      disabled={disabled}
      outlineStyle={{ borderRadius: 10 }}
      placeholder={placeholder}
      onChangeText={onChange}
      textColor={theme.colors.textPrimary}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );
}
