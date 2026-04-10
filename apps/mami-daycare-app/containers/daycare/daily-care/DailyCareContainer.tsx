import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Redirect, router } from 'expo-router';
import { DynamicForm, TextAreaField, TextField, type FormFieldProps } from '@mami/ui';
import { daycareActivityTextSchema } from '@mami/core';
import { HelperText } from 'react-native-paper';

import { useSession } from '../../../providers/session-provider';
import {
  checkInChildForToday,
  checkOutChildForToday,
  getDaycareRoster,
  getMyDaycareRegistration,
  getTodayDailyCare,
  getViewerProfile,
  logQuickDailyActivity,
  type DailyCareChildRecord,
  type ViewerProfile,
} from '../../../services/registration';
import { Box, Text } from '../../../theme/theme';

type Gate = 'loading' | 'approved' | 'pending';

type ActivityForm = {
  childId: string;
  category: 'MEAL' | 'NAP' | 'CARE' | 'PLAY' | 'LEARNING';
  activityName: string;
  description: string;
  startTime: string;
};

type ActivityTextForm = Pick<ActivityForm, 'activityName' | 'description' | 'startTime'>;

type AttendanceFilter = 'all' | 'needs_action' | 'done';

const initialForm: ActivityForm = {
  childId: '',
  category: 'PLAY',
  activityName: '',
  description: '',
  startTime: new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }),
};

function validateActivity(values: ActivityForm) {
  const errors: Partial<Record<keyof ActivityForm, string>> = {};
  if (!values.childId) errors.childId = 'Pilih child terlebih dahulu';
  if (!values.activityName.trim()) errors.activityName = 'Nama aktivitas wajib diisi';
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(values.startTime)) {
    errors.startTime = 'Gunakan format jam HH:mm';
  }
  return errors;
}

const activityFields: FormFieldProps<ActivityTextForm> = {
  activityName: {
    label: 'Nama Aktivitas',
    input: TextField,
    props: {
      placeholder: 'Contoh: Free play di indoor corner',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
  startTime: {
    label: 'Jam Mulai',
    input: TextField,
    props: {
      placeholder: 'HH:mm',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
  description: {
    label: 'Deskripsi Singkat',
    input: TextAreaField,
    props: {
      placeholder: 'Observasi singkat, mood, atau konteks tambahan',
      numberOfLines: 3,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
};

function formatTodayLabel() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function AttendanceCard(props: {
  childId: string;
  childName: string;
  record?: DailyCareChildRecord;
  onCheckIn: () => void;
  onCheckOut: () => void;
  busy: boolean;
}) {
  const status = props.record?.attendance?.status ?? 'ABSENT';
  const hasCheckIn = Boolean(props.record?.attendance?.checkIn);
  const hasCheckOut = Boolean(props.record?.attendance?.checkOut);
  const summary = !hasCheckIn
    ? 'Belum masuk'
    : hasCheckOut
      ? `Pulang ${props.record?.attendance?.checkOut?.time || ''}`.trim()
      : `Masuk ${props.record?.attendance?.checkIn?.time || ''}`.trim();
  const statusLabel = !hasCheckIn ? 'Perlu tindakan' : hasCheckOut ? 'Selesai' : 'Di daycare';

  const palette =
    status === 'PRESENT'
      ? { bg: '#E8F7EF', text: '#1F9D63' }
      : { bg: '#FDECEF', text: '#C6285A' };

  return (
    <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
      <Pressable onPress={() => router.push({ pathname: '/(daycare)/children/[id]', params: { id: props.childId } })}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text style={{ fontSize: 17, fontWeight: '700' }}>{props.childName}</Text>
          <Box style={{ backgroundColor: palette.bg }} borderRadius="md" padding="sm">
            <Text style={{ color: palette.text, fontWeight: '700', fontSize: 12 }}>{statusLabel}</Text>
          </Box>
        </Box>
      </Pressable>
      <Text color="textSecondary">{summary}</Text>
      <Box flexDirection="row" gap="sm">
        <Pressable disabled={props.busy || hasCheckIn} onPress={props.onCheckIn} style={{ flex: 1 }}>
          <Box
            backgroundColor={props.busy || hasCheckIn ? 'textSecondary' : 'primary'}
            borderRadius="lg"
            padding="md"
            alignItems="center">
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{hasCheckIn ? 'Sudah Masuk' : 'Masuk'}</Text>
          </Box>
        </Pressable>
        <Pressable disabled={props.busy || !hasCheckIn || hasCheckOut} onPress={props.onCheckOut} style={{ flex: 1 }}>
          <Box
            backgroundColor={props.busy || !hasCheckIn || hasCheckOut ? 'textSecondary' : 'primary'}
            borderRadius="lg"
            padding="md"
            alignItems="center">
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{hasCheckOut ? 'Sudah Pulang' : 'Pulang'}</Text>
          </Box>
        </Pressable>
      </Box>
    </Box>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Box flex={1} backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
      <Text color="textSecondary">{label}</Text>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>{value}</Text>
    </Box>
  );
}

export function DailyCareContainer() {
  const { isLoading, session } = useSession();
  const [gate, setGate] = useState<Gate>('loading');
  const [children, setChildren] = useState<Array<{ id: string; name: string }>>([]);
  const [recordChildren, setRecordChildren] = useState<DailyCareChildRecord[]>([]);
  const [viewer, setViewer] = useState<ViewerProfile | null>(null);
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>('all');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyChildId, setBusyChildId] = useState('');
  const [form, setForm] = useState<ActivityForm>(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activityErrors = useMemo(() => validateActivity(form), [form]);

  async function loadScreen(activeToken = session?.token, activeDaycareId = session?.daycareId) {
    if (!activeToken) {
      return;
    }

    const registration = await getMyDaycareRegistration(activeToken);
    if (!registration || registration.approvalStatus !== 'APPROVED') {
      setGate('pending');
      setChildren([]);
      setRecordChildren([]);
      return;
    }

    setGate('approved');
    const daycareId = activeDaycareId || registration.id;
    const [viewerProfile, roster, today] = await Promise.all([
      getViewerProfile(activeToken),
      getDaycareRoster(activeToken, daycareId),
      getTodayDailyCare(activeToken, daycareId),
    ]);

    setViewer(viewerProfile);
    const nextChildren = roster.children.map((child) => ({
      id: child.id,
      name: child.profile.name,
    }));
    setChildren(nextChildren);
    setRecordChildren(today?.children || []);
    setForm((current) => ({
      ...current,
      childId: current.childId || nextChildren[0]?.id || '',
    }));
  }

  useEffect(() => {
    async function run() {
      if (!session) {
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');
        await loadScreen();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat daily care.');
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [session]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const activeSession = session;

  if (!loading && gate === 'pending') {
    return <Redirect href="/(daycare)/registration-status" />;
  }

  const recordMap = new Map(recordChildren.map((child) => [child.childId, child]));

  async function handleCheckIn(childId: string) {
    if (!viewer) {
      return;
    }

    try {
      setBusyChildId(childId);
      setErrorMessage('');
      const daycareId = activeSession.daycareId || (await getMyDaycareRegistration(activeSession.token))?.id || '';
      const record = await checkInChildForToday(activeSession.token, daycareId, childId, viewer);
      setRecordChildren(record.children);
      setSuccessMessage('Check-in berhasil dicatat.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Check-in gagal.');
    } finally {
      setBusyChildId('');
    }
  }

  async function handleCheckOut(childId: string) {
    if (!viewer) {
      return;
    }

    try {
      setBusyChildId(childId);
      setErrorMessage('');
      const daycareId = activeSession.daycareId || (await getMyDaycareRegistration(activeSession.token))?.id || '';
      const record = await checkOutChildForToday(activeSession.token, daycareId, childId, viewer);
      setRecordChildren(record.children);
      setSuccessMessage('Check-out berhasil dicatat.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Check-out gagal.');
    } finally {
      setBusyChildId('');
    }
  }

  async function handleLogActivity(values: ActivityTextForm) {
    const nextErrors = validateActivity({ ...form, ...values });
    if (Object.keys(nextErrors).length > 0) {
      setErrorMessage('Lengkapi child, jam, dan nama aktivitas sebelum menyimpan.');
      setSuccessMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setForm((current) => ({ ...current, ...values }));
      const daycareId = activeSession.daycareId || (await getMyDaycareRegistration(activeSession.token))?.id || '';
      const record = await logQuickDailyActivity(activeSession.token, {
        daycareId,
        childId: form.childId,
        category: form.category,
        activityName: values.activityName,
        description: values.description,
        startTime: values.startTime,
      });
      setRecordChildren(record.children);
      setForm((current) => ({
        ...current,
        activityName: '',
        description: '',
      }));
      setShowActivityForm(false);
      setSuccessMessage('Aktivitas harian berhasil ditambahkan.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Aktivitas gagal ditambahkan.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const activityFeed = [...recordChildren]
    .flatMap((child) =>
      child.activities.map((activity) => ({
        childName: child.childName,
        activityName: activity.activityName,
        category: activity.category,
        startTime: activity.startTime,
        description: activity.description,
        loggedAt: activity.loggedAt,
      }))
    )
    .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
  const remainingChildren = children.filter((child) => !recordMap.get(child.id)?.attendance?.checkIn);
  const checkedInChildren = children.filter((child) => recordMap.get(child.id)?.attendance?.checkIn);
  const finishedChildren = checkedInChildren.filter((child) => recordMap.get(child.id)?.attendance?.checkOut);
  const activeChildren = checkedInChildren.filter((child) => !recordMap.get(child.id)?.attendance?.checkOut);
  const visibleChildren =
    attendanceFilter === 'needs_action'
      ? remainingChildren
      : attendanceFilter === 'done'
        ? finishedChildren
        : children;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF8F4' }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Box gap="xs">
        <Text style={{ fontSize: 28, fontWeight: '700' }}>Hari Ini</Text>
        <Text color="textSecondary">{formatTodayLabel()}</Text>
      </Box>

      <Box flexDirection="row" gap="md">
        <SummaryCard label="Child" value={children.length} />
        <SummaryCard label="Masuk" value={recordChildren.filter((child) => child.attendance?.checkIn).length} />
      </Box>

      {loading ? (
        <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
          <Text color="textSecondary">Memuat...</Text>
        </Box>
      ) : null}

      {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}
      {successMessage ? <HelperText type="info">{successMessage}</HelperText> : null}

      {!loading ? (
        <>
          <Box gap="md">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Absensi</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {([
                  { key: 'all', label: 'Semua' },
                  { key: 'needs_action', label: 'Tindakan' },
                  { key: 'done', label: 'Selesai' },
                ] as const).map((item) => {
                  const active = attendanceFilter === item.key;
                  return (
                    <Pressable key={item.key} onPress={() => setAttendanceFilter(item.key)}>
                      <Box
                        backgroundColor={active ? 'primary' : 'background'}
                        borderRadius="lg"
                        borderWidth={1}
                        borderColor={active ? 'primary' : 'border'}
                        paddingHorizontal="md"
                        paddingVertical="sm">
                        <Text style={{ color: active ? '#FFFFFF' : '#3D2218', fontWeight: '700', fontSize: 12 }}>{item.label}</Text>
                      </Box>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Box>

            {attendanceFilter === 'needs_action' && remainingChildren.length === 0 ? (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md">
                <Text color="textSecondary">Semua child sudah masuk hari ini.</Text>
              </Box>
            ) : null}

            {attendanceFilter === 'done' && finishedChildren.length === 0 ? (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md">
                <Text color="textSecondary">Belum ada child yang selesai hari ini.</Text>
              </Box>
            ) : null}

            {attendanceFilter === 'all' && children.length === 0 ? (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
                <Text color="textSecondary">Belum ada child aktif. Tambahkan dari roster keluarga dulu.</Text>
              </Box>
            ) : null}

            {visibleChildren.map((child) => (
              <AttendanceCard
                key={child.id}
                childId={child.id}
                childName={child.name}
                record={recordMap.get(child.id)}
                onCheckIn={() => void handleCheckIn(child.id)}
                onCheckOut={() => void handleCheckOut(child.id)}
                busy={busyChildId === child.id}
              />
            ))}
          </Box>

          <Box gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Ringkasan</Text>
            <Box flexDirection="row" gap="md">
              <SummaryCard label="Tindakan" value={remainingChildren.length} />
              <SummaryCard label="Di Daycare" value={activeChildren.length} />
              <SummaryCard label="Selesai" value={finishedChildren.length} />
            </Box>
          </Box>

          <Box gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Perlu Tindakan</Text>
            {remainingChildren.length === 0 ? (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md">
                <Text color="textSecondary">Tidak ada tindakan tersisa saat ini.</Text>
              </Box>
            ) : (
              remainingChildren.map((child) => (
                <AttendanceCard
                  key={child.id}
                  childId={child.id}
                  childName={child.name}
                  record={recordMap.get(child.id)}
                  onCheckIn={() => void handleCheckIn(child.id)}
                  onCheckOut={() => void handleCheckOut(child.id)}
                  busy={busyChildId === child.id}
                />
              ))
            )}
          </Box>

          <Box backgroundColor="surface" borderRadius="xl" borderWidth={1} borderColor="border" padding="lg" gap="md">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Catat Aktivitas</Text>
              <Pressable onPress={() => setShowActivityForm((current) => !current)}>
                <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" paddingHorizontal="md" paddingVertical="sm">
                  <Text style={{ fontWeight: '700' }}>{showActivityForm ? 'Tutup' : 'Buka'}</Text>
                </Box>
              </Pressable>
            </Box>

            {showActivityForm ? (
              <>
                <Box gap="xs">
                  <Text style={{ fontWeight: '600' }}>Pilih Child</Text>
                  <Box flexDirection="row" gap="sm" flexWrap="wrap">
                    {children.map((child) => {
                      const active = form.childId === child.id;
                      return (
                        <Pressable key={child.id} onPress={() => setForm((current) => ({ ...current, childId: child.id }))}>
                          <Box
                            backgroundColor={active ? 'primary' : 'background'}
                            borderRadius="lg"
                            borderWidth={1}
                            borderColor={active ? 'primary' : 'border'}
                            padding="md">
                            <Text style={{ color: active ? '#FFFFFF' : '#3D2218', fontWeight: '700' }}>{child.name}</Text>
                          </Box>
                        </Pressable>
                      );
                    })}
                  </Box>
                  {activityErrors.childId ? <Text color="danger">{activityErrors.childId}</Text> : null}
                </Box>

                <Box gap="xs">
                  <Text style={{ fontWeight: '600' }}>Kategori</Text>
                  <Box flexDirection="row" gap="sm" flexWrap="wrap">
                    {(['PLAY', 'MEAL', 'NAP', 'CARE', 'LEARNING'] as const).map((category) => {
                      const active = form.category === category;
                      return (
                        <Pressable key={category} onPress={() => setForm((current) => ({ ...current, category }))}>
                          <Box
                            backgroundColor={active ? 'primary' : 'background'}
                            borderRadius="lg"
                            borderWidth={1}
                            borderColor={active ? 'primary' : 'border'}
                            padding="md">
                            <Text style={{ color: active ? '#FFFFFF' : '#3D2218', fontWeight: '700' }}>{category}</Text>
                          </Box>
                        </Pressable>
                      );
                    })}
                  </Box>
                </Box>

                <DynamicForm<ActivityTextForm>
                  fields={activityFields}
                  defaultValue={{
                    activityName: form.activityName,
                    description: form.description,
                    startTime: form.startTime,
                  }}
                  schema={daycareActivityTextSchema}
                  submitLabel={isSubmitting ? 'Menyimpan Aktivitas...' : 'Simpan Aktivitas'}
                  loading={isSubmitting}
                  onSubmit={handleLogActivity}
                />
              </>
            ) : null}
          </Box>

          <Box gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Aktivitas</Text>
            {activityFeed.length === 0 ? (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
                <Text color="textSecondary">Belum ada aktivitas yang dicatat hari ini.</Text>
              </Box>
            ) : (
              activityFeed.map((item, index) => (
                <Box key={`${item.childName}-${item.activityName}-${index}`} backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.activityName}</Text>
                    <Text color="textSecondary">{item.startTime}</Text>
                  </Box>
                  <Text color="textSecondary">{item.childName}</Text>
                  <Text color="textSecondary">{item.category}</Text>
                  {item.description ? <Text>{item.description}</Text> : null}
                </Box>
              ))
            )}
          </Box>
        </>
      ) : null}

      <Pressable onPress={() => router.push('/(daycare)/operations')}>
        <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" alignItems="center">
          <Text color="primary" style={{ fontWeight: '700' }}>Kembali ke Roster Keluarga</Text>
        </Box>
      </Pressable>
    </ScrollView>
  );
}
