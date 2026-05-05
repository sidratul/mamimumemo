import { View } from 'react-native';

import { brandColors } from '../../theme/brand';
import { TextMuted, TextStrong } from './Typography';

type StatCardProps = {
  label: string;
  value: string;
  helperText?: string;
};

export function StatCard({ label, value, helperText }: StatCardProps) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 140,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: brandColors.border,
        backgroundColor: brandColors.surface,
        padding: 16,
        gap: 6,
      }}>
      <TextMuted>{label}</TextMuted>
      <TextStrong style={{ fontSize: 24 }}>{value}</TextStrong>
      {helperText ? <TextMuted>{helperText}</TextMuted> : null}
    </View>
  );
}
