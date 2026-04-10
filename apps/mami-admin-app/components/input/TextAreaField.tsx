import { TextAreaInput as SharedTextAreaInput } from '@mami/ui';

import { InputComponentProps } from '../form/form.types';
import { useSharedInputProps } from './shared';

type TextAreaFieldProps = InputComponentProps<string> & {
  disabled?: boolean;
  numberOfLines?: number;
};

export function TextAreaField({ value, placeholder, onChange, disabled, numberOfLines = 4 }: TextAreaFieldProps) {
  const inputProps = useSharedInputProps();

  return (
    <SharedTextAreaInput
      value={value ?? ''}
      numberOfLines={numberOfLines}
      disabled={disabled}
      placeholder={placeholder}
      onChangeText={onChange}
      textColor={inputProps.textColor}
      backgroundColor={inputProps.backgroundColor}
      borderRadius={inputProps.borderRadius}
    />
  );
}
