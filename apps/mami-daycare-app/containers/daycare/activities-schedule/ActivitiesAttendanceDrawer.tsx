import { TextInput } from 'react-native-paper';
import { BottomDrawer, Button, FieldShell, MultiSelectField } from '@mami/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Box, Text } from '../../../theme/theme';
import {
  getAttendanceStatusLabel,
  getAttendanceStatusTone,
  type AttendanceDraft,
  type AttendanceMode,
  type ChildAttendance,
} from './activities-schedule.types';

type ActivitiesAttendanceDrawerProps = {
  visible: boolean;
  mode: AttendanceMode | null;
  selectedChild: ChildAttendance | null;
  bulkSelectedIds: string[];
  draft: AttendanceDraft;
  bulkCandidates: ChildAttendance[];
  bulkCheckoutCandidates: ChildAttendance[];
  bulkAbsentCandidates: ChildAttendance[];
  onChangeMode: (mode: AttendanceMode) => void;
  onChangeBulkSelectedIds: (values: string[]) => void;
  onChangeDraft: (next: AttendanceDraft) => void;
  onClose: () => void;
  onSave: () => void;
};

function getDrawerTitle(mode: AttendanceMode | null) {
  if (mode === 'check-in') return 'Form Kehadiran';
  if (mode === 'check-out') return 'Form Kepulangan';
  if (mode === 'bulk-check-in') return 'Form Hadir Massal';
  if (mode === 'bulk-check-out') return 'Form Pulang Massal';
  return 'Form Tidak Hadir';
}

function getDrawerDescription(mode: AttendanceMode | null, selectedChild: ChildAttendance | null) {
  if (mode === 'bulk-check-in') return 'Pilih beberapa anak yang datang bersamaan, lalu simpan sekali.';
  if (mode === 'bulk-check-out') return 'Pilih beberapa anak yang pulang bersamaan, lalu simpan sekali.';
  if (mode === 'bulk-absent') return 'Pilih beberapa anak yang tidak hadir hari ini.';
  if (!selectedChild) return '';
  if (mode === 'check-in') return `${selectedChild.name} datang ke daycare.`;
  if (mode === 'check-out') return `${selectedChild.name} pulang dari daycare.`;
  return `${selectedChild.name} tidak hadir hari ini.`;
}

export function ActivitiesAttendanceDrawer({
  visible,
  mode,
  selectedChild,
  bulkSelectedIds,
  draft,
  bulkCandidates,
  bulkCheckoutCandidates,
  bulkAbsentCandidates,
  onChangeMode,
  onChangeBulkSelectedIds,
  onChangeDraft,
  onClose,
  onSave,
}: ActivitiesAttendanceDrawerProps) {
  const activeBulkCandidates =
    mode === 'bulk-check-in'
      ? bulkCandidates
      : mode === 'bulk-check-out'
        ? bulkCheckoutCandidates
        : bulkAbsentCandidates;

  return (
    <BottomDrawer visible={visible} onDismiss={onClose}>
      <Box gap="sm">
        <Text fontSize={18} fontWeight="800" color="textPrimary">{getDrawerTitle(mode)}</Text>
        <Text variant="bodySmall" color="textSecondary">{getDrawerDescription(mode, selectedChild)}</Text>
      </Box>

      {selectedChild ? (
        <Box backgroundColor="background" borderRadius="lg" padding="md" gap="sm">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="sm">
            <Text fontWeight="800" color="textPrimary">{selectedChild.name}</Text>
            <Box
              paddingHorizontal="sm"
              paddingVertical="xxs"
              borderRadius="sm"
              style={{ backgroundColor: getAttendanceStatusTone(selectedChild).bg }}
            >
              <Text style={{ fontSize: 10, fontWeight: '800', color: getAttendanceStatusTone(selectedChild).text }}>
                {getAttendanceStatusLabel(selectedChild).toUpperCase()}
              </Text>
            </Box>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="xxs">
            <MaterialCommunityIcons name="account-tie-outline" size={14} color="#94A3B8" />
            <Text variant="bodySmall" color="textSecondary">{selectedChild.sitterName}</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="xxs">
            <MaterialCommunityIcons name="login" size={14} color="#94A3B8" />
            <Text variant="bodySmall" color="textSecondary">
              {selectedChild.checkIn ? `${selectedChild.checkIn.time} · ${selectedChild.checkIn.companionName}` : 'Belum hadir'}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="xxs">
            <MaterialCommunityIcons name="logout" size={14} color="#94A3B8" />
            <Text variant="bodySmall" color="textSecondary">
              {selectedChild.checkOut ? `${selectedChild.checkOut.time} · ${selectedChild.checkOut.companionName}` : 'Belum pulang'}
            </Text>
          </Box>
          {selectedChild.markedAbsent ? (
            <Box flexDirection="row" alignItems="center" gap="xxs">
              <MaterialCommunityIcons name="text-box-outline" size={14} color="#94A3B8" />
              <Text variant="bodySmall" color="textSecondary">{selectedChild.absentReason || 'Tidak ada alasan'}</Text>
            </Box>
          ) : null}
          <Box flexDirection="row" gap="sm">
            <Button label="Hadir" variant={mode === 'check-in' ? 'primary' : 'secondary'} onPress={() => onChangeMode('check-in')} style={{ flex: 1 }} />
            <Button label="Pulang" variant={mode === 'check-out' ? 'primary' : 'secondary'} onPress={() => onChangeMode('check-out')} style={{ flex: 1 }} />
            <Button label="Tidak Hadir" variant={mode === 'absent' ? 'danger' : 'secondary'} onPress={() => onChangeMode('absent')} style={{ flex: 1 }} />
          </Box>
        </Box>
      ) : null}

      {mode === 'bulk-check-in' || mode === 'bulk-check-out' || mode === 'bulk-absent' ? (
        <Box gap="sm">
          {activeBulkCandidates.length ? (
            <FieldShell
              label="Anak"
              required
              helperText={mode === 'bulk-absent' ? 'Pilih anak yang tidak hadir hari ini' : 'Bisa pilih lebih dari satu anak'}
            >
              <MultiSelectField
                value={bulkSelectedIds}
                onChange={onChangeBulkSelectedIds}
                title="Pilih anak"
                placeholder="Pilih beberapa anak"
                options={activeBulkCandidates.map((child) => ({
                  label: child.name,
                  value: child._id,
                  helperText:
                    mode === 'bulk-check-in'
                      ? `Pendamping: ${child.sitterName}`
                      : mode === 'bulk-check-out'
                        ? `Sudah hadir ${child.checkIn?.time ?? ''}`
                        : `Pendamping: ${child.sitterName}`,
                }))}
              />
            </FieldShell>
          ) : (
            <Text variant="bodySmall" color="textSecondary">
              {mode === 'bulk-check-in'
                ? 'Semua anak sudah hadir.'
                : mode === 'bulk-check-out'
                  ? 'Belum ada anak yang siap dipulangkan.'
                  : 'Tidak ada anak yang bisa ditandai tidak hadir.'}
            </Text>
          )}
        </Box>
      ) : null}

      {mode ? (
        <>
          {mode !== 'absent' && mode !== 'bulk-absent' ? (
            <FieldShell label={mode === 'check-out' || mode === 'bulk-check-out' ? 'Jam pulang' : 'Jam hadir'} required>
              <TextInput mode="outlined" value={draft.time} onChangeText={(value) => onChangeDraft({ ...draft, time: value })} />
            </FieldShell>
          ) : null}

          <FieldShell
            label={
              mode === 'check-out' || mode === 'bulk-check-out'
                ? 'Dijemput oleh'
                : mode === 'absent' || mode === 'bulk-absent'
                  ? 'Alasan'
                  : 'Diantar oleh'
            }
            required
            helperText={mode === 'absent' || mode === 'bulk-absent' ? 'Isi alasan jika anak tidak hadir.' : undefined}
          >
            <TextInput
              mode="outlined"
              value={draft.companionName}
              onChangeText={(value) => onChangeDraft({ ...draft, companionName: value })}
            />
          </FieldShell>

          {mode !== 'absent' && mode !== 'bulk-absent' ? (
            <Box backgroundColor="background" borderRadius="lg" padding="md" gap="sm">
              <Text fontWeight="700" color="textPrimary">
                Foto {mode === 'check-out' || mode === 'bulk-check-out' ? 'kepulangan' : 'kehadiran'}
              </Text>
              <Text variant="bodySmall" color="textSecondary">
                Dummy dulu. Nanti ini diganti ke camera/upload sungguhan.
              </Text>
              <Button
                label={draft.hasPhoto ? 'Foto dummy terpasang' : 'Pasang foto dummy'}
                variant={draft.hasPhoto ? 'secondary' : 'primary'}
                onPress={() => onChangeDraft({ ...draft, hasPhoto: !draft.hasPhoto })}
              />
            </Box>
          ) : null}
        </>
      ) : null}

      <Box flexDirection="row" gap="sm">
        <Button label="Batal" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
        <Button label="Simpan" onPress={onSave} style={{ flex: 1 }} />
      </Box>
    </BottomDrawer>
  );
}
