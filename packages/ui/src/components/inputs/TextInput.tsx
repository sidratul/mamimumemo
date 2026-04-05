import { KeyboardTypeOptions } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';

export type SharedTextInputProps = {
  value?: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  right?: React.ReactNode;
};

export function TextInput({
  value,
  placeholder,
  onChangeText,
  keyboardType,
  autoCapitalize = 'none',
  disabled,
  secureTextEntry,
  multiline,
  numberOfLines,
  textColor = '#3D2218',
  backgroundColor = '#FFFFFF',
  borderRadius = 10,
  right,
}: SharedTextInputProps) {
  return (
    <PaperTextInput
      value={value ?? ''}
      mode="outlined"
      disabled={disabled}
      outlineStyle={{ borderRadius }}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      numberOfLines={numberOfLines}
      onChangeText={onChangeText}
      textColor={textColor}
      style={{ backgroundColor }}
      right={right as any}
    />
  );
}
