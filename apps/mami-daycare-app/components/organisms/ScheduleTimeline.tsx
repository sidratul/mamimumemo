import { Box, Text } from '../../theme/theme';
import { ScheduleTimelineItem, type TimelineItem } from '../molecules/ScheduleTimelineItem';

type ScheduleTimelineProps = {
  dateLabel: string;
  items: TimelineItem[];
  onItemAction?: (item: TimelineItem) => void;
};

export function ScheduleTimeline({ dateLabel, items, onItemAction }: ScheduleTimelineProps) {
  return (
    <Box paddingHorizontal="xs" gap="md">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Text variant="subtitle" fontWeight="800" color="textPrimary">Rutin Harian</Text>
          <Text variant="bodySmall" color="textSecondary">{dateLabel}</Text>
        </Box>
        <Box backgroundColor="background" paddingHorizontal="sm" paddingVertical="xs" borderRadius="full">
          <Text variant="bodySmall" color="textPrimary" fontWeight="800">{items.length} aktivitas</Text>
        </Box>
      </Box>
      
      {items.map((item) => (
        <ScheduleTimelineItem 
          key={item.id} 
          item={item} 
          onActionPress={onItemAction} 
        />
      ))}
    </Box>
  );
}
