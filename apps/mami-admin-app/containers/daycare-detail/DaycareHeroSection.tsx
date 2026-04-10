import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Box, Text } from '../../theme/theme';

type DaycareHeroSectionProps = {
  name: string;
  address: string;
  logoUrl?: string;
};

export function DaycareHeroSection({ name, address, logoUrl }: DaycareHeroSectionProps) {
  const logoSource = logoUrl ? { uri: logoUrl } : require('../../assets/images/logo.png');

  return (
    <Box flexDirection="row" gap="md" alignItems="center">
      <Box
        width={56}
        height={56}
        alignItems="center"
        justifyContent="center"
        style={{ backgroundColor: '#EEF3FF', overflow: 'hidden', borderRadius: 12 }}>
        <Image source={logoSource} style={{ width: 56, height: 56 }} contentFit="cover" />
      </Box>
      <Box flex={1} gap="xs">
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#24324B' }}>{name}</Text>
        <Box flexDirection="row" alignItems="center" gap="xs">
          <MaterialCommunityIcons name="map-marker-outline" size={16} color="#7A869A" />
          <Text color="textSecondary">{address}</Text>
        </Box>
      </Box>
    </Box>
  );
}
