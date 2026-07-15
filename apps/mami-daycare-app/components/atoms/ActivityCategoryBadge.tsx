import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Text } from '../../theme/theme';

export type ActivityCategory = 'MEAL' | 'NAP' | 'PLAY' | 'LEARNING' | 'CARE';

const categoryConfig: Record<ActivityCategory, { icon: any; label: string; color: string; bg: string }> = {
  MEAL: { icon: 'food-apple', label: 'MAKAN', color: '#FF6B6B', bg: '#FFF5F5' },
  NAP: { icon: 'bed', label: 'TIDUR', color: '#4D96FF', bg: '#F0F7FF' },
  PLAY: { icon: 'toy-brick', label: 'MAIN', color: '#FFD93D', bg: '#FFFDEB' },
  LEARNING: { icon: 'book-open-variant', label: 'BELAJAR', color: '#6BCB77', bg: '#F2FBF4' },
  CARE: { icon: 'heart-pulse', label: 'PERAWATAN', color: '#4F46E5', bg: '#EEF2FF' },
};

type ActivityCategoryBadgeProps = {
  category: ActivityCategory;
};

export function ActivityCategoryBadge({ category }: ActivityCategoryBadgeProps) {
  const config = categoryConfig[category];
  
  return (
    <Box 
      flexDirection="row" 
      alignItems="center" 
      gap="xs" 
      paddingHorizontal="sm" 
      paddingVertical="xxs" 
      borderRadius="sm" 
      style={{ backgroundColor: config.bg }}
    >
      <MaterialCommunityIcons name={config.icon} size={12} color={config.color} />
      <Text style={{ fontSize: 10, fontWeight: '800', color: config.color, letterSpacing: 0.5 }}>
        {config.label}
      </Text>
    </Box>
  );
}
