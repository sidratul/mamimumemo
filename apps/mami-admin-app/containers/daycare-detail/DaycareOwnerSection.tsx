import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DaycareDetailSection } from './DaycareDetailSection';
import { Box, Text } from '../../theme/theme';

type DaycareOwnerSectionProps = {
  owner: {
    name: string;
    email: string;
    phone?: string;
  };
  getInitials: (name: string) => string;
};

export function DaycareOwnerSection({ owner, getInitials }: DaycareOwnerSectionProps) {
  return (
    <DaycareDetailSection title="Owner">
      <Box flexDirection="row" alignItems="center" gap="md">
        <Avatar.Text size={48} label={getInitials(owner.name)} />
        <Box flex={1} gap="xs">
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#24324B' }}>{owner.name}</Text>
          <Box flexDirection="row" alignItems="center" gap="xs">
            <MaterialCommunityIcons name="email-outline" size={14} color="#7A869A" />
            <Text color="textSecondary" numberOfLines={1}>
              {owner.email}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="xs">
            <MaterialCommunityIcons name="phone-outline" size={14} color="#7A869A" />
            <Text color="textSecondary">{owner.phone || '-'}</Text>
          </Box>
        </Box>
      </Box>
    </DaycareDetailSection>
  );
}
