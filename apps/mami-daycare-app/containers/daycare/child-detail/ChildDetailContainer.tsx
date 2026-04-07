import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Redirect, router } from 'expo-router';

import { useSession } from '../../../providers/session-provider';
import {
  getChildDailyRecords,
  getDaycareRoster,
  getMyDaycareRegistration,
  getTodayDailyCare,
  type DailyCareChildRecord,
  type DaycareChild,
  type DaycareParent,
} from '../../../services/registration';
import { Box, Text } from '../../../theme/theme';

type ChildDetailContainerProps = {
  id: string;
};

type HistoryWindow = 7 | 14 | 30;

function formatBirthDate(value: string) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatActivityTime(value: string) {
  return value || '-';
}

function formatSectionDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Box flex={1} backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
      <Text color="textSecondary">{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: '700' }}>{value}</Text>
    </Box>
  );
}

export function ChildDetailContainer({ id }: ChildDetailContainerProps) {
  const { isLoading, session } = useSession();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<DaycareChild | null>(null);
  const [parent, setParent] = useState<DaycareParent | null>(null);
  const [todayRecord, setTodayRecord] = useState<DailyCareChildRecord | null>(null);
  const [history, setHistory] = useState<Array<{ date: string; record: DailyCareChildRecord }>>([]);
  const [historyWindow, setHistoryWindow] = useState<HistoryWindow>(7);
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      if (!session) {
        return;
      }

      try {
        setLoading(true);
        setError('');

        const registration = await getMyDaycareRegistration(session.token);
        if (!registration || registration.approvalStatus !== 'APPROVED') {
          setError('Daycare belum aktif.');
          return;
        }

        const daycareId = session.daycareId || registration.id;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (historyWindow - 1));
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const [roster, dailyCare] = await Promise.all([
          getDaycareRoster(session.token, daycareId),
          getTodayDailyCare(session.token, daycareId),
        ]);

        const selectedChild = roster.children.find((item) => item.id === id) ?? null;
        const selectedParent = selectedChild
          ? roster.parents.find((item) => item.id === selectedChild.parentId) ?? null
          : null;
        const selectedRecord = dailyCare?.children.find((item) => item.childId === id) ?? null;

        setChild(selectedChild);
        setParent(selectedParent);
        setTodayRecord(selectedRecord);

        const historyRecords = await getChildDailyRecords(
          session.token,
          id,
          startDate.toISOString(),
          endDate.toISOString()
        );

        const nextHistory = historyRecords
          .map((record) => ({
            date: record.date,
            record: record.children.find((item) => item.childId === id),
          }))
          .filter((item): item is { date: string; record: DailyCareChildRecord } => Boolean(item.record));

        setHistory(nextHistory);

        if (!selectedChild) {
          setError('Data child tidak ditemukan.');
        }
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Gagal memuat detail child.');
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [historyWindow, id, session]);

  const attendanceSummary = useMemo(() => {
    if (!todayRecord?.attendance?.checkIn) {
      return 'Belum masuk';
    }

    if (todayRecord.attendance.checkOut?.time) {
      return `Pulang ${todayRecord.attendance.checkOut.time}`;
    }

    return `Masuk ${todayRecord.attendance.checkIn.time}`;
  }, [todayRecord]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF8F4' }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Box gap="xs">
        <Text style={{ fontSize: 28, fontWeight: '700' }}>{child?.profile.name || 'Child'}</Text>
        <Text color="textSecondary">{parent?.user.name || 'Parent belum terhubung'}</Text>
      </Box>

      {loading ? (
        <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
          <Text color="textSecondary">Memuat...</Text>
        </Box>
      ) : null}

      {!loading && error ? (
        <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="xs">
          <Text color="danger" style={{ fontWeight: '700' }}>Detail belum tersedia</Text>
          <Text color="textSecondary">{error}</Text>
        </Box>
      ) : null}

      {!loading && child ? (
        <>
          <Box flexDirection="row" gap="md">
            <SummaryCard label="Lahir" value={formatBirthDate(child.profile.birthDate)} />
            <SummaryCard label="Gender" value={child.profile.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'} />
          </Box>

          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="sm">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Profil</Text>
            <Text>{parent?.user.name || '-'}</Text>
            <Text color="textSecondary">{parent?.user.email || '-'}</Text>
            <Text color="textSecondary">{parent?.user.phone || '-'}</Text>
            {child.customData.notes ? <Text color="textSecondary">{child.customData.notes}</Text> : null}
          </Box>

          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="sm">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Hari Ini</Text>
            <Text>{attendanceSummary}</Text>
            <Box flexDirection="row" gap="md">
              <SummaryCard label="Masuk" value={todayRecord?.attendance?.checkIn?.time || '-'} />
              <SummaryCard label="Pulang" value={todayRecord?.attendance?.checkOut?.time || '-'} />
            </Box>
            {todayRecord?.notes ? <Text color="textSecondary">{todayRecord.notes}</Text> : null}
          </Box>

          <Box gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Timeline Hari Ini</Text>
            {todayRecord?.activities?.length ? (
              todayRecord.activities.map((activity, index) => (
                <Box key={`${activity.activityName}-${index}`} backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text style={{ fontWeight: '700' }}>{activity.activityName}</Text>
                    <Text color="textSecondary">{formatActivityTime(activity.startTime)}</Text>
                  </Box>
                  <Text color="textSecondary">{activity.category}</Text>
                  {activity.description ? <Text>{activity.description}</Text> : null}
                </Box>
              ))
            ) : (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
                <Text color="textSecondary">Belum ada aktivitas yang dicatat hari ini.</Text>
              </Box>
            )}
          </Box>

          <Box gap="md">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Riwayat</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {([7, 14, 30] as const).map((window) => {
                  const active = historyWindow === window;

                  return (
                    <Pressable key={window} onPress={() => setHistoryWindow(window)}>
                      <Box
                        backgroundColor={active ? 'primary' : 'background'}
                        borderRadius="lg"
                        borderWidth={1}
                        borderColor={active ? 'primary' : 'border'}
                        paddingHorizontal="md"
                        paddingVertical="sm">
                        <Text style={{ color: active ? '#FFFFFF' : '#3D2218', fontWeight: '700', fontSize: 12 }}>
                          {window}H
                        </Text>
                      </Box>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Box>
            {history.length ? (
              history.map((item) => {
                const activityCount = item.record.activities.length;
                const attendance = item.record.attendance?.checkIn
                  ? item.record.attendance.checkOut?.time
                    ? `Pulang ${item.record.attendance.checkOut.time}`
                    : `Masuk ${item.record.attendance.checkIn.time}`
                  : 'Belum masuk';

                return (
                  <Box key={item.date} backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
                    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text style={{ fontWeight: '700' }}>{formatSectionDate(item.date)}</Text>
                      <Text color="textSecondary">{activityCount} aktivitas</Text>
                    </Box>
                    <Text color="textSecondary">{attendance}</Text>
                    {item.record.notes ? <Text>{item.record.notes}</Text> : null}
                  </Box>
                );
              })
            ) : (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
                <Text color="textSecondary">Belum ada riwayat harian yang tersimpan.</Text>
              </Box>
            )}
          </Box>
        </>
      ) : null}

      <Box gap="sm">
        <Pressable onPress={() => router.push('/(daycare)/daily-care')}>
          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" alignItems="center">
            <Text color="primary" style={{ fontWeight: '700' }}>Buka Hari Ini</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" alignItems="center">
            <Text style={{ fontWeight: '700' }}>Kembali</Text>
          </Box>
        </Pressable>
      </Box>
    </ScrollView>
  );
}
