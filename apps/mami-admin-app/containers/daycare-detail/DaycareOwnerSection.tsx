import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { DaycareDetailSection } from './DaycareDetailSection';
import { Box, Text } from '../../theme/theme';

type DaycareOwnerSectionProps = {
  owner: {
    _id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  getInitials: (name: string) => string;
};

export function DaycareOwnerSection({ owner, getInitials }: DaycareOwnerSectionProps) {
  return (
    <DaycareDetailSection title="Kontak Pemilik">
      <Box 
        flexDirection="row" 
        alignItems="center" 
        padding="md" 
        gap="md"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#F1F5F9',
        }}
      >
        <Box 
          width={56} 
          height={56} 
          borderRadius="full" 
          backgroundColor="background" 
          alignItems="center" 
          justifyContent="center"
          style={{ borderWidth: 2, borderColor: '#EEF2FF' }}
        >
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#4F46E5' }}>{getInitials(owner.name)}</Text>
        </Box>
        <Box flex={1} gap="xs">
          <Text variant="subtitle" fontWeight="800" fontSize={16} color="textPrimary">{owner.name}</Text>
          <Box gap="xxs">
            <Box flexDirection="row" alignItems="center" gap="xs">
              <MaterialCommunityIcons name="email-outline" size={14} color="#64748B" />
              <Text variant="bodySmall" color="textSecondary">{owner.email}</Text>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="xs">
              <MaterialCommunityIcons name="phone-outline" size={14} color="#64748B" />
              <Text variant="bodySmall" color="textSecondary">{owner.phone || 'Belum ada telepon'}</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </DaycareDetailSection>
  );
}
