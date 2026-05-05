import { KeyboardTypeOptions } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

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
  useBottomSheetInput?: boolean;
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
  textColor = '#0F172A', // Slate 900
  backgroundColor = '#FFFFFF',
  borderRadius = 12,
  right,
  useBottomSheetInput = false,
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
      render={useBottomSheetInput ? (inputProps) => <BottomSheetTextInput {...inputProps} /> : undefined}
      right={right as any}
    />
  );
}
