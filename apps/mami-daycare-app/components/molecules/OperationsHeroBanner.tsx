import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Text } from '../../theme/theme';

type OperationsHeroBannerProps = {
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export function OperationsHeroBanner({ title, subtitle }: OperationsHeroBannerProps) {
  return (
    <Box 
      padding="lg" 
      borderRadius="lg" 
      backgroundColor="primary" 
      style={{ 
        shadowColor: '#4F46E5',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6
      }}
    >
      <Box flexDirection="row" alignItems="center" gap="md">
        <MaterialCommunityIcons name="rocket-launch" size={24} color="#FFFFFF" />
        <Box flex={1}>
          <Text color="surface" fontWeight="800" fontSize={16}>{title}</Text>
          <Text color="surface" variant="bodySmall" style={{ opacity: 0.8 }}>{subtitle}</Text>
        </Box>
      </Box>
    </Box>
  );
}
