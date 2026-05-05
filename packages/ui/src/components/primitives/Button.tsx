import { ReactNode } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';

import { brandColors } from '../../theme/brand';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, icon, style }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const backgroundColor = isGhost
    ? 'transparent'
    : isDanger
      ? brandColors.danger
      : isPrimary
        ? brandColors.primary
        : brandColors.surface;

  const borderWidth = isGhost ? 0 : isPrimary || isDanger ? 0 : 1;
  const borderColor = isDanger ? brandColors.danger : brandColors.border;
  const textColor = isPrimary || isDanger ? '#FFFFFF' : brandColors.textPrimary;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: isGhost ? 40 : 48,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderWidth,
        borderColor,
        paddingHorizontal: 16,
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}>
      {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
      <Text style={{ color: textColor, fontWeight: isPrimary || isDanger ? '700' : '600', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}
