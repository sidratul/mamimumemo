import { useMemo, useState } from 'react';
import { SegmentTabs } from '@mami/ui';

import { Box } from '../../../theme/theme';
import { useSession } from '../../../providers/session-provider';
import { ScheduleTimeline } from '../../../components/organisms/ScheduleTimeline';
import { DateSwitcher } from '../../../components/molecules/DateSwitcher';
import { ActivitiesAttendanceDrawer } from './ActivitiesAttendanceDrawer';
import { ActivitiesAttendanceSection } from './ActivitiesAttendanceSection';
import { ActivitiesExtrasSection } from './ActivitiesExtrasSection';
import { ActivitiesReportsSection } from './ActivitiesReportsSection';
import { DUMMY_ATTENDANCE, DUMMY_SCHEDULE } from './activities-schedule.data';
import {
  type AttendanceRecord,
  getDefaultModeForChild,
  type AttendanceDraft,
  type AttendanceMode,
  type ChildAttendance,
} from './activities-schedule.types';

export function ActivitiesScheduleContainer() {
  const { session } = useSession();
  const [activeTabKey, setActiveTabKey] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceList, setAttendanceList] = useState<ChildAttendance[]>(DUMMY_ATTENDANCE);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerMode, setDrawerMode] = useState<AttendanceMode | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [draft, setDraft] = useState<AttendanceDraft>({
    time: '07:30',
    companionName: '',
    hasPhoto: false,
  });

  const isSitter = session?.ownerName === 'Sitter Dummy';
  const mySitterName = 'Ibu Siti';

  const filteredAttendance = useMemo(() => {
    if (isSitter) {
      return attendanceList.filter((item) => item.sitterName === mySitterName);
    }
    return attendanceList;
  }, [attendanceList, isSitter]);

  const attendanceSummary = useMemo(() => {
    const checkedIn = filteredAttendance.filter((item) => Boolean(item.checkIn)).length;
    const checkedOut = filteredAttendance.filter((item) => Boolean(item.checkOut)).length;
    const absent = filteredAttendance.filter((item) => Boolean(item.markedAbsent) && !item.checkIn).length;

    return {
      total: filteredAttendance.length,
      checkedIn,
      checkedOut,
      absent,
    };
  }, [filteredAttendance]);

  const visibleAttendance = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return filteredAttendance;
    }

    return filteredAttendance.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [filteredAttendance, searchQuery]);

  const selectedChild = useMemo(
    () => filteredAttendance.find((item) => item._id === selectedChildId) ?? null,
    [filteredAttendance, selectedChildId]
  );

  function openAttendanceDrawer(child: ChildAttendance, mode?: AttendanceMode) {
    setSelectedChildId(child._id);
    const nextMode = mode ?? getDefaultModeForChild(child);
    setDrawerMode(nextMode);
    const existingRecord = nextMode === 'check-in' ? child.checkIn : nextMode === 'check-out' ? child.checkOut : undefined;

    setDraft({
      time: existingRecord?.time ?? (nextMode === 'check-out' ? '16:00' : '07:30'),
      companionName:
        nextMode === 'absent'
          ? child.absentReason ?? ''
          : existingRecord?.companionName ?? '',
      hasPhoto: Boolean(existingRecord?.photoLabel),
    });
  }

  function openBulkAttendanceDrawer(mode: 'bulk-check-in' | 'bulk-check-out' | 'bulk-absent') {
    setSelectedChildId(null);
    setDrawerMode(mode);
    setBulkSelectedIds(
      filteredAttendance
        .filter((item) => {
          const keyword = searchQuery.trim().toLowerCase();
          return keyword ? item.name.toLowerCase().includes(keyword) : true;
        })
        .filter((item) =>
          mode === 'bulk-check-in'
            ? !item.checkIn && !item.markedAbsent
            : mode === 'bulk-check-out'
              ? Boolean(item.checkIn) && !item.checkOut
              : !item.checkIn && !item.markedAbsent
        )
        .map((item) => item._id)
    );
    setDraft({
      time: mode === 'bulk-check-out' ? '16:00' : '07:30',
      companionName: '',
      hasPhoto: false,
    });
  }

  function closeAttendanceDrawer() {
    setSelectedChildId(null);
    setBulkSelectedIds([]);
    setDrawerMode(null);
    setDraft({
      time: '07:30',
      companionName: '',
      hasPhoto: false,
    });
  }

  function saveAttendanceDraft() {
    if (drawerMode === 'bulk-check-in' || drawerMode === 'bulk-check-out' || drawerMode === 'bulk-absent') {
      if (!bulkSelectedIds.length) {
        closeAttendanceDrawer();
        return;
      }

      setAttendanceList((current) =>
        current.map((item) => {
          if (!bulkSelectedIds.includes(item._id)) {
            return item;
          }

          return {
            ...item,
            ...(drawerMode === 'bulk-check-in'
              ? {
                  checkIn: {
                    time: draft.time,
                    companionName: draft.companionName || 'Pengantar belum diisi',
                    photoLabel: draft.hasPhoto ? 'foto-hadir-massal.jpg' : '',
                  },
                  markedAbsent: false,
                }
              : drawerMode === 'bulk-check-out'
                ? {
                  checkOut: {
                    time: draft.time,
                    companionName: draft.companionName || 'Penjemput belum diisi',
                    photoLabel: draft.hasPhoto ? 'foto-pulang-massal.jpg' : '',
                  },
                }
                : {
                    markedAbsent: true,
                    absentReason: 'Ditandai tidak hadir',
                    checkIn: undefined,
                    checkOut: undefined,
                  }),
          };
        })
      );

      closeAttendanceDrawer();
      return;
    }

    if (!selectedChildId) {
      return;
    }

    setAttendanceList((current) =>
      current.map((item) => {
        if (item._id !== selectedChildId) {
          return item;
        }

        const nextRecord: AttendanceRecord = {
          time: draft.time,
          companionName: draft.companionName || (drawerMode === 'check-in' ? 'Pengantar belum diisi' : 'Penjemput belum diisi'),
          photoLabel: draft.hasPhoto
            ? drawerMode === 'check-in'
              ? 'foto-checkin.jpg'
              : 'foto-checkout.jpg'
            : '',
        };

        if (drawerMode === 'check-in') {
          return {
            ...item,
            markedAbsent: false,
            absentReason: undefined,
            checkIn: nextRecord,
          };
        }

        if (drawerMode === 'absent') {
          return {
            ...item,
            markedAbsent: true,
            absentReason: draft.companionName || 'Tidak ada alasan',
            checkIn: undefined,
            checkOut: undefined,
          };
        }

        return {
          ...item,
          checkOut: nextRecord,
        };
      })
    );

    closeAttendanceDrawer();
  }

  const bulkCandidates = useMemo(
    () => visibleAttendance.filter((item) => !item.checkIn && !item.markedAbsent),
    [visibleAttendance]
  );

  const bulkCheckoutCandidates = useMemo(
    () => visibleAttendance.filter((item) => Boolean(item.checkIn) && !item.checkOut),
    [visibleAttendance]
  );

  const bulkAbsentCandidates = useMemo(
    () => visibleAttendance.filter((item) => !item.checkIn && !item.markedAbsent),
    [visibleAttendance]
  );

  return (
    <Box flex={1} backgroundColor="surface">
      <Box padding="lg" paddingTop="xl">
        <DateSwitcher date={selectedDate} onDateChange={setSelectedDate} />
      </Box>

      <SegmentTabs
        activeKey={activeTabKey}
        initialKey="schedule"
        onChange={setActiveTabKey}
        variant="underline"
        contentContainerStyle={{ paddingBottom: 120 }}
        items={[
          {
            key: 'schedule',
            label: 'Jadwal',
            content: (
              <ScheduleTimeline
                dateLabel={selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                items={DUMMY_SCHEDULE}
                onItemAction={(item) => console.log('Action:', item.title)}
              />
            ),
          },
          {
            key: 'attendance',
            label: 'Absensi',
            content: (
              <ActivitiesAttendanceSection
                attendanceSummary={attendanceSummary}
                attendanceList={visibleAttendance}
                searchQuery={searchQuery}
                onChangeSearchQuery={setSearchQuery}
                onOpenChild={openAttendanceDrawer}
                onOpenBulk={openBulkAttendanceDrawer}
              />
            ),
          },
          {
            key: 'extras',
            label: 'Tambahan',
            content: <ActivitiesExtrasSection />,
          },
          {
            key: 'logs',
            label: 'Laporan',
            content: <ActivitiesReportsSection />,
          },
        ]}
      />

      <ActivitiesAttendanceDrawer
        visible={Boolean(drawerMode)}
        mode={drawerMode}
        selectedChild={selectedChild}
        bulkSelectedIds={bulkSelectedIds}
        draft={draft}
        bulkCandidates={bulkCandidates}
        bulkCheckoutCandidates={bulkCheckoutCandidates}
        bulkAbsentCandidates={bulkAbsentCandidates}
        onChangeMode={setDrawerMode}
        onChangeBulkSelectedIds={setBulkSelectedIds}
        onChangeDraft={setDraft}
        onClose={closeAttendanceDrawer}
        onSave={saveAttendanceDraft}
      />

    </Box>
  );
}
