import { PasswordInput, NumberInput as SharedNumberInput, TextAreaInput as SharedTextAreaInput, TextInput as SharedTextInput } from '../inputs';
import type { InputComponentProps } from './form.types';

type BaseProps = {
  disabled?: boolean;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
};

type TextFieldProps = InputComponentProps<string> &
  BaseProps & {
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  };

export function TextField({
  value,
  placeholder,
  onChange,
  disabled,
  keyboardType,
  autoCapitalize = 'none',
  textColor,
  backgroundColor,
  borderRadius,
}: TextFieldProps) {
  return (
    <SharedTextInput
      value={value ?? ''}
      placeholder={placeholder}
      onChangeText={onChange}
      disabled={disabled}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      textColor={textColor}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
    />
  );
}

type PasswordFieldProps = InputComponentProps<string> & BaseProps;

export function PasswordField({
  value,
  placeholder,
  onChange,
  disabled,
  textColor,
  backgroundColor,
  borderRadius,
}: PasswordFieldProps) {
  return (
    <PasswordInput
      value={value ?? ''}
      placeholder={placeholder}
      onChangeText={onChange}
      disabled={disabled}
      textColor={textColor}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
    />
  );
}

type NumberFieldProps = InputComponentProps<string> & BaseProps;

export function NumberField({
  value,
  placeholder,
  onChange,
  disabled,
  textColor,
  backgroundColor,
  borderRadius,
}: NumberFieldProps) {
  return (
    <SharedNumberInput
      value={value ?? ''}
      placeholder={placeholder}
      onChangeText={onChange}
      disabled={disabled}
      textColor={textColor}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
    />
  );
}

type TextAreaFieldProps = InputComponentProps<string> &
  BaseProps & {
    numberOfLines?: number;
  };

export function TextAreaField({
  value,
  placeholder,
  onChange,
  disabled,
  numberOfLines = 3,
  textColor,
  backgroundColor,
  borderRadius,
}: TextAreaFieldProps) {
  return (
    <SharedTextAreaInput
      value={value ?? ''}
      placeholder={placeholder}
      onChangeText={onChange}
      disabled={disabled}
      numberOfLines={numberOfLines}
      textColor={textColor}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
    />
  );
}
