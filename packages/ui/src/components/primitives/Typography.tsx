import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle } from 'react-native';

import { brandColors } from '../../theme/brand';

type BaseTextProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export function TextHeading({ children, style, numberOfLines }: BaseTextProps) {
  return (
    <View>
      <Text numberOfLines={numberOfLines} style={[{ fontSize: 28, fontWeight: '700', color: brandColors.textPrimary }, style]}>
        {children}
      </Text>
    </View>
  );
}

export function TextLabel({ children, required, style, numberOfLines }: BaseTextProps & { required?: boolean }) {
  return (
    <View>
      <Text numberOfLines={numberOfLines} style={[{ fontSize: 14, fontWeight: '600', color: brandColors.textPrimary }, style]}>
        {children}
        {required ? <Text style={{ color: brandColors.danger }}> *</Text> : null}
      </Text>
    </View>
  );
}

export function TextBody({ children, style, numberOfLines }: BaseTextProps) {
  return (
    <View>
      <Text numberOfLines={numberOfLines} style={[{ fontSize: 14, color: brandColors.textPrimary }, style]}>
        {children}
      </Text>
    </View>
  );
}

export function TextStrong({ children, style, numberOfLines }: BaseTextProps) {
  return (
    <View>
      <Text numberOfLines={numberOfLines} style={[{ fontSize: 14, fontWeight: '700', color: brandColors.textPrimary }, style]}>
        {children}
      </Text>
    </View>
  );
}

export function TextMuted({ children, style, numberOfLines }: BaseTextProps) {
  return (
    <View>
      <Text numberOfLines={numberOfLines} style={[{ fontSize: 14, color: brandColors.textSecondary }, style]}>
        {children}
      </Text>
    </View>
  );
}

export function TextError({ children, style, numberOfLines }: BaseTextProps) {
  return (
    <View>
      <Text numberOfLines={numberOfLines} style={[{ fontSize: 12, fontWeight: '500', color: brandColors.danger }, style]}>
        {children}
      </Text>
    </View>
  );
}
