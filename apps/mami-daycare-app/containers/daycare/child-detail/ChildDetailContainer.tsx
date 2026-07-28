import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect } from 'expo-router';
import { FieldShell, TextAreaField, TextField, useToast } from '@mami/ui';

import { OverlaySelect, type OverlaySelectOption } from '../../../components/molecules/OverlaySelect';
import { SimpleDateInput } from '../../../components/molecules/SimpleDateInput';
import { useSession } from '../../../providers/session-provider';
import {
  getChildDailyRecords,
  getDaycareRoster,
  getTodayDailyCare,
  updateDaycareChildDetails,
  type DailyCareChildRecord,
  type DaycareChild,
  type DaycareParent,
} from '../../../services/operations';
import { Box, Text, useAppTheme } from '../../../theme/theme';

type ChildDetailContainerProps = {
  id: string;
};

type HistoryWindow = 7 | 14 | 30;
type DetailSection = 'profile' | 'health' | 'development' | 'preferences';
type DetailTab = DetailSection | 'today' | 'history';

type ChildDetailFormValue = {
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  notes: string;
  allergies: string;
  medicalNotes: string;
  medications: string;
  cognitiveNotes: string;
  developmentNotes: string;
  strengths: string;
  weaknesses: string;
  favoriteFoods: string;
  dislikedFoods: string;
  favoriteActivities: string;
  comfortItems: string;
  napRoutine: string;
};

type ChildDetailFormErrors = Partial<Record<'name' | 'birthDate' | 'gender' | 'submit', string>>;

const emptyDetailForm: ChildDetailFormValue = {
  name: '',
  birthDate: '',
  gender: 'MALE',
  notes: '',
  allergies: '',
  medicalNotes: '',
  medications: '',
  cognitiveNotes: '',
  developmentNotes: '',
  strengths: '',
  weaknesses: '',
  favoriteFoods: '',
  dislikedFoods: '',
  favoriteActivities: '',
  comfortItems: '',
  napRoutine: '',
};

const detailTabs: { value: DetailTab; label: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }[] = [
  { value: 'profile', label: 'Profil', icon: 'account-child' },
  { value: 'health', label: 'Kesehatan', icon: 'medical-bag' },
  { value: 'development', label: 'Perkembangan', icon: 'chart-timeline-variant' },
  { value: 'preferences', label: 'Preferensi', icon: 'heart-outline' },
  { value: 'today', label: 'Hari Ini', icon: 'calendar-today' },
  { value: 'history', label: 'Riwayat', icon: 'history' },
];

const genderOptions: OverlaySelectOption[] = [
  { label: 'Laki-laki', value: 'MALE' },
  { label: 'Perempuan', value: 'FEMALE' },
];

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

function birthDateToInput(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return [
    String(date.getUTCDate()).padStart(2, '0'),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCFullYear()).padStart(4, '0'),
  ].join('-');
}

function parseBirthDateInput(value: string) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return null;

  return {
    day: Number(match[1]),
    month: Number(match[2]),
    year: Number(match[3]),
  };
}

function birthDateInputToApiDate(value: string) {
  const parsed = parseBirthDateInput(value);
  if (!parsed) return value;

  return [
    String(parsed.year).padStart(4, '0'),
    String(parsed.month).padStart(2, '0'),
    String(parsed.day).padStart(2, '0'),
  ].join('-');
}

function isValidSimpleDate(value: string) {
  const parsed = parseBirthDateInput(value);
  if (!parsed) return false;

  const { day, month, year } = parsed;
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
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
    <Box flex={1} backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
      <Text color="textSecondary">{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: '700' }}>{value}</Text>
    </Box>
  );
}

function listValue(values?: string[] | null) {
  const cleaned = values?.map((item) => item.trim()).filter(Boolean) ?? [];
  return cleaned.length ? cleaned.join(', ') : '-';
}

function textValue(value?: string | null) {
  return value?.trim() || '-';
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box gap="xxs">
      <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: value === '-' ? '500' : '700' }}>{value}</Text>
    </Box>
  );
}

function SectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  const appTheme = useAppTheme();

  return (
    <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="md">
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{title}</Text>
      <Pressable onPress={onEdit}>
        <Box
          alignItems="center"
          backgroundColor="primary"
          borderRadius="md"
          flexDirection="row"
          gap="xs"
          paddingHorizontal="md"
          paddingVertical="sm">
          <MaterialCommunityIcons name="pencil" size={15} color={appTheme.colors.surface} />
          <Text style={{ color: appTheme.colors.surface, fontSize: 12, fontWeight: '800' }}>Edit</Text>
        </Box>
      </Pressable>
    </Box>
  );
}

function DetailTabs({ active, onChange }: { active: DetailTab; onChange: (tab: DetailTab) => void }) {
  const appTheme = useAppTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'flex-end', paddingLeft: 8 }}>
      {detailTabs.map((tab) => {
        const selected = active === tab.value;
        const foreground = selected ? appTheme.colors.primary : appTheme.colors.textSecondary;

        return (
          <Pressable key={tab.value} onPress={() => onChange(tab.value)}>
            <Box
              alignItems="center"
              backgroundColor={selected ? 'surface' : 'background'}
              borderColor="border"
              borderWidth={1}
              flexDirection="row"
              gap="xs"
              paddingHorizontal="md"
              paddingVertical="sm"
              style={{
                borderBottomColor: selected ? appTheme.colors.surface : appTheme.colors.border,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                marginBottom: -1,
                minWidth: 124,
              }}>
              <MaterialCommunityIcons name={tab.icon} size={16} color={foreground} />
              <Text style={{ color: foreground, fontSize: 12, fontWeight: '800' }}>{tab.label}</Text>
            </Box>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function joinList(values?: string[] | null) {
  return values?.filter(Boolean).join(', ') ?? '';
}

function splitList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinMedications(medications: DaycareChild['medical']['medications']) {
  return medications
    .map((medication) => [medication.name, medication.dosage, medication.schedule].filter(Boolean).join(' | '))
    .join('\n');
}

function splitMedications(value: string) {
  return value
    .split('\n')
    .map((line) => {
      const [name = '', dosage = '', schedule = ''] = line.split('|').map((part) => part.trim());
      return { name, dosage, schedule };
    })
    .filter((medication) => medication.name && medication.dosage && medication.schedule);
}

function formFromChild(child: DaycareChild): ChildDetailFormValue {
  return {
    name: child.profile.name,
    birthDate: birthDateToInput(child.profile.birthDate),
    gender: child.profile.gender,
    notes: child.customData.notes ?? '',
    allergies: joinList(child.medical.allergies),
    medicalNotes: child.medical.medicalNotes ?? '',
    medications: joinMedications(child.medical.medications),
    cognitiveNotes: child.customData.cognitiveNotes ?? '',
    developmentNotes: child.customData.developmentNotes ?? '',
    strengths: joinList(child.customData.strengths),
    weaknesses: joinList(child.customData.weaknesses),
    favoriteFoods: joinList(child.preferences.favoriteFoods),
    dislikedFoods: joinList(child.preferences.dislikedFoods),
    favoriteActivities: joinList(child.preferences.favoriteActivities),
    comfortItems: joinList(child.preferences.comfortItems),
    napRoutine: child.preferences.napRoutine ?? '',
  };
}

export function ChildDetailContainer({ id }: ChildDetailContainerProps) {
  const appTheme = useAppTheme();
  const { isLoading, session } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailFormVisible, setDetailFormVisible] = useState(false);
  const [activeDetailSection, setActiveDetailSection] = useState<DetailSection>('profile');
  const [activeTab, setActiveTab] = useState<DetailTab>('profile');
  const [detailForm, setDetailForm] = useState<ChildDetailFormValue>(emptyDetailForm);
  const [detailFormErrors, setDetailFormErrors] = useState<ChildDetailFormErrors>({});
  const [child, setChild] = useState<DaycareChild | null>(null);
  const [parent, setParent] = useState<DaycareParent | null>(null);
  const [todayRecord, setTodayRecord] = useState<DailyCareChildRecord | null>(null);
  const [history, setHistory] = useState<{ date: string; record: DailyCareChildRecord }[]>([]);
  const [historyWindow, setHistoryWindow] = useState<HistoryWindow>(7);
  const [error, setError] = useState('');
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    async function run() {
      if (!session) {
        return;
      }

      try {
        setLoading(true);
        setError('');
        setHistoryError('');

        if (!session.daycareId) {
          setError('daycareId belum tersedia di session.');
          return;
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (historyWindow - 1));
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const roster = await getDaycareRoster(session.token, session.daycareId);

        const selectedChild = roster.children.find((item) => item.id === id) ?? null;
        const selectedParent = selectedChild
          ? roster.parents.find((item) => item.id === selectedChild.parentId) ?? null
          : null;

        setChild(selectedChild);
        setParent(selectedParent);
        setTodayRecord(null);

        try {
          const dailyCare = await getTodayDailyCare(session.token, session.daycareId);
          const selectedRecord = dailyCare?.children.find((item) => item.childId === id) ?? null;
          setTodayRecord(selectedRecord);
        } catch (nextError) {
          setTodayRecord(null);
          setHistoryError(nextError instanceof Error ? nextError.message : 'Gagal memuat data harian.');
        }

        try {
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
        } catch (nextError) {
          setHistory([]);
          setHistoryError(nextError instanceof Error ? nextError.message : 'Gagal memuat riwayat harian.');
        }

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

  function openDetailForm(section: DetailSection) {
    if (!child) return;
    setActiveDetailSection(section);
    setDetailForm(formFromChild(child));
    setDetailFormErrors({});
    setDetailFormVisible(true);
  }

  function updateDetailForm<K extends keyof ChildDetailFormValue>(key: K, value: ChildDetailFormValue[K]) {
    setDetailForm((current) => ({ ...current, [key]: value }));
    setDetailFormErrors((current) => ({ ...current, [key]: undefined, submit: undefined }));
  }

  async function handleSaveDetails() {
    if (!session || !child) return;

    try {
      setSavingDetails(true);
      if (activeDetailSection === 'profile') {
        const nextErrors: ChildDetailFormErrors = {};
        if (!detailForm.name.trim()) nextErrors.name = 'Nama anak wajib diisi.';
        if (!detailForm.birthDate.trim()) nextErrors.birthDate = 'Tanggal lahir wajib diisi.';
        else if (!isValidSimpleDate(detailForm.birthDate)) nextErrors.birthDate = 'Tanggal lahir harus valid.';
        if (!detailForm.gender) nextErrors.gender = 'Jenis kelamin wajib dipilih.';

        if (Object.keys(nextErrors).length > 0) {
          setDetailFormErrors(nextErrors);
          return;
        }
      }

      const payload =
        activeDetailSection === 'profile'
          ? {
              profile: {
                name: detailForm.name.trim(),
                birthDate: birthDateInputToApiDate(detailForm.birthDate),
                gender: detailForm.gender,
              },
              customData: {
                notes: detailForm.notes.trim() || null,
                cognitiveNotes: child.customData.cognitiveNotes ?? null,
                developmentNotes: child.customData.developmentNotes ?? null,
                strengths: child.customData.strengths,
                weaknesses: child.customData.weaknesses,
              },
            }
          : activeDetailSection === 'health'
            ? {
                medical: {
                  allergies: splitList(detailForm.allergies),
                  medicalNotes: detailForm.medicalNotes.trim() || null,
                  medications: splitMedications(detailForm.medications),
                },
              }
            : activeDetailSection === 'development'
              ? {
                  customData: {
                    notes: child.customData.notes ?? null,
                    cognitiveNotes: detailForm.cognitiveNotes.trim() || null,
                    developmentNotes: detailForm.developmentNotes.trim() || null,
                    strengths: splitList(detailForm.strengths),
                    weaknesses: splitList(detailForm.weaknesses),
                  },
                }
              : {
                  preferences: {
                    favoriteFoods: splitList(detailForm.favoriteFoods),
                    dislikedFoods: splitList(detailForm.dislikedFoods),
                    favoriteActivities: splitList(detailForm.favoriteActivities),
                    comfortItems: splitList(detailForm.comfortItems),
                    napRoutine: detailForm.napRoutine.trim() || null,
                  },
                };
      const updated = await updateDaycareChildDetails(session.token, child.id, payload);
      setChild(updated);
      setDetailFormVisible(false);
      showToast({ message: 'Detail anak berhasil diperbarui.', tone: 'success' });
    } catch (nextError) {
      showToast({
        message: nextError instanceof Error ? nextError.message : 'Gagal memperbarui detail anak.',
        tone: 'danger',
      });
    } finally {
      setSavingDetails(false);
    }
  }

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: appTheme.colors.background }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Box gap="xs">
        <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="md">
          <Box flex={1} gap="xs">
            <Text style={{ fontSize: 28, fontWeight: '700' }}>{child?.profile.name || 'Child'}</Text>
            <Text color="textSecondary">{parent?.user.name || 'Parent belum terhubung'}</Text>
          </Box>
        </Box>
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
          <Box>
            <DetailTabs active={activeTab} onChange={setActiveTab} />
            <Box
              backgroundColor="surface"
              borderWidth={1}
              borderColor="border"
              padding="lg"
              gap="lg"
              style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>

          {activeTab === 'profile' ? (
          <Box gap="md">
            <SectionHeader title="Profil" onEdit={() => openDetailForm('profile')} />
            <Box flexDirection="row" gap="md">
              <Box flex={1} gap="md">
                <DetailRow label="Tanggal lahir" value={formatBirthDate(child.profile.birthDate)} />
                <DetailRow label="Jenis kelamin" value={child.profile.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'} />
              </Box>
              <Box flex={1} gap="md">
                <DetailRow label="Orang tua" value={parent?.user.name || '-'} />
                <DetailRow label="Telepon" value={parent?.user.phone || '-'} />
              </Box>
            </Box>
            <DetailRow label="Email orang tua" value={parent?.user.email || '-'} />
            <DetailRow label="Catatan umum" value={textValue(child.customData.notes)} />
          </Box>
          ) : null}

          {activeTab === 'health' ? (
          <Box gap="md">
            <SectionHeader title="Kesehatan & Riwayat Penyakit" onEdit={() => openDetailForm('health')} />
            <DetailRow label="Alergi" value={listValue(child.medical.allergies)} />
            <DetailRow label="Riwayat penyakit / catatan medis" value={textValue(child.medical.medicalNotes)} />
            <Box gap="xs">
              <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }}>Obat rutin</Text>
              {child.medical.medications.length ? (
                child.medical.medications.map((medication, index) => (
                  <Box key={`${medication.name}-${index}`} backgroundColor="background" borderRadius="md" padding="md" gap="xxs">
                    <Text style={{ fontWeight: '700' }}>{medication.name}</Text>
                    <Text color="textSecondary">{medication.dosage} · {medication.schedule}</Text>
                  </Box>
                ))
              ) : (
                <Text>-</Text>
              )}
            </Box>
          </Box>
          ) : null}

          {activeTab === 'development' ? (
          <Box gap="md">
            <SectionHeader title="Perkembangan Anak" onEdit={() => openDetailForm('development')} />
            <DetailRow label="Kognitif" value={textValue(child.customData.cognitiveNotes)} />
            <DetailRow label="Tumbuh kembang / kesulitan" value={textValue(child.customData.developmentNotes)} />
            <DetailRow label="Keahlian / kelebihan" value={listValue(child.customData.strengths)} />
            <DetailRow label="Kekurangan / hal yang perlu didampingi" value={listValue(child.customData.weaknesses)} />
          </Box>
          ) : null}

          {activeTab === 'preferences' ? (
          <Box gap="md">
            <SectionHeader title="Preferensi & Kebiasaan" onEdit={() => openDetailForm('preferences')} />
            <DetailRow label="Makanan favorit" value={listValue(child.preferences.favoriteFoods)} />
            <DetailRow label="Makanan tidak disukai" value={listValue(child.preferences.dislikedFoods)} />
            <DetailRow label="Aktivitas favorit" value={listValue(child.preferences.favoriteActivities)} />
            <DetailRow label="Comfort item" value={listValue(child.preferences.comfortItems)} />
            <DetailRow label="Rutinitas tidur" value={textValue(child.preferences.napRoutine)} />
          </Box>
          ) : null}

          {activeTab === 'today' ? (
          <>
          <Box gap="sm">
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
                <Box key={`${activity.activityName}-${index}`} backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text style={{ fontWeight: '700' }}>{activity.activityName}</Text>
                    <Text color="textSecondary">{formatActivityTime(activity.startTime)}</Text>
                  </Box>
                  <Text color="textSecondary">{activity.category}</Text>
                  {activity.description ? <Text>{activity.description}</Text> : null}
                </Box>
              ))
            ) : (
              <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
                <Text color="textSecondary">Belum ada aktivitas yang dicatat hari ini.</Text>
              </Box>
            )}
          </Box>
          </>
          ) : null}

          {activeTab === 'history' ? (
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
                        <Text style={{ color: active ? appTheme.colors.onPrimary : appTheme.colors.textPrimary, fontWeight: '700', fontSize: 12 }}>
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
                  <Box key={item.date} backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
                    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text style={{ fontWeight: '700' }}>{formatSectionDate(item.date)}</Text>
                      <Text color="textSecondary">{activityCount} aktivitas</Text>
                    </Box>
                    <Text color="textSecondary">{attendance}</Text>
                    {item.record.notes ? <Text>{item.record.notes}</Text> : null}
                  </Box>
                );
              })
            ) : historyError ? (
              <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="xs">
                <Text color="danger" style={{ fontWeight: '700' }}>Riwayat belum bisa dimuat</Text>
                <Text color="textSecondary">{historyError}</Text>
              </Box>
            ) : (
              <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
                <Text color="textSecondary">Belum ada riwayat harian yang tersimpan.</Text>
              </Box>
            )}
          </Box>
          ) : null}
          </Box>
          </Box>
        </>
      ) : null}

      <ChildDetailFormModal
        visible={detailFormVisible}
        section={activeDetailSection}
        saving={savingDetails}
        value={detailForm}
        errors={detailFormErrors}
        onChange={updateDetailForm}
        onClose={() => setDetailFormVisible(false)}
        onSubmit={handleSaveDetails}
      />
    </ScrollView>
  );
}

type ChildDetailFormModalProps = {
  visible: boolean;
  section: DetailSection;
  saving: boolean;
  value: ChildDetailFormValue;
  errors: ChildDetailFormErrors;
  onChange: <K extends keyof ChildDetailFormValue>(key: K, value: ChildDetailFormValue[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function ChildDetailFormModal({
  visible,
  section,
  saving,
  value,
  errors,
  onChange,
  onClose,
  onSubmit,
}: ChildDetailFormModalProps) {
  const appTheme = useAppTheme();
  const titleBySection: Record<DetailSection, string> = {
    profile: 'Edit Profil',
    health: 'Edit Kesehatan',
    development: 'Edit Perkembangan',
    preferences: 'Edit Preferensi',
  };
  const inputBackgroundColor = appTheme.colors.surface;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ alignItems: 'center', backgroundColor: appTheme.colors.backdrop, flex: 1, justifyContent: 'center', padding: 24 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }} />
        <View style={{ backgroundColor: appTheme.colors.surface, borderColor: appTheme.colors.border, borderRadius: 8, borderWidth: 1, maxHeight: '88%', maxWidth: 760, padding: 18, width: '100%' }}>
          <Box gap="md">
            <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="md">
              <Box flex={1} gap="xxs">
                <Text style={{ color: appTheme.colors.textPrimary, fontSize: 20, fontWeight: '900', lineHeight: 26 }}>{titleBySection[section]}</Text>
                <Text color="textSecondary">Isi informasi yang dipakai daycare untuk memahami kebutuhan anak.</Text>
              </Box>
              <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose}>
                <Box alignItems="center" borderRadius="md" borderWidth={1} borderColor="border" justifyContent="center" style={{ height: 38, width: 38 }}>
                  <MaterialCommunityIcons name="close" size={22} color={appTheme.colors.textSecondary} />
                </Box>
              </Pressable>
            </Box>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 2 }}>
              {section === 'profile' ? (
                <Box gap="sm">
                  <FieldShell label="Nama anak" required error={errors.name}>
                    <TextField value={value.name} disabled={saving} placeholder="Nama anak" backgroundColor={inputBackgroundColor} borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('name', next)} />
                  </FieldShell>
                  <FieldShell label="Tanggal lahir" required error={errors.birthDate}>
                    <SimpleDateInput value={value.birthDate} disabled={saving} error={errors.birthDate} onChange={(next) => onChange('birthDate', next)} />
                  </FieldShell>
                  <FieldShell label="Jenis kelamin" required error={errors.gender} style={{ elevation: 20, position: 'relative', zIndex: 200 }}>
                    <OverlaySelect
                      value={value.gender}
                      placeholder="Pilih jenis kelamin"
                      options={genderOptions}
                      onChange={(next) => onChange('gender', next as ChildDetailFormValue['gender'])}
                    />
                  </FieldShell>
                  <FieldShell label="Catatan umum">
                    <TextAreaField value={value.notes} disabled={saving} placeholder="Catatan umum tentang anak" backgroundColor={inputBackgroundColor} borderRadius={8} numberOfLines={4} useBottomSheetInput={false} onChange={(next) => onChange('notes', next)} />
                  </FieldShell>
                </Box>
              ) : null}

              {section === 'health' ? (
                <Box gap="sm">
                <FieldShell label="Alergi">
                  <TextField value={value.allergies} disabled={saving} placeholder="Contoh: susu sapi, kacang" backgroundColor={inputBackgroundColor} borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('allergies', next)} />
                </FieldShell>
                <FieldShell label="Riwayat penyakit / catatan medis">
                  <TextAreaField value={value.medicalNotes} disabled={saving} placeholder="Contoh: asma ringan, pernah demam kejang" backgroundColor={inputBackgroundColor} borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('medicalNotes', next)} />
                </FieldShell>
                <FieldShell label="Obat rutin">
                  <TextAreaField value={value.medications} disabled={saving} placeholder={'Satu obat per baris. Contoh:\nVitamin D | 1 tetes | Pagi'} backgroundColor={inputBackgroundColor} borderRadius={8} numberOfLines={4} useBottomSheetInput={false} onChange={(next) => onChange('medications', next)} />
                </FieldShell>
                </Box>
              ) : null}

              {section === 'development' ? (
                <Box gap="sm">
                <FieldShell label="Kognitif">
                  <TextAreaField value={value.cognitiveNotes} disabled={saving} placeholder="Cara anak belajar, fokus, memahami instruksi" backgroundColor={inputBackgroundColor} borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('cognitiveNotes', next)} />
                </FieldShell>
                <FieldShell label="Tumbuh kembang / kesulitan">
                  <TextAreaField value={value.developmentNotes} disabled={saving} placeholder="Kesulitan bicara, motorik, sosial, adaptasi, dll" backgroundColor={inputBackgroundColor} borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('developmentNotes', next)} />
                </FieldShell>
                <FieldShell label="Keahlian / kelebihan">
                  <TextField value={value.strengths} disabled={saving} placeholder="Contoh: menggambar, berhitung, cepat bergaul" backgroundColor={inputBackgroundColor} borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('strengths', next)} />
                </FieldShell>
                <FieldShell label="Kekurangan / perlu didampingi">
                  <TextField value={value.weaknesses} disabled={saving} placeholder="Contoh: sulit berbagi, perlu bantuan makan" backgroundColor={inputBackgroundColor} borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('weaknesses', next)} />
                </FieldShell>
                </Box>
              ) : null}

              {section === 'preferences' ? (
                <Box gap="sm">
                <FieldShell label="Makanan favorit">
                  <TextField value={value.favoriteFoods} disabled={saving} placeholder="Contoh: pisang, nasi ayam" backgroundColor={inputBackgroundColor} borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('favoriteFoods', next)} />
                </FieldShell>
                <FieldShell label="Makanan tidak disukai">
                  <TextField value={value.dislikedFoods} disabled={saving} placeholder="Contoh: brokoli, ikan pedas" backgroundColor={inputBackgroundColor} borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('dislikedFoods', next)} />
                </FieldShell>
                <FieldShell label="Aktivitas favorit">
                  <TextField value={value.favoriteActivities} disabled={saving} placeholder="Contoh: puzzle, membaca buku" backgroundColor={inputBackgroundColor} borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('favoriteActivities', next)} />
                </FieldShell>
                <FieldShell label="Comfort item">
                  <TextField value={value.comfortItems} disabled={saving} placeholder="Contoh: boneka, selimut" backgroundColor={inputBackgroundColor} borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('comfortItems', next)} />
                </FieldShell>
                <FieldShell label="Rutinitas tidur">
                  <TextAreaField value={value.napRoutine} disabled={saving} placeholder="Contoh: perlu dibacakan cerita sebelum tidur" backgroundColor={inputBackgroundColor} borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('napRoutine', next)} />
                </FieldShell>
                </Box>
              ) : null}

              <Box flexDirection="row" gap="sm" justifyContent="flex-end">
                <Pressable disabled={saving} onPress={onClose}>
                  <Box borderRadius="md" borderWidth={1} borderColor="border" paddingHorizontal="lg" paddingVertical="md">
                    <Text style={{ fontWeight: '700' }}>Batal</Text>
                  </Box>
                </Pressable>
                <Pressable disabled={saving} onPress={onSubmit}>
                  <Box backgroundColor="primary" borderRadius="md" paddingHorizontal="lg" paddingVertical="md">
                    <Text style={{ color: appTheme.colors.onPrimary, fontWeight: '700' }}>{saving ? 'Menyimpan...' : 'Simpan'}</Text>
                  </Box>
                </Pressable>
              </Box>
            </ScrollView>
          </Box>
        </View>
      </View>
    </Modal>
  );
}
