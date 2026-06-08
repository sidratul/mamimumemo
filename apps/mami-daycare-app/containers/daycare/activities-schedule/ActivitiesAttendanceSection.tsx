import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@mami/ui';
import { TextInput } from 'react-native-paper';

import { Box, Text } from '../../../theme/theme';

import {
  getAttendanceStatusLabel,
  getAttendanceStatusTone,
  type AttendanceMode,
  type ChildAttendance,
} from './activities-schedule.types';

type AttendanceSummary = {
  total: number;
  checkedIn: number;
  checkedOut: number;
  absent: number;
};

type ActivitiesAttendanceSectionProps = {
  attendanceSummary: AttendanceSummary;
  attendanceList: ChildAttendance[];
  searchQuery: string;
  onChangeSearchQuery: (value: string) => void;
  onOpenChild: (child: ChildAttendance) => void;
  onOpenBulk: (mode: Extract<AttendanceMode, 'bulk-check-in' | 'bulk-check-out' | 'bulk-absent'>) => void;
};

function SummaryStat(props: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; color: string; label: string; value: string }) {
  return (
    <Box
      flex={1}
      borderRadius="lg"
      padding="sm"
      gap="xxs"
      style={{ backgroundColor: `${props.color}12` }}
    >
      <Box flexDirection="row" alignItems="center" gap="xs">
        <MaterialCommunityIcons name={props.icon} size={15} color={props.color} />
        <Text variant="bodySmall" color="textSecondary">{props.label}</Text>
      </Box>
      <Text fontWeight="800" color="textPrimary" fontSize={16}>
        {props.value}
      </Text>
    </Box>
  );
}

export function ActivitiesAttendanceSection({
  attendanceSummary,
  attendanceList,
  searchQuery,
  onChangeSearchQuery,
  onOpenChild,
  onOpenBulk,
}: ActivitiesAttendanceSectionProps) {
  return (
    <Box paddingHorizontal="xs" gap="sm">
      <Box gap="sm">
        <Box flexDirection="row" gap="sm">
          <SummaryStat
            icon="login"
            color="#16A34A"
            label="Hadir"
            value={`${attendanceSummary.checkedIn}/${attendanceSummary.total}`}
          />
          <SummaryStat
            icon="logout"
            color="#2563EB"
            label="Pulang"
            value={`${attendanceSummary.checkedOut}/${attendanceSummary.checkedIn || 0}`}
          />
          <SummaryStat
            icon="close-circle-outline"
            color="#DC2626"
            label="Tidak hadir"
            value={`${attendanceSummary.absent}`}
          />
        </Box>

        <Box flexDirection="row" gap="sm">
          <Button label="Hadir" variant="secondary" onPress={() => onOpenBulk('bulk-check-in')} style={{ flex: 1, borderRadius: 16 }} />
          <Button label="Pulang" variant="secondary" onPress={() => onOpenBulk('bulk-check-out')} style={{ flex: 1, borderRadius: 16 }} />
          <Button label="Tidak Hadir" variant="secondary" onPress={() => onOpenBulk('bulk-absent')} style={{ flex: 1, borderRadius: 16 }} />
        </Box>
      </Box>

      <TextInput
        mode="outlined"
        value={searchQuery}
        onChangeText={onChangeSearchQuery}
        placeholder="Cari nama anak"
        left={<TextInput.Icon icon="magnify" />}
        outlineStyle={{ borderRadius: 16, borderColor: '#E2E8F0' }}
        contentStyle={{ backgroundColor: '#FFFFFF' }}
      />

      {!attendanceList.length ? (
        <Box backgroundColor="surface" borderRadius="xl" padding="md" style={{ borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text variant="bodySmall" color="textSecondary">
            Tidak ada anak yang cocok dengan pencarian.
          </Text>
        </Box>
      ) : null}

      {attendanceList.map((child) => {
        const tone = getAttendanceStatusTone(child);

        return (
          <Pressable key={child._id} onPress={() => onOpenChild(child)}>
            <Box
              backgroundColor="surface"
              borderRadius="xl"
              padding="md"
              gap="xs"
              style={{ borderWidth: 1, borderColor: '#E2E8F0' }}
            >
              <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="md">
                <Box flex={1} gap="xxs">
                  <Text fontSize={16} fontWeight="800" color="textPrimary">{child.name}</Text>
                  <Text variant="bodySmall" color="textSecondary">{child.sitterName}</Text>
                  <Box flexDirection="row" alignItems="center" flexWrap="wrap" gap="xs">
                    <Box flexDirection="row" alignItems="center" gap="xxs">
                      <MaterialCommunityIcons name="login" size={13} color="#94A3B8" />
                      <Text variant="bodySmall" color="textSecondary">{child.checkIn?.time ?? '-'}</Text>
                    </Box>
                    <Text variant="bodySmall" color="textSecondary">·</Text>
                    <Box flexDirection="row" alignItems="center" gap="xxs">
                      <MaterialCommunityIcons name="logout" size={13} color="#94A3B8" />
                      <Text variant="bodySmall" color="textSecondary">{child.checkOut?.time ?? '-'}</Text>
                    </Box>
                  </Box>
                </Box>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Box paddingHorizontal="sm" paddingVertical="xxs" borderRadius="sm" style={{ backgroundColor: tone.bg }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: tone.text }}>
                      {getAttendanceStatusLabel(child).toUpperCase()}
                    </Text>
                  </Box>
                  <MaterialCommunityIcons name="chevron-right" size={18} color="#94A3B8" />
                </Box>
              </Box>
            </Box>
          </Pressable>
        );
      })}
    </Box>
  );
}
