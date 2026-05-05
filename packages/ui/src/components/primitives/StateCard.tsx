import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { brandColors } from '../../theme/brand';
import { Button } from './Button';
import { TextBody, TextMuted, TextStrong } from './Typography';

type StateCardTone = 'default' | 'danger';

type StateCardProps = {
  title: string;
  description?: string;
  tone?: StateCardTone;
  loading?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  children?: ReactNode;
};

export function StateCard({
  title,
  description,
  tone = 'default',
  loading = false,
  actionLabel,
  onActionPress,
  children,
}: StateCardProps) {
  const textColor = tone === 'danger' ? brandColors.danger : brandColors.textPrimary;

  return (
    <View
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: brandColors.border,
        backgroundColor: brandColors.surface,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
      {loading ? <ActivityIndicator color={brandColors.primary} /> : null}
      <TextStrong style={{ color: textColor, textAlign: 'center' }}>{title}</TextStrong>
      {description ? <TextMuted style={{ textAlign: 'center' }}>{description}</TextMuted> : null}
      {children}
      {actionLabel && onActionPress ? <Button label={actionLabel} onPress={onActionPress} variant="secondary" /> : null}
    </View>
  );
}
