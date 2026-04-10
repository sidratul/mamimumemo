import { useState } from 'react';
import { Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { formatDateId } from '@mami/core';

import { AdminDaycare } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';
import { ApprovalStatusBadge } from './shared/ApprovalStatusBadge';

type DaycareListItemProps = {
  daycare: AdminDaycare;
  onPress: () => void;
};

export function DaycareListItem({ daycare, onPress }: DaycareListItemProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const statusDateLabel = daycare.statusChangedAt
    ? formatDateId(daycare.statusChangedAt)
    : 'Belum diperbarui';
  const defaultLogo = require('../../assets/images/logo.png');
  const imageSource = daycare.logoUrl && !hasImageError ? { uri: daycare.logoUrl } : defaultLogo;

  return (
    <Surface
      elevation={0}
      style={{
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8ECF4',
      }}>
      <Box flexDirection="row" alignItems="flex-start" padding="md" gap="md" onTouchEnd={onPress}>
        <Box
          width={56}
          height={56}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: '#EEF3FF', overflow: 'hidden' }}>
          <Image
            source={imageSource}
            style={{ width: 56, height: 56 }}
            contentFit="cover"
            onError={() => setHasImageError(true)}
          />
        </Box>

        <Box flex={1} gap="sm">
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#24324B' }} numberOfLines={2}>
            {daycare.name}
          </Text>

          <Box flexDirection="row" gap="md" alignItems="flex-start">
            <Box flex={1} gap="xs">
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons name="account-outline" size={14} color="#7A869A" />
                <Text color="textSecondary" numberOfLines={1} style={{ fontSize: 13 }}>
                  {daycare.owner.name}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons name="email-outline" size={14} color="#7A869A" />
                <Text color="textSecondary" numberOfLines={1} style={{ fontSize: 13 }}>
                  {daycare.owner.email}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons name="map-marker-outline" size={14} color="#7A869A" />
                <Text color="textSecondary" numberOfLines={1} style={{ fontSize: 13 }}>
                  {daycare.address || daycare.city || '-'}
                </Text>
              </Box>
            </Box>

            <Box alignItems="center" gap="xs" style={{ minWidth: 88 }}>
              <ApprovalStatusBadge status={daycare.approvalStatus} />
              <Text color="textSecondary" style={{ fontSize: 12, textAlign: 'center' }}>
                {statusDateLabel}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Surface>
  );
}
