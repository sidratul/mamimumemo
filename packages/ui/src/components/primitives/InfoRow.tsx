import { View } from 'react-native';

import { brandColors } from '../../theme/brand';
import { TextBody, TextMuted, TextStrong } from './Typography';

type InfoRowProps = {
  label: string;
  value?: string | null;
  stacked?: boolean;
  valueNumberOfLines?: number;
};

export function InfoRow({
  label,
  value,
  stacked = false,
  valueNumberOfLines = 2,
}: InfoRowProps) {
  return (
    <View
      style={{
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
      <TextMuted style={{ flex: stacked ? 0 : 1 }}>{label}</TextMuted>
      <TextStrong
        numberOfLines={valueNumberOfLines}
        style={{
          flex: stacked ? 0 : 1,
          textAlign: stacked ? 'left' : 'right',
          color: value ? brandColors.textPrimary : brandColors.textSecondary,
        }}>
        {value || '-'}
      </TextStrong>
    </View>
  );
}

type InfoGroupProps = {
  items: { label: string; value?: string | null }[];
  stacked?: boolean;
};

export function InfoGroup({ items, stacked = false }: InfoGroupProps) {
  return (
    <View style={{ gap: 10 }}>
      {items.map((item) => (
        <InfoRow key={item.label} label={item.label} value={item.value} stacked={stacked} />
      ))}
    </View>
  );
}

type InlineMessageProps = {
  children: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
};

export function InlineMessage({ children, tone = 'default' }: InlineMessageProps) {
  const palette =
    tone === 'warning'
      ? { background: '#FFF6E5', text: '#7A5A00' }
      : tone === 'danger'
        ? { background: '#FDECEF', text: '#A32652' }
        : tone === 'success'
          ? { background: '#EAF8F1', text: '#1D6E49' }
          : { background: '#F7F3F5', text: brandColors.textSecondary };

  return (
    <View style={{ borderRadius: 10, backgroundColor: palette.background, paddingHorizontal: 12, paddingVertical: 10 }}>
      <TextBody style={{ color: palette.text }}>{children}</TextBody>
    </View>
  );
}
