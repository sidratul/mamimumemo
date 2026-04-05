import { TextAreaInput as SharedTextAreaInput } from '@mami/ui';

import { useAppTheme } from '../../theme/theme';
import { InputComponentProps } from '../form/form.types';

type TextAreaFieldProps = InputComponentProps<string> & {
  disabled?: boolean;
  numberOfLines?: number;
};

export function TextAreaField({ value, placeholder, onChange, disabled, numberOfLines = 4 }: TextAreaFieldProps) {
  const theme = useAppTheme();

  return (
    <SharedTextAreaInput
      value={value ?? ''}
      numberOfLines={numberOfLines}
      disabled={disabled}
      placeholder={placeholder}
      onChangeText={onChange}
      textColor={theme.colors.textPrimary}
      backgroundColor={theme.colors.surface}
      borderRadius={10}
    />
  );
}
