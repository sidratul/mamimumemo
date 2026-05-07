import { useEffect, useMemo, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ScrollView } from 'react-native';
import { Button, Checkbox, HelperText } from 'react-native-paper';
import { ScreenHeader, ScreenSection, SelectInput, TextField, type SelectOption } from '@mami/ui';

import { useSession } from '../../../providers/session-provider';
import {
  createScheduleTemplate,
  listMasterActivities,
  type MasterActivity,
  type ScheduleTemplateTargetType,
} from '../../../services/operations/schedule-planning';
import { Box, Text } from '../../../theme/theme';

type TemplateActivityDraft = {
  masterActivityId: string;
  activityName: string;
  category: MasterActivity['category'];
  duration?: number;
  startTime: string;
  endTime: string;
};

const targetTypeOptions: SelectOption[] = [
  { label: 'Harian default', value: 'DAY_OF_WEEK' },
  { label: 'Rentang tanggal', value: 'DATE_RANGE' },
  { label: 'Tanggal tertentu', value: 'SPECIFIC_DATE' },
];

const dayOptions = [
  { label: 'Min', value: 0 },
  { label: 'Sen', value: 1 },
  { label: 'Sel', value: 2 },
  { label: 'Rab', value: 3 },
  { label: 'Kam', value: 4 },
  { label: 'Jum', value: 5 },
  { label: 'Sab', value: 6 },
];

function getCategoryLabel(category: MasterActivity['category']) {
  switch (category) {
    case 'MEAL':
      return 'Makan';
    case 'NAP':
      return 'Tidur';
    case 'CARE':
      return 'Perawatan';
    case 'PLAY':
      return 'Main';
    case 'LEARNING':
      return 'Belajar';
    default:
      return category;
  }
}

export function DaycareTemplateContainer() {
  const { isLoading, session } = useSession();
  const [activities, setActivities] = useState<MasterActivity[]>([]);
  const [screenLoading, setScreenLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [targetType, setTargetType] = useState<ScheduleTemplateTargetType>('DAY_OF_WEEK');
  const [dayOfWeek, setDayOfWeek] = useState<number[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specificDate, setSpecificDate] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<TemplateActivityDraft[]>([]);

  useEffect(() => {
    async function run() {
      if (!session?.daycareId) {
        return;
      }

      try {
        setScreenLoading(true);
        setError('');
        const data = await listMasterActivities(session.token, session.daycareId, true);
        setActivities(data);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Gagal memuat activity daycare.');
      } finally {
        setScreenLoading(false);
      }
    }

    void run();
  }, [session?.daycareId, session?.token]);

  const selectedMap = useMemo(
    () => new Map(selectedActivities.map((item) => [item.masterActivityId, item])),
    [selectedActivities]
  );

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const activeSession = session;

  function toggleActivity(activity: MasterActivity) {
    if (selectedMap.has(activity.id)) {
      setSelectedActivities((current) => current.filter((item) => item.masterActivityId !== activity.id));
      return;
    }

    setSelectedActivities((current) => [
      ...current,
      {
        masterActivityId: activity.id,
        activityName: activity.name,
        category: activity.category,
        duration: activity.defaultDuration,
        startTime: '',
        endTime: '',
      },
    ]);
  }

  function updateSelectedActivity(masterActivityId: string, key: 'startTime' | 'endTime', value: string) {
    setSelectedActivities((current) =>
      current.map((item) => (item.masterActivityId === masterActivityId ? { ...item, [key]: value } : item))
    );
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Nama template wajib diisi.');
      return;
    }

    if (selectedActivities.length === 0) {
      setError('Pilih minimal satu activity.');
      return;
    }

    if (selectedActivities.some((item) => !item.startTime.trim() || !item.endTime.trim())) {
      setError('Lengkapi jam mulai dan jam selesai untuk semua activity terpilih.');
      return;
    }

    if (targetType === 'DAY_OF_WEEK' && dayOfWeek.length === 0) {
      setError('Pilih minimal satu hari untuk template default.');
      return;
    }

    if (targetType === 'DATE_RANGE' && (!startDate || !endDate)) {
      setError('Tanggal mulai dan selesai wajib diisi.');
      return;
    }

    if (targetType === 'SPECIFIC_DATE' && !specificDate) {
      setError('Tanggal spesifik wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await createScheduleTemplate(activeSession.token, {
        daycareId: activeSession.daycareId,
        name: name.trim(),
        targetType,
        dayOfWeek: targetType === 'DAY_OF_WEEK' ? dayOfWeek : undefined,
        startDate: targetType === 'DATE_RANGE' ? startDate : undefined,
        endDate: targetType === 'DATE_RANGE' ? endDate : undefined,
        specificDate: targetType === 'SPECIFIC_DATE' ? specificDate : undefined,
        activities: selectedActivities.map((item) => ({
          masterActivityId: item.masterActivityId,
          activityName: item.activityName,
          category: item.category,
          startTime: item.startTime,
          endTime: item.endTime,
          duration: item.duration,
          defaultSitterRole: 'ANY',
        })),
      });

      router.back();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal membuat template.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <ScreenHeader title="Buat Template" subtitle="Pilih activity yang akan menjadi pola harian." onBack={() => router.back()} />

        <ScreenSection>
          <TextField value={name} placeholder="Nama template" onChange={setName} backgroundColor="#FFFFFF" borderRadius={14} />
          <SelectInput
            value={targetType}
            placeholder="Pilih target template"
            options={targetTypeOptions}
            title="Target Template"
            onChange={(value) => setTargetType(value as ScheduleTemplateTargetType)}
          />

          {targetType === 'DAY_OF_WEEK' ? (
            <Box flexDirection="row" flexWrap="wrap" gap="sm">
              {dayOptions.map((option) => {
                const checked = dayOfWeek.includes(option.value);
                return (
                  <Button
                    key={option.value}
                    mode={checked ? 'contained' : 'outlined'}
                    compact
                    onPress={() =>
                      setDayOfWeek((current) =>
                        checked ? current.filter((item) => item !== option.value) : [...current, option.value]
                      )
                    }>
                    {option.label}
                  </Button>
                );
              })}
            </Box>
          ) : null}

          {targetType === 'DATE_RANGE' ? (
            <Box gap="sm">
              <TextField value={startDate} placeholder="Tanggal mulai (YYYY-MM-DD)" onChange={setStartDate} backgroundColor="#FFFFFF" borderRadius={14} />
              <TextField value={endDate} placeholder="Tanggal selesai (YYYY-MM-DD)" onChange={setEndDate} backgroundColor="#FFFFFF" borderRadius={14} />
            </Box>
          ) : null}

          {targetType === 'SPECIFIC_DATE' ? (
            <TextField value={specificDate} placeholder="Tanggal spesifik (YYYY-MM-DD)" onChange={setSpecificDate} backgroundColor="#FFFFFF" borderRadius={14} />
          ) : null}
        </ScreenSection>

        <ScreenSection>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>Pilih Activity</Text>

          {screenLoading ? <Text color="textSecondary">Memuat activity...</Text> : null}
          {!screenLoading && activities.length === 0 ? <Text color="textSecondary">Belum ada master activity aktif untuk daycare ini.</Text> : null}

          <Box gap="sm">
            {activities.map((activity) => {
              const selected = selectedMap.get(activity.id);

              return (
                <Box
                  key={activity.id}
                  padding="md"
                  gap="sm"
                  style={{ borderWidth: 1, borderColor: '#F0D5C9', borderRadius: 14, backgroundColor: '#FFFFFF' }}>
                  <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="sm">
                    <Box flex={1}>
                      <Text style={{ fontWeight: '700', color: '#3D2218' }}>{activity.name}</Text>
                      <Text color="textSecondary">
                        {getCategoryLabel(activity.category)} · {activity.defaultDuration} menit
                      </Text>
                    </Box>
                    <Checkbox status={selected ? 'checked' : 'unchecked'} onPress={() => toggleActivity(activity)} />
                  </Box>

                  {selected ? (
                    <Box gap="sm">
                      <TextField
                        value={selected.startTime}
                        placeholder="Jam mulai (HH:mm)"
                        onChange={(value) => updateSelectedActivity(activity.id, 'startTime', value)}
                        backgroundColor="#FFFFFF"
                        borderRadius={14}
                      />
                      <TextField
                        value={selected.endTime}
                        placeholder="Jam selesai (HH:mm)"
                        onChange={(value) => updateSelectedActivity(activity.id, 'endTime', value)}
                        backgroundColor="#FFFFFF"
                        borderRadius={14}
                      />
                    </Box>
                  ) : null}
                </Box>
              );
            })}
          </Box>

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button mode="contained" onPress={() => void handleSubmit()} loading={loading} disabled={loading}>
            Simpan Template
          </Button>
        </ScreenSection>
      </ScrollView>
    </Box>
  );
}
