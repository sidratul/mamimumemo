import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { brandColors } from '../../theme/brand';
import { TextBody, TextMuted, TextStrong } from './Typography';

type ActionTileProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
};

export function ActionTile({
  title,
  description,
  icon,
  trailing,
  onPress,
}: ActionTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: brandColors.border,
        backgroundColor: brandColors.surface,
        padding: 16,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {icon ? <View>{icon}</View> : null}
        <View style={{ flex: 1, gap: 4 }}>
          <TextStrong>{title}</TextStrong>
          {description ? <TextMuted>{description}</TextMuted> : null}
        </View>
        {trailing ? trailing : <TextBody style={{ color: brandColors.textSecondary }}>Lihat</TextBody>}
      </View>
    </Pressable>
  );
}
