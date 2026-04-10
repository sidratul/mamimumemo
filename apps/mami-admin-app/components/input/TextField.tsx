import { KeyboardTypeOptions } from 'react-native';
import { TextInput as SharedTextInput } from '@mami/ui';

import { InputComponentProps } from '../form/form.types';
import { useSharedInputProps } from './shared';

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
  const inputProps = useSharedInputProps();

  return (
    <SharedTextInput
      value={value ?? ''}
      disabled={disabled}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      onChangeText={onChange}
      textColor={inputProps.textColor}
      backgroundColor={inputProps.backgroundColor}
      borderRadius={inputProps.borderRadius}
    />
  );
}
