import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { brandColors } from '../../theme/brand';
import { TextBody, TextMuted, TextStrong } from './Typography';

export type ActionTileProps = {
  title: string;
  description: string;
  onPress: () => void;
  icon?: ReactNode;
  contentContainerStyle?: any;
};

export function ActionTile({ title, description, onPress, icon, contentContainerStyle }: ActionTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: brandColors.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: brandColors.border,
          gap: 16,
          opacity: pressed ? 0.8 : 1,
        },
        contentContainerStyle,
      ]}>
      {icon}
      <View style={{ flex: 1, gap: 2 }}>
        <TextStrong style={{ fontSize: 16 }}>{title}</TextStrong>
        <TextMuted style={{ fontSize: 13 }}>{description}</TextMuted>
      </View>
    </Pressable>
  );
}
