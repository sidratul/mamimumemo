import { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { FieldShell, ScreenHeader, TextField, useToast } from '@mami/ui';

import { DatePickerInput } from '../../../components/molecules/DatePickerInput';
import { ActivitySourceSelectInput } from '../../../components/molecules/ActivitySourceSelectInput';
import { TimePickerInput } from '../../../components/molecules/TimePickerInput';
import { addMinutesToTime } from '../../../components/molecules/time-utils';
import { SearchableSelectInputBase, type SearchableSelectOption } from '../../../components/molecules/SearchableSelectInputBase';
import { useSession } from '../../../providers/session-provider';
import {
  createScheduleTemplate,
  deactivateScheduleTemplate,
  listMasterActivities,
  listScheduleTemplates,
  updateScheduleTemplate,
  type MasterActivity,
  type ScheduleTemplate,
  type ScheduleTemplateActivityInput,
} from '../../../services/operations/schedule-planning';
import {
  getResolvedActivityCategories,
  type ResolvedActivityCategory,
} from '../../../services/operations/daycare-config';
import { Box, Text, useAppTheme } from '../../../theme/theme';

type TemplateFormType = 'DEFAULT' | 'DAY_OF_WEEK' | 'DATE_RANGE';

type TemplateFormValue = {
  name: string;
  type: TemplateFormType;
  dayOfWeek: number[];
  startDate: string;
  endDate: string;
};

type TemplateFormErrors = Partial<Record<keyof TemplateFormValue | 'submit', string>>;

type TemplateActivityFormValue = {
  daycareActivityId: string;
  activityName: string;
  category: string;
  startTime: string;
  endTime: string;
  duration: string;
  defaultSitterRole: 'ANY' | 'SENIOR_SITTER' | 'JUNIOR_SITTER';
};

type TemplateActivityFormErrors = Partial<Record<keyof TemplateActivityFormValue | 'submit', string>>;

const allDays = [0, 1, 2, 3, 4, 5, 6];

const initialFormValue: TemplateFormValue = {
  name: '',
  type: 'DEFAULT',
  dayOfWeek: [],
  startDate: '',
  endDate: '',
};

const initialActivityFormValue: TemplateActivityFormValue = {
  daycareActivityId: '',
  activityName: '',
  category: '',
  startTime: '',
  endTime: '',
  duration: '',
  defaultSitterRole: 'ANY',
};

const templateTypeOptions: {
  label: string;
  value: TemplateFormType;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}[] = [
  {
    label: 'Default',
    value: 'DEFAULT',
    description: 'Berlaku setiap hari sebagai template dasar.',
    icon: 'calendar-check',
  },
  {
    label: 'Harian',
    value: 'DAY_OF_WEEK',
    description: 'Berlaku untuk beberapa hari, misalnya Senin dan Rabu.',
    icon: 'calendar-week',
  },
  {
    label: 'Tanggal tertentu',
    value: 'DATE_RANGE',
    description: 'Berlaku untuk rentang tanggal.',
    icon: 'calendar-range',
  },
];

const dayOptions = [
  { label: 'Min', longLabel: 'Minggu', value: 0 },
  { label: 'Sen', longLabel: 'Senin', value: 1 },
  { label: 'Sel', longLabel: 'Selasa', value: 2 },
  { label: 'Rab', longLabel: 'Rabu', value: 3 },
  { label: 'Kam', longLabel: 'Kamis', value: 4 },
  { label: 'Jum', longLabel: 'Jumat', value: 5 },
  { label: 'Sab', longLabel: 'Sabtu', value: 6 },
];

function parseSimpleDate(value: string) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return null;

  return {
    day: Number(match[1]),
    month: Number(match[2]),
    year: Number(match[3]),
  };
}

function simpleDateToApiDate(value: string) {
  const parsed = parseSimpleDate(value);
  if (!parsed) return value;

  return [
    String(parsed.year).padStart(4, '0'),
    String(parsed.month).padStart(2, '0'),
    String(parsed.day).padStart(2, '0'),
  ].join('-');
}

function isValidSimpleDate(value: string) {
  const parsed = parseSimpleDate(value);
  if (!parsed) return false;

  const { day, month, year } = parsed;
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function normalizeTargetType(value?: ScheduleTemplate['targetType'] | string | null) {
  return value?.toUpperCase() as ScheduleTemplate['targetType'] | undefined;
}

function getTemplateKind(template: ScheduleTemplate) {
  const targetType = normalizeTargetType(template.targetType);

  if (targetType === 'DATE_RANGE' || (template.startDate && template.endDate)) return 'Tanggal tertentu';
  if (targetType === 'SPECIFIC_DATE') return 'Tanggal tertentu';
  if ((template.dayOfWeek ?? []).length === 7) return 'Default';
  return 'Harian';
}

function getTemplateScheduleText(template: ScheduleTemplate) {
  const targetType = normalizeTargetType(template.targetType);

  if (targetType === 'DATE_RANGE' || (template.startDate && template.endDate)) {
    return `${formatDate(template.startDate)} - ${formatDate(template.endDate)}`;
  }

  if (targetType === 'SPECIFIC_DATE') {
    return formatDate(template.specificDate);
  }

  const days = template.dayOfWeek ?? [];
  if (days.length === 7) return 'Setiap hari';
  if (days.length === 0) return '-';

  return days
    .slice()
    .sort((left, right) => left - right)
    .map((day) => dayOptions.find((option) => option.value === day)?.longLabel ?? String(day))
    .join(', ');
}

function templateTypeIcon(type: string): React.ComponentProps<typeof MaterialCommunityIcons>['name'] {
  if (type === 'Default') return 'calendar-check';
  if (type === 'Tanggal tertentu') return 'calendar-range';
  return 'calendar-week';
}

function sitterRoleLabel(value: TemplateActivityFormValue['defaultSitterRole']) {
  if (value === 'SENIOR_SITTER') return 'Senior Sitter';
  if (value === 'JUNIOR_SITTER') return 'Junior Sitter';
  return 'Bebas';
}

function formatDuration(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return '-';
  }
  return `${parsed} menit`;
}

function resolveTemplateFormValue(template?: ScheduleTemplate): TemplateFormValue {
  if (!template) {
    return initialFormValue;
  }

  const targetType = normalizeTargetType(template.targetType);
  const dayOfWeek = template.dayOfWeek ?? [];

  if (targetType === 'DATE_RANGE' || (template.startDate && template.endDate)) {
    return {
      name: template.name,
      type: 'DATE_RANGE',
      dayOfWeek: [],
      startDate: formatDateToSimpleInput(template.startDate),
      endDate: formatDateToSimpleInput(template.endDate),
    };
  }

  return {
    name: template.name,
    type: dayOfWeek.length === 7 ? 'DEFAULT' : 'DAY_OF_WEEK',
    dayOfWeek: dayOfWeek.length === 7 ? [] : dayOfWeek,
    startDate: '',
    endDate: '',
  };
}

function formatDateToSimpleInput(value?: string | null) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).padStart(4, '0');

  return `${day}-${month}-${year}`;
}

export function DaycareTemplateContainer() {
  const router = useRouter();
  const { isLoading, session } = useSession();
  const { showToast } = useToast();
  const appTheme = useAppTheme();
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [masterActivities, setMasterActivities] = useState<MasterActivity[]>([]);
  const [activityCategories, setActivityCategories] = useState<ResolvedActivityCategory[]>([]);
  const [screenLoading, setScreenLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<ScheduleTemplate | null>(null);
  const [formValue, setFormValue] = useState<TemplateFormValue>(initialFormValue);
  const [formErrors, setFormErrors] = useState<TemplateFormErrors>({});
  const [activityFormVisible, setActivityFormVisible] = useState(false);
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);
  const [activityFormValue, setActivityFormValue] = useState<TemplateActivityFormValue>(initialActivityFormValue);
  const [activityFormErrors, setActivityFormErrors] = useState<TemplateActivityFormErrors>({});
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!session?.daycareId) return;

    try {
      setScreenLoading(true);
      setError('');
      const [templateData, masterActivityData, categoryData] = await Promise.all([
        listScheduleTemplates(session.token, session.daycareId, true),
        listMasterActivities(session.token, session.daycareId, true),
        getResolvedActivityCategories(session.token, session.daycareId),
      ]);
      setTemplates(templateData);
      setMasterActivities(masterActivityData);
      setActivityCategories(categoryData.filter((category) => category.enabled));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal memuat template.');
    } finally {
      setScreenLoading(false);
    }
  }, [session?.daycareId, session?.token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const sortedTemplates = useMemo(
    () => [...templates].sort((left, right) => left.name.localeCompare(right.name)),
    [templates],
  );

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const activeSession = session;

  function openCreateForm() {
    setEditingTemplate(null);
    setFormValue(initialFormValue);
    setFormErrors({});
    setFormVisible(true);
  }

  function openEditForm(template: ScheduleTemplate) {
    setEditingTemplate(template);
    setFormValue(resolveTemplateFormValue(template));
    setFormErrors({});
    setFormVisible(true);
  }

  function openDetail(template: ScheduleTemplate) {
    void router.push(`/(daycare)/template/${template.id}`);
  }

  function closeDetail() {
    setSelectedTemplate(null);
    setActivityFormVisible(false);
    setEditingActivityIndex(null);
    setActivityFormErrors({});
  }

  function openAddActivity() {
    setEditingActivityIndex(null);
    setActivityFormValue(initialActivityFormValue);
    setActivityFormErrors({});
    setActivityFormVisible(true);
  }

  function openEditActivity(index: number) {
    if (!selectedTemplate) return;

    const activity = selectedTemplate.activities[index];
    if (!activity) return;

    setEditingActivityIndex(index);
    setActivityFormValue({
      daycareActivityId: activity.daycareActivityId ?? '',
      activityName: activity.activityName,
      category: activity.category,
      startTime: activity.startTime,
      endTime: activity.endTime,
      duration: activity.duration ? String(activity.duration) : '',
      defaultSitterRole: (activity.defaultSitterRole ?? 'ANY') as TemplateActivityFormValue['defaultSitterRole'],
    });
    setActivityFormErrors({});
    setActivityFormVisible(true);
  }

  function closeActivityForm() {
    setActivityFormVisible(false);
    setEditingActivityIndex(null);
    setActivityFormErrors({});
    setActivityFormValue(initialActivityFormValue);
  }

  function updateForm<K extends keyof TemplateFormValue>(key: K, value: TemplateFormValue[K]) {
    setFormValue((current) => ({ ...current, [key]: value }));
    setFormErrors((current) => ({ ...current, [key]: undefined, submit: undefined }));
  }

  function toggleDay(day: number) {
    setFormValue((current) => {
      const selected = current.dayOfWeek.includes(day);
      return {
        ...current,
        dayOfWeek: selected
          ? current.dayOfWeek.filter((item) => item !== day)
          : [...current.dayOfWeek, day].sort((left, right) => left - right),
      };
    });
    setFormErrors((current) => ({ ...current, dayOfWeek: undefined, submit: undefined }));
  }

  function validateActivityForm() {
    const nextErrors: TemplateActivityFormErrors = {};
    const selectedActivity = activityFormValue.daycareActivityId
      ? masterActivities.find((item) => item.id === activityFormValue.daycareActivityId)
      : null;

    if (!selectedActivity && !activityFormValue.activityName.trim()) {
      nextErrors.daycareActivityId = 'Aktivitas wajib dipilih.';
    }

    if (!activityFormValue.startTime.trim()) {
      nextErrors.startTime = 'Jam mulai wajib diisi.';
    }

    if (!activityFormValue.endTime.trim()) {
      nextErrors.endTime = 'Jam selesai wajib diisi.';
    }

    if (activityFormValue.duration.trim()) {
      const parsed = Number(activityFormValue.duration);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        nextErrors.duration = 'Durasi harus berupa angka positif.';
      }
    }

    setActivityFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function applySelectedMasterActivity(masterActivityId: string) {
    if (!masterActivityId) {
      setActivityFormValue((current) => ({
        ...current,
        daycareActivityId: '',
      }));
      return;
    }

    const masterActivity = masterActivities.find((item) => item.id === masterActivityId);
    if (!masterActivity) return;

    setActivityFormValue((current) => ({
      ...current,
      daycareActivityId: masterActivity.id,
      activityName: masterActivity.name,
      category: masterActivity.category,
      duration: String(masterActivity.defaultDuration || ''),
      endTime: current.startTime ? addMinutesToTime(current.startTime, masterActivity.defaultDuration) : current.endTime,
    }));
  }

  async function persistTemplateActivities(nextActivities: ScheduleTemplateActivityInput[]) {
    if (!selectedTemplate || !activeSession.token) return;

    const updated = await updateScheduleTemplate(activeSession.token, selectedTemplate.id, {
      activities: nextActivities,
    });

    setTemplates((current) => current.map((template) => (template.id === updated.id ? updated : template)));
    setSelectedTemplate(updated);
    return updated;
  }

  async function saveActivity() {
    if (!selectedTemplate || !validateActivityForm()) return;

    try {
      setSaving(true);
      setActivityFormErrors({});
      const isEditing = editingActivityIndex !== null;
      const selectedActivity = activityFormValue.daycareActivityId
        ? masterActivities.find((item) => item.id === activityFormValue.daycareActivityId)
        : null;

      const nextActivity: ScheduleTemplateActivityInput = {
        daycareActivityId: selectedActivity?.id || activityFormValue.daycareActivityId || undefined,
        activityName: selectedActivity?.name ?? activityFormValue.activityName.trim(),
        category: selectedActivity?.category ?? activityFormValue.category.trim(),
        startTime: activityFormValue.startTime.trim(),
        endTime: activityFormValue.endTime.trim(),
        duration: selectedActivity?.defaultDuration ?? (activityFormValue.duration.trim() ? Number(activityFormValue.duration) : undefined),
        defaultSitterRole: activityFormValue.defaultSitterRole,
      };

      const nextActivities = !isEditing
        ? [...selectedTemplate.activities, nextActivity]
        : selectedTemplate.activities.map((item, index) => (index === editingActivityIndex ? nextActivity : item));

      await persistTemplateActivities(nextActivities);
      closeActivityForm();
      showToast({
        message: isEditing ? 'Aktivitas template diperbarui.' : 'Aktivitas template ditambahkan.',
        tone: 'success',
      });
    } catch (nextError) {
      setActivityFormErrors({
        submit: nextError instanceof Error ? nextError.message : 'Gagal menyimpan aktivitas template.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteActivity(index: number) {
    if (!selectedTemplate) return;

    try {
      setSaving(true);
      const nextActivities = selectedTemplate.activities.filter((_, currentIndex) => currentIndex !== index);
      await persistTemplateActivities(nextActivities);
      showToast({ message: 'Aktivitas template dihapus.', tone: 'success' });
    } catch (nextError) {
      showToast({
        message: nextError instanceof Error ? nextError.message : 'Gagal menghapus aktivitas.',
        tone: 'danger',
      });
    } finally {
      setSaving(false);
    }
  }

  async function moveActivity(index: number, direction: 'up' | 'down') {
    if (!selectedTemplate) return;

    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= selectedTemplate.activities.length) {
      return;
    }

    try {
      setSaving(true);
      const nextActivities = [...selectedTemplate.activities];
      const [item] = nextActivities.splice(index, 1);
      nextActivities.splice(nextIndex, 0, item);
      await persistTemplateActivities(nextActivities);
      showToast({
        message: direction === 'up' ? 'Aktivitas dipindah ke atas.' : 'Aktivitas dipindah ke bawah.',
        tone: 'success',
      });
    } catch (nextError) {
      showToast({
        message: nextError instanceof Error ? nextError.message : 'Gagal mengubah urutan aktivitas.',
        tone: 'danger',
      });
    } finally {
      setSaving(false);
    }
  }

  async function deactivateTemplate() {
    if (!selectedTemplate) return;

    try {
      setSaving(true);
      const updated = await deactivateScheduleTemplate(activeSession.token, selectedTemplate.id);
      setTemplates((current) => current.filter((template) => template.id !== updated.id));
      closeDetail();
      showToast({ message: 'Template dinonaktifkan.', tone: 'success' });
    } catch (nextError) {
      showToast({
        message: nextError instanceof Error ? nextError.message : 'Gagal menonaktifkan template.',
        tone: 'danger',
      });
    } finally {
      setSaving(false);
    }
  }

  function validateForm() {
    const nextErrors: TemplateFormErrors = {};

    if (!formValue.name.trim()) {
      nextErrors.name = 'Nama template wajib diisi.';
    }

    if (formValue.type === 'DAY_OF_WEEK' && formValue.dayOfWeek.length === 0) {
      nextErrors.dayOfWeek = 'Pilih minimal satu hari.';
    }

    if (formValue.type === 'DATE_RANGE') {
      if (!formValue.startDate.trim()) {
        nextErrors.startDate = 'Tanggal mulai wajib diisi.';
      } else if (!isValidSimpleDate(formValue.startDate)) {
        nextErrors.startDate = 'Tanggal mulai tidak valid.';
      }

      if (!formValue.endDate.trim()) {
        nextErrors.endDate = 'Tanggal selesai wajib diisi.';
      } else if (!isValidSimpleDate(formValue.endDate)) {
        nextErrors.endDate = 'Tanggal selesai tidak valid.';
      }

      if (
        isValidSimpleDate(formValue.startDate) &&
        isValidSimpleDate(formValue.endDate) &&
        new Date(simpleDateToApiDate(formValue.startDate)) > new Date(simpleDateToApiDate(formValue.endDate))
      ) {
        nextErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai.';
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!activeSession.daycareId || !validateForm()) return;

    try {
      setSaving(true);
      setFormErrors({});

      const basePayload: {
        name: string;
        targetType: 'DAY_OF_WEEK' | 'DATE_RANGE';
        dayOfWeek?: number[];
        startDate?: string;
        endDate?: string;
      } = {
        name: formValue.name.trim(),
        targetType: formValue.type === 'DATE_RANGE' ? 'DATE_RANGE' : 'DAY_OF_WEEK',
        dayOfWeek: formValue.type === 'DATE_RANGE'
          ? undefined
          : formValue.type === 'DEFAULT'
            ? allDays
            : formValue.dayOfWeek,
        startDate: formValue.type === 'DATE_RANGE' ? simpleDateToApiDate(formValue.startDate) : undefined,
        endDate: formValue.type === 'DATE_RANGE' ? simpleDateToApiDate(formValue.endDate) : undefined,
      };

      const nextTemplate = editingTemplate
        ? await updateScheduleTemplate(activeSession.token, editingTemplate.id, basePayload)
        : await createScheduleTemplate(activeSession.token, {
            daycareId: activeSession.daycareId,
            ...basePayload,
            activities: [],
          });

      setTemplates((current) =>
        editingTemplate
          ? current.map((template) => (template.id === nextTemplate.id ? nextTemplate : template))
          : [nextTemplate, ...current]
      );
      setFormVisible(false);
      setEditingTemplate(null);
      showToast({
        message: editingTemplate ? 'Template berhasil diperbarui.' : 'Template berhasil dibuat.',
        tone: 'success',
      });
    } catch (nextError) {
      setFormErrors({
        submit: nextError instanceof Error ? nextError.message : 'Gagal menyimpan template.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView contentContainerStyle={{ gap: 18, padding: 24, paddingBottom: 48 }}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="lg">
          <Box flex={1}>
            <ScreenHeader title="Template Aktivitas" subtitle="Kelola pola template yang bisa diterapkan ke daily care." />
          </Box>
          <Pressable accessibilityRole="button" onPress={openCreateForm}>
            <Box
              alignItems="center"
              backgroundColor="primary"
              borderRadius="sm"
              flexDirection="row"
              gap="sm"
              minHeight={42}
              paddingHorizontal="lg">
              <MaterialCommunityIcons name="plus" size={18} color={appTheme.colors.onPrimary} />
              <Text style={{ color: appTheme.colors.onPrimary, fontSize: 13, fontWeight: '900' }}>Buat Template</Text>
            </Box>
          </Pressable>
        </Box>

        {error ? (
          <Box backgroundColor="surface" borderRadius="sm" borderWidth={1} borderColor="border" padding="lg">
            <Text color="danger" style={{ fontWeight: '800' }}>{error}</Text>
          </Box>
        ) : null}

        <Box backgroundColor="surface" borderRadius="sm" borderWidth={1} borderColor="border" style={{ overflow: 'hidden' }}>
          <Box borderColor="border" paddingHorizontal="lg" paddingVertical="md" style={{ borderBottomWidth: 1 }}>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="md">
              <Box gap="xxs">
                <Text style={{ fontSize: 16, fontWeight: '900' }}>List Template</Text>
                <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }}>
                  {screenLoading ? 'Memuat data...' : `${sortedTemplates.length} template aktif`}
                </Text>
              </Box>
              <Pressable accessibilityRole="button" onPress={() => void loadData()}>
                <Box alignItems="center" borderRadius="sm" borderWidth={1} borderColor="border" justifyContent="center" style={{ height: 34, width: 34 }}>
                  <MaterialCommunityIcons name="refresh" size={18} color={appTheme.colors.textSecondary} />
                </Box>
              </Pressable>
            </Box>
          </Box>

          <Box backgroundColor="background" borderColor="border" style={{ borderBottomWidth: 1 }} paddingHorizontal="lg" paddingVertical="md">
            <Box flexDirection="row" gap="md" alignItems="center">
              <Text style={{ color: appTheme.colors.textSecondary, flex: 1.5, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>Nama</Text>
              <Text style={{ color: appTheme.colors.textSecondary, flex: 1, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>Tipe</Text>
              <Text style={{ color: appTheme.colors.textSecondary, flex: 1.4, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>Jadwal</Text>
              <Text style={{ color: appTheme.colors.textSecondary, flex: 0.7, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>Aktivitas</Text>
              <Text style={{ color: appTheme.colors.textSecondary, flex: 0.9, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>Aksi</Text>
            </Box>
          </Box>

          {screenLoading ? (
            <Box padding="lg">
              <Text color="textSecondary">Memuat template...</Text>
            </Box>
          ) : null}

          {!screenLoading && sortedTemplates.length === 0 ? (
            <Box padding="xl" alignItems="center" gap="sm">
              <MaterialCommunityIcons name="calendar-blank-outline" size={34} color={appTheme.colors.textSecondary} />
              <Text style={{ fontSize: 16, fontWeight: '900' }}>Belum ada template</Text>
              <Text color="textSecondary">Buat template pertama untuk daily care.</Text>
            </Box>
          ) : null}

          {!screenLoading
            ? sortedTemplates.map((template) => {
                const type = getTemplateKind(template);

                return (
                  <Box
                    key={template.id}
                    borderColor="border"
                    paddingHorizontal="lg"
                    paddingVertical="md"
                    style={{ borderBottomWidth: 1 }}>
                    <Box flexDirection="row" gap="md" alignItems="center">
                      <Box flex={1.5} gap="xxs">
                        <Text numberOfLines={1} style={{ fontWeight: '900' }}>{template.name}</Text>
                        <Text color="textSecondary" style={{ fontSize: 12 }}>{template.active ? 'Aktif' : 'Nonaktif'}</Text>
                      </Box>
                      <Box flex={1} flexDirection="row" alignItems="center" gap="sm">
                        <MaterialCommunityIcons name={templateTypeIcon(type)} size={17} color={appTheme.colors.primary} />
                        <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '800' }}>{type}</Text>
                      </Box>
                      <Text numberOfLines={1} style={{ flex: 1.4, fontSize: 13, fontWeight: '700' }}>{getTemplateScheduleText(template)}</Text>
                      <Text numberOfLines={1} color="textSecondary" style={{ flex: 0.7, fontSize: 13, fontWeight: '800' }}>
                        {template.activities.length}
                      </Text>
                      <Box flex={0.9} flexDirection="row" justifyContent="flex-end" gap="sm">
                        <Pressable accessibilityRole="button" accessibilityLabel={`Detail ${template.name}`} onPress={() => openDetail(template)}>
                          <Box
                            alignItems="center"
                            borderRadius="sm"
                            borderWidth={1}
                            borderColor="border"
                            flexDirection="row"
                            gap="xs"
                            minHeight={34}
                            paddingHorizontal="md">
                            <MaterialCommunityIcons name="text-box-outline" size={16} color={appTheme.colors.textSecondary} />
                            <Text style={{ fontSize: 12, fontWeight: '800' }}>Detail</Text>
                          </Box>
                        </Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel={`Ubah ${template.name}`} onPress={() => openEditForm(template)}>
                          <Box
                            alignItems="center"
                            backgroundColor="background"
                            borderRadius="sm"
                            borderWidth={1}
                            borderColor="primary"
                            flexDirection="row"
                            gap="xs"
                            minHeight={34}
                            paddingHorizontal="md">
                            <MaterialCommunityIcons name="pencil-outline" size={16} color={appTheme.colors.primary} />
                            <Text style={{ color: appTheme.colors.primary, fontSize: 12, fontWeight: '900' }}>Ubah</Text>
                          </Box>
                        </Pressable>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            : null}
        </Box>
      </ScrollView>

      <TemplateFormModal
        visible={formVisible}
        saving={saving}
        value={formValue}
        errors={formErrors}
        onChange={updateForm}
        onToggleDay={toggleDay}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        title={editingTemplate ? 'Ubah Template' : 'Buat Template'}
        subtitle={editingTemplate ? 'Perbarui informasi dasar template ini.' : 'Isi nama dan tipe template. Aktivitas bisa ditambahkan nanti.'}
      />
    </Box>
  );
}

type TemplateFormModalProps = {
  visible: boolean;
  saving: boolean;
  value: TemplateFormValue;
  errors: TemplateFormErrors;
  onChange: <K extends keyof TemplateFormValue>(key: K, value: TemplateFormValue[K]) => void;
  onToggleDay: (day: number) => void;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  subtitle: string;
};

function TemplateFormModal({
  visible,
  saving,
  value,
  errors,
  onChange,
  onToggleDay,
  onClose,
  onSubmit,
  title,
  subtitle,
}: TemplateFormModalProps) {
  const appTheme = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ alignItems: 'center', backgroundColor: appTheme.colors.backdrop, flex: 1, justifyContent: 'center', padding: 24 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }} />
        <View style={{ backgroundColor: appTheme.colors.surface, borderColor: appTheme.colors.border, borderRadius: 8, borderWidth: 1, maxWidth: 620, padding: 18, width: '100%' }}>
          <Box gap="md">
            <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="md">
              <Box flex={1} gap="xxs">
                <Text style={{ color: appTheme.colors.textPrimary, fontSize: 20, fontWeight: '900', lineHeight: 26 }}>{title}</Text>
                <Text color="textSecondary">{subtitle}</Text>
              </Box>
              <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose}>
                <Box alignItems="center" borderRadius="sm" borderWidth={1} borderColor="border" justifyContent="center" style={{ height: 38, width: 38 }}>
                  <MaterialCommunityIcons name="close" size={22} color={appTheme.colors.textSecondary} />
                </Box>
              </Pressable>
            </Box>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 2 }}>
              <FieldShell label="Nama template" required error={errors.name}>
                <TextField
                  value={value.name}
                  disabled={saving}
                  placeholder="Contoh: Aktivitas rutin Senin"
                  backgroundColor={appTheme.colors.surface}
                  borderRadius={8}
                  useBottomSheetInput={false}
                  onChange={(next) => onChange('name', next)}
                />
              </FieldShell>

              <FieldShell label="Tipe template" required>
                <Box gap="sm">
                  {templateTypeOptions.map((option) => {
                    const selected = value.type === option.value;
                    const foreground = selected ? appTheme.colors.primary : appTheme.colors.textPrimary;

                    return (
                      <Pressable
                        key={option.value}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        disabled={saving}
                        onPress={() => onChange('type', option.value)}>
                        <Box
                          backgroundColor={selected ? 'background' : 'surface'}
                          borderRadius="sm"
                          borderWidth={1}
                          borderColor={selected ? 'primary' : 'border'}
                          flexDirection="row"
                          gap="md"
                          padding="md">
                          <Box
                            alignItems="center"
                            backgroundColor={selected ? 'primary' : 'background'}
                            borderRadius="sm"
                            justifyContent="center"
                            style={{ height: 38, width: 38 }}>
                            <MaterialCommunityIcons
                              name={option.icon}
                              size={20}
                              color={selected ? appTheme.colors.onPrimary : appTheme.colors.textSecondary}
                            />
                          </Box>
                          <Box flex={1} gap="xxs">
                            <Text style={{ color: foreground, fontSize: 14, fontWeight: '900' }}>{option.label}</Text>
                            <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }}>{option.description}</Text>
                          </Box>
                          {selected ? <MaterialCommunityIcons name="check-circle" size={20} color={appTheme.colors.primary} /> : null}
                        </Box>
                      </Pressable>
                    );
                  })}
                </Box>
              </FieldShell>

              {value.type === 'DAY_OF_WEEK' ? (
                <FieldShell label="Hari" required error={errors.dayOfWeek}>
                  <Box flexDirection="row" flexWrap="wrap" gap="sm">
                    {dayOptions.map((option) => {
                      const selected = value.dayOfWeek.includes(option.value);

                      return (
                        <Pressable key={option.value} accessibilityRole="button" onPress={() => onToggleDay(option.value)}>
                          <Box
                            backgroundColor={selected ? 'primary' : 'background'}
                            borderRadius="sm"
                            borderWidth={1}
                            borderColor={selected ? 'primary' : 'border'}
                            paddingHorizontal="md"
                            paddingVertical="sm">
                            <Text style={{ color: selected ? appTheme.colors.onPrimary : appTheme.colors.textPrimary, fontSize: 12, fontWeight: '900' }}>
                              {option.label}
                            </Text>
                          </Box>
                        </Pressable>
                      );
                    })}
                  </Box>
                </FieldShell>
              ) : null}

              {value.type === 'DATE_RANGE' ? (
                <Box flexDirection="row" gap="md">
                  <FieldShell label="Tanggal mulai" required error={errors.startDate} style={{ flex: 1 }}>
                    <DatePickerInput
                      value={value.startDate}
                      disabled={saving}
                      error={errors.startDate}
                      onChange={(next) => onChange('startDate', next)}
                    />
                  </FieldShell>
                  <FieldShell label="Tanggal selesai" required error={errors.endDate} style={{ flex: 1 }}>
                    <DatePickerInput
                      value={value.endDate}
                      disabled={saving}
                      error={errors.endDate}
                      onChange={(next) => onChange('endDate', next)}
                    />
                  </FieldShell>
                </Box>
              ) : null}

              {errors.submit ? <Text color="danger" style={{ fontSize: 12, fontWeight: '700' }}>{errors.submit}</Text> : null}

              <Box flexDirection="row" gap="sm" justifyContent="flex-end">
                <Pressable accessibilityRole="button" disabled={saving} onPress={onClose}>
                  <Box borderRadius="sm" borderWidth={1} borderColor="border" paddingHorizontal="lg" paddingVertical="md">
                    <Text style={{ fontWeight: '800' }}>Batal</Text>
                  </Box>
                </Pressable>
                <Pressable accessibilityRole="button" disabled={saving} onPress={() => void onSubmit()}>
                  <Box backgroundColor="primary" borderRadius="sm" paddingHorizontal="lg" paddingVertical="md">
                    <Text style={{ color: appTheme.colors.onPrimary, fontWeight: '900' }}>{saving ? 'Menyimpan...' : 'Simpan'}</Text>
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

type TemplateDetailModalProps = {
  visible: boolean;
  template: ScheduleTemplate | null;
  masterActivities: MasterActivity[];
  categories: ResolvedActivityCategory[];
  saving: boolean;
  onClose: () => void;
  onEdit: (template: ScheduleTemplate) => void;
  onAddActivity: () => void;
  onEditActivity: (index: number) => void;
  onDeleteActivity: (index: number) => void;
  onMoveActivity: (index: number, direction: 'up' | 'down') => void;
  onDeactivate: () => void;
};

function TemplateDetailModal({
  visible,
  template,
  masterActivities,
  categories,
  saving,
  onClose,
  onEdit,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onMoveActivity,
  onDeactivate,
}: TemplateDetailModalProps) {
  const appTheme = useAppTheme();
  const categoryLabelMap = useMemo(
    () => new Map(categories.map((category) => [category.code.toUpperCase(), category.label])),
    [categories],
  );
  const masterActivityMap = useMemo(
    () => new Map(masterActivities.map((activity) => [activity.id, activity])),
    [masterActivities],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ alignItems: 'center', backgroundColor: appTheme.colors.backdrop, flex: 1, justifyContent: 'center', padding: 24 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tutup detail" onPress={onClose} style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }} />
        <View style={{ backgroundColor: appTheme.colors.surface, borderColor: appTheme.colors.border, borderRadius: 8, borderWidth: 1, maxWidth: 720, width: '100%' }}>
          <Box borderColor="border" paddingHorizontal="lg" paddingVertical="md" style={{ borderBottomWidth: 1 }}>
            <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="md">
              <Box flex={1} gap="xxs">
                <Text style={{ fontSize: 20, fontWeight: '900' }}>{template?.name ?? 'Detail Template'}</Text>
                <Text color="textSecondary">
                  {template ? `${getTemplateKind(template)} · ${template.activities.length} aktivitas` : 'Detail template aktivitas.'}
                </Text>
              </Box>
              <Pressable accessibilityRole="button" accessibilityLabel="Tutup detail" onPress={onClose}>
                <Box alignItems="center" borderRadius="sm" borderWidth={1} borderColor="border" justifyContent="center" style={{ height: 38, width: 38 }}>
                  <MaterialCommunityIcons name="close" size={22} color={appTheme.colors.textSecondary} />
                </Box>
              </Pressable>
            </Box>
          </Box>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, padding: 18, paddingBottom: 22 }}>
            {template ? (
              <>
                <Box flexDirection="row" flexWrap="wrap" gap="sm">
                  <InfoPill label="Tipe" value={getTemplateKind(template)} />
                  <InfoPill label="Jadwal" value={getTemplateScheduleText(template)} />
                  <InfoPill label="Status" value={template.active ? 'Aktif' : 'Nonaktif'} />
                </Box>

                <Box gap="sm">
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Text style={{ fontSize: 16, fontWeight: '900' }}>Aktivitas</Text>
                  <Box flexDirection="row" gap="sm">
                    <Pressable accessibilityRole="button" onPress={onAddActivity}>
                      <Box borderColor="primary" borderRadius="sm" borderWidth={1} flexDirection="row" gap="xs" minHeight={34} paddingHorizontal="md">
                        <MaterialCommunityIcons name="plus" size={16} color={appTheme.colors.primary} />
                        <Text style={{ color: appTheme.colors.primary, fontSize: 12, fontWeight: '900', lineHeight: 34 }}>Tambah</Text>
                      </Box>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={() => onEdit(template)}>
                      <Box backgroundColor="primary" borderRadius="sm" flexDirection="row" gap="xs" minHeight={34} paddingHorizontal="md">
                        <MaterialCommunityIcons name="pencil-outline" size={16} color={appTheme.colors.onPrimary} />
                        <Text style={{ color: appTheme.colors.onPrimary, fontSize: 12, fontWeight: '900', lineHeight: 34 }}>Ubah Template</Text>
                      </Box>
                    </Pressable>
                    <Pressable accessibilityRole="button" disabled={saving || !template.active} onPress={() => void onDeactivate()}>
                      <Box
                        backgroundColor={template.active ? 'surface' : 'background'}
                        borderColor={template.active ? 'danger' : 'border'}
                        borderRadius="sm"
                        borderWidth={1}
                        flexDirection="row"
                        gap="xs"
                        minHeight={34}
                        paddingHorizontal="md">
                        <MaterialCommunityIcons name="archive-remove-outline" size={16} color={template.active ? appTheme.colors.danger : appTheme.colors.textSecondary} />
                        <Text
                          style={{
                            color: template.active ? appTheme.colors.danger : appTheme.colors.textSecondary,
                            fontSize: 12,
                            fontWeight: '900',
                            lineHeight: 34,
                          }}>
                          Nonaktifkan
                        </Text>
                      </Box>
                    </Pressable>
                  </Box>
                  </Box>

                  {template.activities.length === 0 ? (
                    <Box backgroundColor="background" borderColor="border" borderWidth={1} borderRadius="sm" padding="lg">
                      <Text style={{ fontSize: 13, fontWeight: '700' }} color="textSecondary">
                        Template ini belum punya aktivitas. Masih bisa disimpan sebagai kerangka.
                      </Text>
                    </Box>
                  ) : (
                    <Box gap="sm">
                      {template.activities.map((activity, index) => (
                        <Box
                          key={`${activity.activityName}-${activity.startTime}-${index}`}
                          backgroundColor="background"
                          borderColor="border"
                          borderRadius="sm"
                          borderWidth={1}
                          padding="md"
                          gap="xxs">
                          <Box flexDirection="row" justifyContent="space-between" gap="sm">
                            <Box flex={1} gap="xxs">
                              <Text style={{ fontSize: 14, fontWeight: '900' }} numberOfLines={1}>
                                {activity.activityName}
                              </Text>
                              <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }} numberOfLines={1}>
                                {activity.daycareActivityId ? masterActivityMap.get(activity.daycareActivityId)?.name ?? 'Dari master activity' : 'Aktivitas manual'}
                              </Text>
                            </Box>
                            <Box alignItems="flex-end" gap="xxs">
                              <Text style={{ fontSize: 13, fontWeight: '800' }}>
                                {activity.startTime} - {activity.endTime}
                              </Text>
                              <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }}>
                                {formatDuration(String(activity.duration ?? ''))}
                              </Text>
                            </Box>
                          </Box>
                          <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="sm">
                            <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }}>
                              {(categoryLabelMap.get(activity.category.toUpperCase()) ?? activity.category)} · {sitterRoleLabel((activity.defaultSitterRole ?? 'ANY') as TemplateActivityFormValue['defaultSitterRole'])}
                            </Text>
                            <Box flexDirection="row" gap="sm" alignItems="center">
                              <Pressable
                                accessibilityRole="button"
                                disabled={saving || index === 0}
                                onPress={() => void onMoveActivity(index, 'up')}
                              >
                                <MaterialCommunityIcons
                                  name="chevron-up"
                                  size={20}
                                  color={saving || index === 0 ? appTheme.colors.textSecondary : appTheme.colors.primary}
                                />
                              </Pressable>
                              <Pressable
                                accessibilityRole="button"
                                disabled={saving || index === template.activities.length - 1}
                                onPress={() => void onMoveActivity(index, 'down')}
                              >
                                <MaterialCommunityIcons
                                  name="chevron-down"
                                  size={20}
                                  color={saving || index === template.activities.length - 1 ? appTheme.colors.textSecondary : appTheme.colors.primary}
                                />
                              </Pressable>
                              <Pressable accessibilityRole="button" disabled={saving} onPress={() => onEditActivity(index)}>
                                <Text style={{ color: appTheme.colors.primary, fontSize: 12, fontWeight: '800' }}>Ubah</Text>
                              </Pressable>
                              <Pressable accessibilityRole="button" disabled={saving} onPress={() => void onDeleteActivity(index)}>
                                <Text style={{ color: appTheme.colors.danger, fontSize: 12, fontWeight: '800' }}>Hapus</Text>
                              </Pressable>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type TemplateActivityEditorModalProps = {
  visible: boolean;
  saving: boolean;
  value: TemplateActivityFormValue;
  errors: TemplateActivityFormErrors;
  masterActivities: MasterActivity[];
  categories: ResolvedActivityCategory[];
  editing: boolean;
  onClose: () => void;
  onChange: (value: TemplateActivityFormValue) => void;
  onChooseSource: (masterActivityId: string) => void;
  onSubmit: () => void;
};

function TemplateActivityEditorModal({
  visible,
  saving,
  value,
  errors,
  masterActivities,
  categories,
  editing,
  onClose,
  onChange,
  onChooseSource,
  onSubmit,
}: TemplateActivityEditorModalProps) {
  const appTheme = useAppTheme();
  const categoryLabelMap = useMemo(
    () => new Map(categories.map((category) => [category.code.toUpperCase(), category.label])),
    [categories],
  );
  const sourceOptions = useMemo(
    () =>
      masterActivities.map((activity) => ({
        label: activity.name,
        value: activity.id,
        description: `${categoryLabelMap.get(activity.category.toUpperCase()) ?? activity.category} · ${activity.defaultDuration} menit`,
      })),
    [masterActivities, categoryLabelMap],
  );
  const selectedActivity = useMemo(
    () => masterActivities.find((activity) => activity.id === value.daycareActivityId) ?? null,
    [masterActivities, value.daycareActivityId],
  );

  const roleOptions: SearchableSelectOption[] = [
    { label: 'Bebas', value: 'ANY', description: 'Bisa dipilih siapa saja.' },
    { label: 'Senior Sitter', value: 'SENIOR_SITTER', description: 'Prioritas sitter senior.' },
    { label: 'Junior Sitter', value: 'JUNIOR_SITTER', description: 'Prioritas sitter junior.' },
  ];

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={{ alignItems: 'center', backgroundColor: appTheme.colors.backdrop, flex: 1, justifyContent: 'center', padding: 24 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Tutup aktivitas" onPress={onClose} style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }} />
          <View style={{ backgroundColor: appTheme.colors.surface, borderColor: appTheme.colors.border, borderRadius: 8, borderWidth: 1, maxWidth: 680, width: '100%' }}>
            <Box borderColor="border" paddingHorizontal="lg" paddingVertical="md" style={{ borderBottomWidth: 1 }}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="md">
                <Box flex={1} gap="xxs">
                  <Text style={{ fontSize: 20, fontWeight: '900' }}>{editing ? 'Ubah Aktivitas' : 'Tambah Aktivitas'}</Text>
                  <Text color="textSecondary">Atur detail aktivitas yang dipakai template.</Text>
                </Box>
                <Pressable accessibilityRole="button" accessibilityLabel="Tutup aktivitas" onPress={onClose}>
                  <Box alignItems="center" borderRadius="sm" borderWidth={1} borderColor="border" justifyContent="center" style={{ height: 38, width: 38 }}>
                    <MaterialCommunityIcons name="close" size={22} color={appTheme.colors.textSecondary} />
                  </Box>
                </Pressable>
              </Box>
            </Box>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, padding: 18, paddingBottom: 22 }}>
              <FieldShell label="Aktivitas" required error={errors.daycareActivityId} helperText="Pilih aktivitas yang sudah didefinisikan. Nama, kategori, dan durasi mengikuti master activity.">
                <ActivitySourceSelectInput
                  value={value.daycareActivityId}
                  activities={masterActivities}
                  categoryLabelMap={categoryLabelMap}
                  placeholder="Pilih aktivitas"
                  title="Pilih aktivitas"
                  searchPlaceholder="Cari aktivitas..."
                  emptyText="Belum ada aktivitas master."
                  disabled={saving}
                  onChange={onChooseSource}
                />
              </FieldShell>

              <Box backgroundColor="background" borderColor="border" borderRadius="sm" borderWidth={1} padding="md" gap="xxs">
                <Text style={{ color: appTheme.colors.textSecondary, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>Detail aktivitas</Text>
                <Text style={{ fontSize: 14, fontWeight: '900' }}>
                  {(selectedActivity?.name ?? value.activityName.trim()) || 'Pilih aktivitas terlebih dulu'}
                </Text>
                <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }}>
                  {selectedActivity
                    ? `${categoryLabelMap.get(selectedActivity.category.toUpperCase()) ?? selectedActivity.category} · Durasi default ${selectedActivity.defaultDuration} menit`
                    : value.category
                      ? `${categoryLabelMap.get(value.category.toUpperCase()) ?? value.category} · Durasi ${value.duration || '-'} menit`
                      : 'Nama, kategori, dan durasi akan terisi otomatis dari activity master.'}
                </Text>
              </Box>

              <Box flexDirection="row" gap="md">
                <FieldShell label="Jam mulai" required error={errors.startTime} style={{ flex: 1 }}>
                  <TimePickerInput
                    value={value.startTime}
                    disabled={saving}
                    placeholder="Pilih jam"
                    title="Jam mulai"
                    error={errors.startTime}
                    onChange={(next) =>
                      onChange({
                        ...value,
                        startTime: next,
                        endTime: selectedActivity ? addMinutesToTime(next, selectedActivity.defaultDuration) : value.endTime,
                      })
                    }
                  />
                </FieldShell>
                <FieldShell label="Jam selesai" required error={errors.endTime} style={{ flex: 1 }}>
                  <TimePickerInput
                    value={value.endTime}
                    disabled={saving}
                    placeholder="Pilih jam"
                    title="Jam selesai"
                    error={errors.endTime}
                    onChange={(next) => onChange({ ...value, endTime: next })}
                  />
                </FieldShell>
              </Box>

              <FieldShell label="Role sitter" style={{ flex: 1 }}>
                <SearchableSelectInputBase
                  value={value.defaultSitterRole}
                  options={roleOptions}
                  disabled={saving}
                  placeholder="Pilih role sitter"
                  title="Pilih role sitter"
                  searchPlaceholder="Cari role sitter..."
                  emptyText="Tidak ada role."
                  onChange={(next) => onChange({ ...value, defaultSitterRole: next as TemplateActivityFormValue['defaultSitterRole'] })}
                />
              </FieldShell>

              {errors.submit ? <Text color="danger" style={{ fontSize: 12, fontWeight: '700' }}>{errors.submit}</Text> : null}

              <Box flexDirection="row" gap="sm" justifyContent="flex-end">
                <Pressable accessibilityRole="button" disabled={saving} onPress={onClose}>
                  <Box borderRadius="sm" borderWidth={1} borderColor="border" paddingHorizontal="lg" paddingVertical="md">
                    <Text style={{ fontWeight: '800' }}>Batal</Text>
                  </Box>
                </Pressable>
                <Pressable accessibilityRole="button" disabled={saving} onPress={() => void onSubmit()}>
                  <Box backgroundColor="primary" borderRadius="sm" paddingHorizontal="lg" paddingVertical="md">
                    <Text style={{ color: appTheme.colors.onPrimary, fontWeight: '900' }}>{saving ? 'Menyimpan...' : 'Simpan'}</Text>
                  </Box>
                </Pressable>
              </Box>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  const appTheme = useAppTheme();

  return (
    <Box backgroundColor="background" borderColor="border" borderRadius="sm" borderWidth={1} paddingHorizontal="md" paddingVertical="sm">
      <Text style={{ color: appTheme.colors.textSecondary, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '800', marginTop: 2 }}>{value}</Text>
    </Box>
  );
}
