import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Box, Text } from '../../theme/theme';

type DaycareHeroSectionProps = {
  name: string;
  address: string;
  logoUrl?: string;
};

export function DaycareHeroSection({ name, address, logoUrl }: DaycareHeroSectionProps) {
  const logoSource = logoUrl ? { uri: logoUrl } : null;

  return (
    <Box flexDirection="row" gap="lg" alignItems="center" paddingHorizontal="xs">
      <Box
        width={64}
        height={64}
        alignItems="center"
        justifyContent="center"
        backgroundColor="background"
        style={{ overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
        {logoSource ? (
          <Image source={logoSource} style={{ width: 64, height: 64 }} contentFit="cover" />
        ) : (
          <MaterialCommunityIcons name="office-building" size={32} color="#CBD5E1" />
        )}
      </Box>
      <Box flex={1} gap="xs">
        <Text variant="subtitle" fontWeight="800" fontSize={20} color="textPrimary">{name}</Text>
        <Box flexDirection="row" alignItems="center" gap="xs">
          <MaterialCommunityIcons name="map-marker-radius-outline" size={16} color="#64748B" />
          <Text variant="bodySmall" color="textSecondary">{address}</Text>
        </Box>
      </Box>
    </Box>
  );
}
