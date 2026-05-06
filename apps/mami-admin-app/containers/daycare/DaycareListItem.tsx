import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { formatDateId } from '@mami/core';
import { Pressable } from 'react-native';

import { DaycareRecord } from '../../shared/daycare/types';
import { Box, Text } from '../../theme/theme';
import { ApprovalStatusBadge } from './shared/ApprovalStatusBadge';

type DaycareListItemProps = {
  daycare: DaycareRecord;
  onPress: () => void;
};

export function DaycareListItem({ daycare, onPress }: DaycareListItemProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const statusDateLabel = daycare.approval?.history?.[0]?.changedAt
    ? formatDateId(daycare.approval.history[0].changedAt)
    : daycare.submittedAt ? formatDateId(daycare.submittedAt) : 'Belum diperbarui';
  
  const imageSource = daycare.logoUrl && !hasImageError ? { uri: daycare.logoUrl } : null;

  return (
    <Box
      backgroundColor="surface"
      borderRadius="lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F1F5F9',
      }}>
      <Pressable onPress={onPress} android_ripple={{ color: '#F1F5F9' }}>
        <Box flexDirection="row" alignItems="center" padding="md" gap="md">
          <Box
            width={52}
            height={52}
            borderRadius="md"
            alignItems="center"
            justifyContent="center"
            backgroundColor="background"
            style={{ overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' }}>
            {imageSource ? (
              <Image
                source={imageSource}
                style={{ width: 52, height: 52 }}
                contentFit="cover"
                onError={() => setHasImageError(true)}
              />
            ) : (
              <MaterialCommunityIcons name="office-building" size={26} color="#CBD5E1" />
            )}
          </Box>

          <Box flex={1} gap="xs">
            <Text variant="subtitle" fontWeight="800" fontSize={16} color="textPrimary" numberOfLines={1}>
              {daycare.name}
            </Text>

            <Box gap="xxs">
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons name="account-outline" size={14} color="#94A3B8" />
                <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
                  {daycare.owner.name}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons name="map-marker-outline" size={14} color="#94A3B8" />
                <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
                  {daycare.city || '-'}
                </Text>
              </Box>
            </Box>
            
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop="xs">
              <ApprovalStatusBadge status={daycare.approval?.status || 'DRAFT'} />
              <Text variant="bodySmall" color="textSecondary" style={{ fontSize: 11 }}>
                {statusDateLabel}
              </Text>
            </Box>
          </Box>
          
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
        </Box>
      </Pressable>
    </Box>
  );
}
