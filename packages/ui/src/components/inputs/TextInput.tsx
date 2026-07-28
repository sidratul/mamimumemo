import { KeyboardTypeOptions } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { CONTROL_BORDER_RADIUS, CONTROL_HEIGHT } from '../../theme/dimensions';
import { brandColors } from '../../theme/brand';

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
  placeholderTextColor?: string;
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
  placeholderTextColor = brandColors.textSecondary,
  backgroundColor = '#FFFFFF',
  borderRadius = CONTROL_BORDER_RADIUS,
  right,
  useBottomSheetInput = false,
}: SharedTextInputProps) {
  return (
    <PaperTextInput
      value={value ?? ''}
      mode="outlined"
      dense
      disabled={disabled}
      outlineStyle={{ borderRadius }}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      numberOfLines={numberOfLines}
      onChangeText={onChangeText}
      textColor={textColor}
      style={{ backgroundColor, height: CONTROL_HEIGHT }}
      contentStyle={{ paddingTop: 0, paddingBottom: 0, justifyContent: 'center' }}
      render={useBottomSheetInput ? (inputProps) => <BottomSheetTextInput {...inputProps} /> : undefined}
      right={right as any}
    />
  );
}
