import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { FieldShell, TextAreaField, TextField, useToast } from '@mami/ui';

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
import { Box, Text } from '../../../theme/theme';

type ChildDetailContainerProps = {
  id: string;
};

type HistoryWindow = 7 | 14 | 30;

type ChildDetailFormValue = {
  notes: string;
  allergies: string;
  medicalNotes: string;
  cognitiveNotes: string;
  developmentNotes: string;
  strengths: string;
  weaknesses: string;
  favoriteFoods: string;
  favoriteActivities: string;
  comfortItems: string;
  napRoutine: string;
};

const emptyDetailForm: ChildDetailFormValue = {
  notes: '',
  allergies: '',
  medicalNotes: '',
  cognitiveNotes: '',
  developmentNotes: '',
  strengths: '',
  weaknesses: '',
  favoriteFoods: '',
  favoriteActivities: '',
  comfortItems: '',
  napRoutine: '',
};

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

function joinList(values?: string[] | null) {
  return values?.filter(Boolean).join(', ') ?? '';
}

function splitList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formFromChild(child: DaycareChild): ChildDetailFormValue {
  return {
    notes: child.customData.notes ?? '',
    allergies: joinList(child.medical.allergies),
    medicalNotes: child.medical.medicalNotes ?? '',
    cognitiveNotes: child.customData.cognitiveNotes ?? '',
    developmentNotes: child.customData.developmentNotes ?? '',
    strengths: joinList(child.customData.strengths),
    weaknesses: joinList(child.customData.weaknesses),
    favoriteFoods: joinList(child.preferences.favoriteFoods),
    favoriteActivities: joinList(child.preferences.favoriteActivities),
    comfortItems: joinList(child.preferences.comfortItems),
    napRoutine: child.preferences.napRoutine ?? '',
  };
}

export function ChildDetailContainer({ id }: ChildDetailContainerProps) {
  const { isLoading, session } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailFormVisible, setDetailFormVisible] = useState(false);
  const [detailForm, setDetailForm] = useState<ChildDetailFormValue>(emptyDetailForm);
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

        const [roster, dailyCare] = await Promise.all([
          getDaycareRoster(session.token, session.daycareId),
          getTodayDailyCare(session.token, session.daycareId),
        ]);

        const selectedChild = roster.children.find((item) => item.id === id) ?? null;
        const selectedParent = selectedChild
          ? roster.parents.find((item) => item.id === selectedChild.parentId) ?? null
          : null;
        const selectedRecord = dailyCare?.children.find((item) => item.childId === id) ?? null;

        setChild(selectedChild);
        setParent(selectedParent);
        setTodayRecord(selectedRecord);

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

  function openDetailForm() {
    if (!child) return;
    setDetailForm(formFromChild(child));
    setDetailFormVisible(true);
  }

  function updateDetailForm<K extends keyof ChildDetailFormValue>(key: K, value: ChildDetailFormValue[K]) {
    setDetailForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSaveDetails() {
    if (!session || !child) return;

    try {
      setSavingDetails(true);
      const updated = await updateDaycareChildDetails(session.token, child.id, {
        medical: {
          allergies: splitList(detailForm.allergies),
          medicalNotes: detailForm.medicalNotes.trim() || null,
          medications: child.medical.medications,
        },
        preferences: {
          favoriteFoods: splitList(detailForm.favoriteFoods),
          favoriteActivities: splitList(detailForm.favoriteActivities),
          comfortItems: splitList(detailForm.comfortItems),
          napRoutine: detailForm.napRoutine.trim() || null,
        },
        customData: {
          notes: detailForm.notes.trim() || null,
          cognitiveNotes: detailForm.cognitiveNotes.trim() || null,
          developmentNotes: detailForm.developmentNotes.trim() || null,
          strengths: splitList(detailForm.strengths),
          weaknesses: splitList(detailForm.weaknesses),
        },
      });
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
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF8F4' }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Box gap="xs">
        <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="md">
          <Box flex={1} gap="xs">
            <Text style={{ fontSize: 28, fontWeight: '700' }}>{child?.profile.name || 'Child'}</Text>
            <Text color="textSecondary">{parent?.user.name || 'Parent belum terhubung'}</Text>
          </Box>
          {child ? (
            <Pressable onPress={openDetailForm}>
              <Box backgroundColor="primary" borderRadius="lg" paddingHorizontal="md" paddingVertical="sm">
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Edit Detail</Text>
              </Box>
            </Pressable>
          ) : null}
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
          <Box flexDirection="row" gap="md">
            <SummaryCard label="Lahir" value={formatBirthDate(child.profile.birthDate)} />
            <SummaryCard label="Gender" value={child.profile.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'} />
          </Box>

          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="sm">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Profil</Text>
            <DetailRow label="Orang tua" value={parent?.user.name || '-'} />
            <DetailRow label="Email" value={parent?.user.email || '-'} />
            <DetailRow label="Telepon" value={parent?.user.phone || '-'} />
            {child.customData.notes ? <Text color="textSecondary">{child.customData.notes}</Text> : null}
          </Box>

          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Kesehatan & Riwayat Penyakit</Text>
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

          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Perkembangan Anak</Text>
            <DetailRow label="Kognitif" value={textValue(child.customData.cognitiveNotes)} />
            <DetailRow label="Tumbuh kembang / kesulitan" value={textValue(child.customData.developmentNotes)} />
            <DetailRow label="Keahlian / kelebihan" value={listValue(child.customData.strengths)} />
            <DetailRow label="Kekurangan / hal yang perlu didampingi" value={listValue(child.customData.weaknesses)} />
          </Box>

          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Preferensi & Kebiasaan</Text>
            <DetailRow label="Makanan favorit" value={listValue(child.preferences.favoriteFoods)} />
            <DetailRow label="Aktivitas favorit" value={listValue(child.preferences.favoriteActivities)} />
            <DetailRow label="Comfort item" value={listValue(child.preferences.comfortItems)} />
            <DetailRow label="Rutinitas tidur" value={textValue(child.preferences.napRoutine)} />
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
            ) : historyError ? (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="xs">
                <Text color="danger" style={{ fontWeight: '700' }}>Riwayat belum bisa dimuat</Text>
                <Text color="textSecondary">{historyError}</Text>
              </Box>
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

      <ChildDetailFormModal
        visible={detailFormVisible}
        saving={savingDetails}
        value={detailForm}
        onChange={updateDetailForm}
        onClose={() => setDetailFormVisible(false)}
        onSubmit={handleSaveDetails}
      />
    </ScrollView>
  );
}

type ChildDetailFormModalProps = {
  visible: boolean;
  saving: boolean;
  value: ChildDetailFormValue;
  onChange: <K extends keyof ChildDetailFormValue>(key: K, value: ChildDetailFormValue[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function ChildDetailFormModal({
  visible,
  saving,
  value,
  onChange,
  onClose,
  onSubmit,
}: ChildDetailFormModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.42)', flex: 1, justifyContent: 'center', padding: 24 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }} />
        <View style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: 8, borderWidth: 1, maxHeight: '88%', maxWidth: 760, padding: 18, width: '100%' }}>
          <Box gap="md">
            <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="md">
              <Box flex={1} gap="xxs">
                <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900', lineHeight: 26 }}>Edit Detail Anak</Text>
                <Text color="textSecondary">Isi informasi yang dipakai daycare untuk memahami kebutuhan anak.</Text>
              </Box>
              <Pressable onPress={onClose}>
                <Box borderRadius="md" borderWidth={1} borderColor="border" paddingHorizontal="md" paddingVertical="sm">
                  <Text style={{ fontWeight: '700' }}>Tutup</Text>
                </Box>
              </Pressable>
            </Box>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 2 }}>
              <FieldShell label="Catatan umum">
                <TextAreaField value={value.notes} disabled={saving} placeholder="Catatan umum tentang anak" backgroundColor="#FFFFFF" borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('notes', next)} />
              </FieldShell>

              <Box gap="sm">
                <Text style={{ fontSize: 16, fontWeight: '800' }}>Kesehatan</Text>
                <FieldShell label="Alergi">
                  <TextField value={value.allergies} disabled={saving} placeholder="Contoh: susu sapi, kacang" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('allergies', next)} />
                </FieldShell>
                <FieldShell label="Riwayat penyakit / catatan medis">
                  <TextAreaField value={value.medicalNotes} disabled={saving} placeholder="Contoh: asma ringan, pernah demam kejang" backgroundColor="#FFFFFF" borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('medicalNotes', next)} />
                </FieldShell>
              </Box>

              <Box gap="sm">
                <Text style={{ fontSize: 16, fontWeight: '800' }}>Perkembangan</Text>
                <FieldShell label="Kognitif">
                  <TextAreaField value={value.cognitiveNotes} disabled={saving} placeholder="Cara anak belajar, fokus, memahami instruksi" backgroundColor="#FFFFFF" borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('cognitiveNotes', next)} />
                </FieldShell>
                <FieldShell label="Tumbuh kembang / kesulitan">
                  <TextAreaField value={value.developmentNotes} disabled={saving} placeholder="Kesulitan bicara, motorik, sosial, adaptasi, dll" backgroundColor="#FFFFFF" borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('developmentNotes', next)} />
                </FieldShell>
                <FieldShell label="Keahlian / kelebihan">
                  <TextField value={value.strengths} disabled={saving} placeholder="Contoh: menggambar, berhitung, cepat bergaul" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('strengths', next)} />
                </FieldShell>
                <FieldShell label="Kekurangan / perlu didampingi">
                  <TextField value={value.weaknesses} disabled={saving} placeholder="Contoh: sulit berbagi, perlu bantuan makan" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('weaknesses', next)} />
                </FieldShell>
              </Box>

              <Box gap="sm">
                <Text style={{ fontSize: 16, fontWeight: '800' }}>Preferensi & Kebiasaan</Text>
                <FieldShell label="Makanan favorit">
                  <TextField value={value.favoriteFoods} disabled={saving} placeholder="Contoh: pisang, nasi ayam" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('favoriteFoods', next)} />
                </FieldShell>
                <FieldShell label="Aktivitas favorit">
                  <TextField value={value.favoriteActivities} disabled={saving} placeholder="Contoh: puzzle, membaca buku" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('favoriteActivities', next)} />
                </FieldShell>
                <FieldShell label="Comfort item">
                  <TextField value={value.comfortItems} disabled={saving} placeholder="Contoh: boneka, selimut" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('comfortItems', next)} />
                </FieldShell>
                <FieldShell label="Rutinitas tidur">
                  <TextAreaField value={value.napRoutine} disabled={saving} placeholder="Contoh: perlu dibacakan cerita sebelum tidur" backgroundColor="#FFFFFF" borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('napRoutine', next)} />
                </FieldShell>
              </Box>

              <Box flexDirection="row" gap="sm" justifyContent="flex-end">
                <Pressable disabled={saving} onPress={onClose}>
                  <Box borderRadius="md" borderWidth={1} borderColor="border" paddingHorizontal="lg" paddingVertical="md">
                    <Text style={{ fontWeight: '700' }}>Batal</Text>
                  </Box>
                </Pressable>
                <Pressable disabled={saving} onPress={onSubmit}>
                  <Box backgroundColor="primary" borderRadius="md" paddingHorizontal="lg" paddingVertical="md">
                    <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{saving ? 'Menyimpan...' : 'Simpan'}</Text>
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
