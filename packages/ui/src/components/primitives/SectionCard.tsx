import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

import { brandColors } from '../../theme/brand';
import { TextMuted, TextStrong } from './Typography';

type SectionCardProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  padded?: boolean;
  gap?: number;
};

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  style,
  contentStyle,
  padded = true,
  gap = 12,
}: SectionCardProps) {
  return (
    <View
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: brandColors.border,
        backgroundColor: brandColors.surface,
        padding: padded ? 16 : 0,
        gap,
        ...style,
      }}>
      {title || subtitle || action ? (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1, gap: 4 }}>
            {title ? <TextStrong style={{ fontSize: 17 }}>{title}</TextStrong> : null}
            {subtitle ? <TextMuted>{subtitle}</TextMuted> : null}
          </View>
          {action ? <View>{action}</View> : null}
        </View>
      ) : null}
      <View style={contentStyle}>{children}</View>
    </View>
  );
}
