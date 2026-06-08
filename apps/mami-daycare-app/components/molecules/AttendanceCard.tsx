import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Text, useAppTheme } from '../../theme/theme';

type AttendanceCardProps = {
  childName: string;
  sitterName?: string; // Visible for Admin/Owner
  status: 'PRESENT' | 'ABSENT';
  onToggle: () => void;
  showSitter?: boolean;
};

export function AttendanceCard({ 
  childName, 
  sitterName, 
  status, 
  onToggle,
  showSitter = false 
}: AttendanceCardProps) {
  const theme = useAppTheme();
  const isPresent = status === 'PRESENT';

  return (
    <Box 
      backgroundColor="surface" 
      borderRadius="xl"
      padding="md"
      flexDirection="row"
      alignItems="center"
      gap="md"
      style={{
        borderWidth: 2,
        borderColor: isPresent ? '#F1F5F9' : theme.colors.primary, // Primary border if absent to catch eye
        borderStyle: isPresent ? 'solid' : 'dashed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      {/* Avatar Placeholder */}
      <Box 
        width={50} 
        height={50} 
        borderRadius="lg" 
        backgroundColor="background" 
        alignItems="center" 
        justifyContent="center"
        style={{ borderBottomWidth: 3, borderBottomColor: '#E2E8F0' }}
      >
        <MaterialCommunityIcons name="baby-face-outline" size={28} color="#94A3B8" />
      </Box>

      <Box flex={1} gap="xxs">
        <Text style={{ fontSize: 16, fontWeight: '900', color: isPresent ? '#64748B' : '#0F172A' }}>
          {childName}
        </Text>
        
        {showSitter && sitterName ? (
           <Box flexDirection="row" alignItems="center" gap="xs">
             <MaterialCommunityIcons name="account-tie-outline" size={12} color="#94A3B8" />
             <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8' }}>{sitterName.toUpperCase()}</Text>
           </Box>
        ) : null}

        <Box 
          alignSelf="flex-start"
          marginTop="xs"
          paddingHorizontal="sm"
          paddingVertical="xxs"
          borderRadius="xs"
          backgroundColor={isPresent ? 'success' : 'background'}
        >
          <Text style={{ fontSize: 9, fontWeight: '900', color: isPresent ? '#FFFFFF' : '#94A3B8' }}>
            {isPresent ? 'HADIR' : 'BELUM HADIR'}
          </Text>
        </Box>
      </Box>

      <Pressable onPress={onToggle}>
        <Box 
          width={44} 
          height={44} 
          borderRadius="lg" 
          backgroundColor={isPresent ? 'background' : 'primary'}
          alignItems="center" 
          justifyContent="center"
          style={{
            shadowColor: theme.colors.primary,
            shadowOpacity: isPresent ? 0 : 0.2,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 3 },
            elevation: isPresent ? 0 : 3,
          }}
        >
          <MaterialCommunityIcons 
            name={isPresent ? 'close' : 'check'} 
            size={24} 
            color={isPresent ? '#94A3B8' : '#FFFFFF'} 
          />
        </Box>
      </Pressable>
    </Box>
  );
}
