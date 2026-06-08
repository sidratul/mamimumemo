import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Text } from '../../theme/theme';

type OperationsSummaryCardProps = {
  label: string;
  value: number;
  icon: any;
  color: string;
};

export function OperationsSummaryCard({ label, value, icon, color }: OperationsSummaryCardProps) {
  return (
    <Box 
      flex={1} 
      backgroundColor="surface" 
      borderRadius="xl" // Claymorphism: Larger radius
      padding="md" 
      gap="xs"
      style={{
        borderWidth: 2, // Chunky border
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Text>
        <MaterialCommunityIcons name={icon} size={18} color={color} />
      </Box>
      <Text style={{ fontSize: 32, fontWeight: '900', color: '#0F172A' }}>{value}</Text>
    </Box>
  );
}
