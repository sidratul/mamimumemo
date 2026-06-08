export type AttendanceRecord = {
  time: string;
  companionName: string;
  photoLabel: string;
};

export type ChildAttendance = {
  _id: string;
  name: string;
  sitterName: string;
  markedAbsent?: boolean;
  absentReason?: string;
  checkIn?: AttendanceRecord;
  checkOut?: AttendanceRecord;
};

export type AttendanceDraft = {
  time: string;
  companionName: string;
  hasPhoto: boolean;
};

export type AttendanceMode =
  | 'check-in'
  | 'check-out'
  | 'absent'
  | 'bulk-check-in'
  | 'bulk-check-out'
  | 'bulk-absent';

export function getAttendanceStatusLabel(item: ChildAttendance) {
  if (item.checkOut) return 'Sudah pulang';
  if (item.checkIn) return 'Sudah hadir';
  if (item.markedAbsent) return 'Tidak hadir';
  return 'Belum datang';
}

export function getAttendanceStatusTone(item: ChildAttendance) {
  if (item.checkOut) return { bg: '#E0F2FE', text: '#0369A1' };
  if (item.checkIn) return { bg: '#DCFCE7', text: '#166534' };
  if (item.markedAbsent) return { bg: '#FEE2E2', text: '#B91C1C' };
  return { bg: '#FEF3C7', text: '#92400E' };
}

export function getDefaultModeForChild(child: ChildAttendance): AttendanceMode {
  if (child.markedAbsent) return 'absent';
  if (!child.checkIn) return 'check-in';
  if (!child.checkOut) return 'check-out';
  return 'check-out';
}
