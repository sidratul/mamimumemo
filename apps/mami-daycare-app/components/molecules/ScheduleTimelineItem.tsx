import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@mami/ui';
import { Box, Text } from '../../theme/theme';
import { ActivityCategoryBadge, type ActivityCategory } from '../atoms/ActivityCategoryBadge';

export type TimelineItem = {
  id: string;
  time: string;
  title: string;
  category: ActivityCategory;
  status: 'DONE' | 'ONGOING' | 'UPCOMING';
  description?: string;
};

type ScheduleTimelineItemProps = {
  item: TimelineItem;
  onActionPress?: (item: TimelineItem) => void;
};

export function ScheduleTimelineItem({ item, onActionPress }: ScheduleTimelineItemProps) {
  const isActive = item.status === 'ONGOING';
  const isDone = item.status === 'DONE';
  const accentColor = isActive ? '#4F46E5' : isDone ? '#10B981' : '#CBD5E1';
  
  return (
    <Box flexDirection="row" gap="md">
      <Box alignItems="center" width={55}>
        <Text fontWeight="800" color={isActive ? 'primary' : 'textSecondary'} fontSize={13}>{item.time}</Text>
        <Box flex={1} width={3} backgroundColor="border" marginVertical="xs" borderRadius="full" style={{ opacity: 0.35 }} />
      </Box>
      
      <Box 
        flex={1} 
        backgroundColor="surface" 
        padding="md" 
        borderRadius="xl"
        borderWidth={1}
        borderColor="border"
        gap="sm"
      >
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <ActivityCategoryBadge category={item.category} />
          <Box flexDirection="row" alignItems="center" gap="xs">
            <Box width={8} height={8} borderRadius="full" style={{ backgroundColor: accentColor }} />
            <Text variant="bodySmall" color="textSecondary" fontWeight="700">
              {isDone ? 'Selesai' : isActive ? 'Berjalan' : 'Berikutnya'}
            </Text>
          </Box>
        </Box>
        
        <Text fontWeight="800" fontSize={16} color={isDone ? 'textSecondary' : 'textPrimary'}>
          {item.title}
        </Text>
        
        {item.description ? (
          <Text variant="bodySmall" color="textSecondary" lineHeight={20}>{item.description}</Text>
        ) : null}

        {isActive && (
          <Button 
            label="Catat Laporan" 
            onPress={() => onActionPress?.(item)} 
            variant="secondary" 
            style={{ marginTop: 4, height: 44, borderRadius: 16 }}
            icon={<MaterialCommunityIcons name="pencil-plus" size={18} color="#0F172A" />}
          />
        )}
      </Box>
    </Box>
  );
}
