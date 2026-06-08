import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Text } from '../../theme/theme';

type AttendanceSummaryProps = {
  presentCount: number;
  totalCount: number;
  label?: string;
};

export function AttendanceSummary({ presentCount, totalCount, label = 'KEHADIRAN ANAK' }: AttendanceSummaryProps) {
  return (
    <Box 
      flexDirection="row" 
      backgroundColor="surface" 
      padding="md" 
      borderRadius="xl"
      alignItems="center"
      gap="md"
      style={{
        borderWidth: 2,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <Box 
        width={44} 
        height={44} 
        borderRadius="full" 
        backgroundColor="background" 
        alignItems="center" 
        justifyContent="center"
      >
        <MaterialCommunityIcons name="account-group" size={24} color="#4F46E5" />
      </Box>
      
      <Box flex={1}>
        <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748B', letterSpacing: 1 }}>{label}</Text>
        <Box flexDirection="row" alignItems="baseline" gap="xs">
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A' }}>{presentCount}</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#94A3B8' }}>/ {totalCount} Hadir</Text>
        </Box>
      </Box>

      {/* Visual Progress Pill */}
      <Box 
        backgroundColor="success" 
        paddingHorizontal="md" 
        paddingVertical="xs" 
        borderRadius="full"
        style={{ opacity: 0.9 }}
      >
        <Text style={{ fontSize: 10, fontWeight: '900', color: '#FFFFFF' }}>
          {Math.round((presentCount / totalCount) * 100)}%
        </Text>
      </Box>
    </Box>
  );
}
