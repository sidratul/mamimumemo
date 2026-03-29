import { KeyboardTypeOptions } from 'react-native';
import { TextInput } from 'react-native-paper';

import { useAppTheme } from '../../theme/theme';
import { InputComponentProps } from '../form/form.types';

type TextFieldProps = InputComponentProps<string> & {
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
};

export function TextField({
  value,
  placeholder,
  onChange,
  keyboardType,
  autoCapitalize = 'none',
  disabled,
}: TextFieldProps) {
  const theme = useAppTheme();

  return (
    <TextInput
      value={value ?? ''}
      mode="outlined"
      disabled={disabled}
      outlineStyle={{ borderRadius: 10 }}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      onChangeText={onChange}
      textColor={theme.colors.textPrimary}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );
}
