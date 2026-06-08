import { type TimelineItem } from '../../../components/molecules/ScheduleTimelineItem';

import type { ChildAttendance } from './activities-schedule.types';

export const DUMMY_SCHEDULE: TimelineItem[] = [
  { id: '1', time: '08:00', title: 'Penerimaan Anak (Check-in)', category: 'CARE', status: 'DONE' },
  { id: '2', time: '09:00', title: 'Sarapan Pagi Terpimpin', category: 'MEAL', status: 'DONE' },
  {
    id: '3',
    time: '10:00',
    title: 'Aktivitas Eksplorasi Sensorik',
    category: 'LEARNING',
    status: 'ONGOING',
    description: 'Bermain dengan media air dan pewarna makanan alami.',
  },
  { id: '4', time: '11:30', title: 'Makan Siang & Buah', category: 'MEAL', status: 'UPCOMING' },
  { id: '5', time: '12:30', title: 'Waktu Istirahat (Nap Time)', category: 'NAP', status: 'UPCOMING' },
];

export const DUMMY_ATTENDANCE: ChildAttendance[] = [
  {
    _id: 'c1',
    name: 'Alma Putri',
    sitterName: 'Ibu Siti',
    checkIn: { time: '07:45', companionName: 'Ibu Rina', photoLabel: 'checkin-alma.jpg' },
  },
  {
    _id: 'c2',
    name: 'Budi Santoso',
    sitterName: 'Ibu Siti',
    checkIn: { time: '07:52', companionName: 'Ayah Budi', photoLabel: 'checkin-budi.jpg' },
    checkOut: { time: '16:10', companionName: 'Ayah Budi', photoLabel: 'checkout-budi.jpg' },
  },
  { _id: 'c3', name: 'Citra Dewi', sitterName: 'Kak Aisyah' },
  {
    _id: 'c4',
    name: 'Doni Ramadhan',
    sitterName: 'Kak Aisyah',
    markedAbsent: true,
    absentReason: 'Demam sejak pagi',
  },
  {
    _id: 'c5',
    name: 'Eka Lestari',
    sitterName: 'Ibu Siti',
    checkIn: { time: '08:02', companionName: 'Ibu Eka', photoLabel: 'checkin-eka.jpg' },
  },
];
