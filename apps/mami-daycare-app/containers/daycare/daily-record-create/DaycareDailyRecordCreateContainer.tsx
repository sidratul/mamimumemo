import { useEffect, useMemo, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ScrollView } from 'react-native';
import { Button, HelperText } from 'react-native-paper';
import { ScreenHeader, ScreenSection, SelectInput, TextField, type SelectOption } from '@mami/ui';

import { useSession } from '../../../providers/session-provider';
import {
  applyScheduleTemplateForDate,
  listScheduleTemplates,
  type ScheduleTemplate,
} from '../../../services/operations/schedule-planning';
import { Box, Text } from '../../../theme/theme';

function matchesTemplateDate(template: ScheduleTemplate, date: string) {
  if (!date) return true;

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (template.targetType === 'SPECIFIC_DATE' && template.specificDate) {
    const specific = new Date(template.specificDate);
    specific.setHours(0, 0, 0, 0);
    return specific.getTime() === targetDate.getTime();
  }

  if (template.targetType === 'DATE_RANGE' && template.startDate && template.endDate) {
    const start = new Date(template.startDate);
    const end = new Date(template.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return targetDate >= start && targetDate <= end;
  }

  if (template.targetType === 'DAY_OF_WEEK' && template.dayOfWeek?.length) {
    return template.dayOfWeek.includes(targetDate.getDay());
  }

  return false;
}

function getCategoryLabel(category: string) {
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

export function DaycareDailyRecordCreateContainer() {
  const { isLoading, session } = useSession();
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [screenLoading, setScreenLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [templateId, setTemplateId] = useState('');

  useEffect(() => {
    async function run() {
      if (!session?.daycareId) {
        return;
      }

      try {
        setScreenLoading(true);
        setError('');
        const data = await listScheduleTemplates(session.token, session.daycareId, true);
        setTemplates(data);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Gagal memuat template.');
      } finally {
        setScreenLoading(false);
      }
    }

    void run();
  }, [session?.daycareId, session?.token]);

  const filteredTemplates = useMemo(
    () => templates.filter((template) => matchesTemplateDate(template, date)),
    [templates, date]
  );

  const templateOptions: SelectOption[] = filteredTemplates.map((template) => ({
    label: template.name,
    value: template.id,
  }));

  const selectedTemplate = filteredTemplates.find((template) => template.id === templateId);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const activeSession = session;

  async function handleSubmit() {
    if (!date || !templateId) {
      setError('Tanggal dan template wajib dipilih.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await applyScheduleTemplateForDate(activeSession.token, {
        daycareId: activeSession.daycareId,
        date,
        templateId,
      });
      router.replace('/(daycare)/daily-care');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal membuat daily record.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <ScreenHeader title="Buat Daily Record" subtitle="Pilih tanggal lalu terapkan template untuk hari itu." onBack={() => router.back()} />

        <ScreenSection>
          <TextField value={date} placeholder="Tanggal (YYYY-MM-DD)" onChange={setDate} backgroundColor="#FFFFFF" borderRadius={14} />
          <SelectInput
            value={templateId}
            placeholder="Pilih template"
            title="Template"
            options={templateOptions}
            onChange={setTemplateId}
            disabled={screenLoading || !date}
          />

          {screenLoading ? <Text color="textSecondary">Memuat template...</Text> : null}
          {!screenLoading && date && templateOptions.length === 0 ? (
            <Text color="textSecondary">Tidak ada template yang cocok untuk tanggal ini.</Text>
          ) : null}

          {selectedTemplate ? (
            <Box gap="xs">
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#3D2218' }}>Aktivitas yang akan diterapkan</Text>
              {selectedTemplate.activities.map((activity, index) => (
                <Box
                  key={`${activity.activityName}-${index}`}
                  padding="sm"
                  style={{ borderWidth: 1, borderColor: '#F0D5C9', borderRadius: 10, backgroundColor: '#FFFFFF' }}>
                  <Text style={{ fontWeight: '700', color: '#3D2218' }}>{activity.activityName}</Text>
                  <Text color="textSecondary">
                    {activity.startTime} - {activity.endTime} · {getCategoryLabel(activity.category)}
                  </Text>
                </Box>
              ))}
            </Box>
          ) : null}

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button mode="contained" onPress={() => void handleSubmit()} loading={loading} disabled={loading || !date || !templateId}>
            Terapkan Template
          </Button>
        </ScreenSection>
      </ScrollView>
    </Box>
  );
}
