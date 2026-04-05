import { KeyboardTypeOptions } from 'react-native';
import { TextInput as SharedTextInput } from '@mami/ui';

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
    <SharedTextInput
      value={value ?? ''}
      disabled={disabled}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      onChangeText={onChange}
      textColor={theme.colors.textPrimary}
      backgroundColor={theme.colors.surface}
      borderRadius={10}
    />
  );
}
