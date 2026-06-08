import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Box, Text } from '../../theme/theme';

type ParentCardProps = {
  name: string;
  email: string;
  phone: string;
  childCount: number;
  notes?: string;
  onEditPress?: () => void;
  onDeactivatePress?: () => void;
  isBusy?: boolean;
};

export function ParentCard({ 
  name, 
  email, 
  phone, 
  childCount, 
  notes, 
  onEditPress, 
  onDeactivatePress,
  isBusy 
}: ParentCardProps) {
  return (
    <Box 
      backgroundColor="surface" 
      borderRadius="lg" 
      padding="md" 
      gap="sm"
      style={{
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text fontWeight="800" color="textPrimary">{name}</Text>
        <Box paddingHorizontal="sm" paddingVertical="xxs" borderRadius="sm" backgroundColor="background">
          <Text variant="bodySmall" fontWeight="700" color="primary" fontSize={10}>{childCount} ANAK</Text>
        </Box>
      </Box>
      
      <Box gap="xs">
        <Box flexDirection="row" alignItems="center" gap="xs">
          <MaterialCommunityIcons name="email-outline" size={14} color="#94A3B8" />
          <Text variant="bodySmall" color="textSecondary">{email}</Text>
        </Box>
        <Box flexDirection="row" alignItems="center" gap="xs">
          <MaterialCommunityIcons name="phone-outline" size={14} color="#94A3B8" />
          <Text variant="bodySmall" color="textSecondary">{phone}</Text>
        </Box>
      </Box>

      {notes ? (
        <Box backgroundColor="background" padding="sm" borderRadius="sm">
          <Text variant="bodySmall" color="textSecondary" style={{ fontStyle: 'italic' }}>{notes}</Text>
        </Box>
      ) : null}

      <Box flexDirection="row" gap="sm" marginTop="xs">
        <Box flex={1}>
          <Pressable onPress={onEditPress}>
             <Box paddingVertical="sm" alignItems="center" borderRadius="md" backgroundColor="background">
                <Text variant="bodySmall" fontWeight="700">Ubah</Text>
             </Box>
          </Pressable>
        </Box>
        <Box flex={1}>
          <Pressable onPress={onDeactivatePress}>
             <Box paddingVertical="sm" alignItems="center" borderRadius="md" backgroundColor="background">
                <Text variant="bodySmall" fontWeight="700" color="danger">{isBusy ? '...' : 'Nonaktif'}</Text>
             </Box>
          </Pressable>
        </Box>
      </Box>
    </Box>
  );
}
