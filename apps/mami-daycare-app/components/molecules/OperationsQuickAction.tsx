import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Text } from '../../theme/theme';

type OperationsQuickActionProps = {
  label: string;
  icon: any;
  color: string;
  onPress: () => void;
};

export function OperationsQuickAction({ label, icon, color, onPress }: OperationsQuickActionProps) {
  return (
    <Box flex={1}>
      <Pressable onPress={onPress}>
        <Box 
          backgroundColor="surface" 
          borderRadius="xl" // Claymorphism
          padding="lg" 
          alignItems="center" 
          style={{ 
            elevation: 4, 
            borderWidth: 2, 
            borderColor: '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 15,
          }}
        >
          <MaterialCommunityIcons name={icon} size={32} color={color} />
          <Text style={{ fontSize: 10, fontWeight: '900', marginTop: 12, color: '#0F172A', letterSpacing: 1 }}>{label.toUpperCase()}</Text>
        </Box>
      </Pressable>
    </Box>
  );
}
