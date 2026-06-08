import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Text, useAppTheme } from '../../theme/theme';

type DateSwitcherProps = {
  date: Date;
  onDateChange: (d: Date) => void;
};

export function DateSwitcher({ date, onDateChange }: DateSwitcherProps) {
  const theme = useAppTheme();
  
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const moveDate = (days: number) => {
    const next = new Date(date);
    next.setDate(date.getDate() + days);
    onDateChange(next);
  };

  return (
    <Box 
      flexDirection="row" 
      alignItems="center" 
      backgroundColor="surface" 
      padding="xs" 
      borderRadius="xl"
      style={{
        borderWidth: 2,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 4,
      }}
    >
      <Pressable onPress={() => moveDate(-1)}>
        <Box padding="sm" borderRadius="lg" backgroundColor="background">
          <MaterialCommunityIcons name="chevron-left" size={24} color={theme.colors.primary} />
        </Box>
      </Pressable>

      <Box flex={1} alignItems="center">
        <Text fontWeight="800" fontSize={16} color="textPrimary">{formatDate(date).toUpperCase()}</Text>
      </Box>

      <Pressable onPress={() => moveDate(1)}>
        <Box padding="sm" borderRadius="lg" backgroundColor="background">
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
        </Box>
      </Pressable>
    </Box>
  );
}
