import { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { FieldShell, TextField, useToast } from '@mami/ui';

import { ActivitySourceSelectInput } from '../../../components/molecules/ActivitySourceSelectInput';
import { TimePickerInput } from '../../../components/molecules/TimePickerInput';
import { addMinutesToTime } from '../../../components/molecules/time-utils';
import { SearchableSelectInputBase, type SearchableSelectOption } from '../../../components/molecules/SearchableSelectInputBase';
import { useSession } from '../../../providers/session-provider';
import { useDaycareLayoutMode } from '../../../services/desktop/layout';
import {
  deactivateScheduleTemplate,
  getScheduleTemplate,
  listMasterActivities,
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

const initialActivityFormValue: TemplateActivityFormValue = {
  daycareActivityId: '',
  activityName: '',
  category: '',
  startTime: '',
  endTime: '',
  duration: '',
  defaultSitterRole: 'ANY',
};

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

  const dayOptions = [
    { label: 'Min', longLabel: 'Minggu', value: 0 },
    { label: 'Sen', longLabel: 'Senin', value: 1 },
    { label: 'Sel', longLabel: 'Selasa', value: 2 },
    { label: 'Rab', longLabel: 'Rabu', value: 3 },
    { label: 'Kam', longLabel: 'Kamis', value: 4 },
    { label: 'Jum', longLabel: 'Jumat', value: 5 },
    { label: 'Sab', longLabel: 'Sabtu', value: 6 },
  ];

  return days
    .slice()
    .sort((left, right) => left - right)
    .map((day) => dayOptions.find((option) => option.value === day)?.longLabel ?? String(day))
    .join(', ');
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

function templateTypeIcon(type: string): React.ComponentProps<typeof MaterialCommunityIcons>['name'] {
  if (type === 'Default') return 'calendar-check';
  if (type === 'Tanggal tertentu') return 'calendar-range';
  return 'calendar-week';
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

export function DaycareTemplateDetailContainer({ templateId }: { templateId: string }) {
  const router = useRouter();
  const { isLoading, session } = useSession();
  const { showToast } = useToast();
  const appTheme = useAppTheme();
  const layoutMode = useDaycareLayoutMode();
  const isDesktop = layoutMode !== 'mobile';

  const [template, setTemplate] = useState<ScheduleTemplate | null>(null);
  const [masterActivities, setMasterActivities] = useState<MasterActivity[]>([]);
  const [activityCategories, setActivityCategories] = useState<ResolvedActivityCategory[]>([]);
  const [screenLoading, setScreenLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activityFormVisible, setActivityFormVisible] = useState(false);
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);
  const [activityFormValue, setActivityFormValue] = useState<TemplateActivityFormValue>(initialActivityFormValue);
  const [activityFormErrors, setActivityFormErrors] = useState<TemplateActivityFormErrors>({});

  const loadData = useCallback(async () => {
    if (!session?.daycareId) return;

    try {
      setScreenLoading(true);
      const [templateData, masterActivityData, categoryData] = await Promise.all([
        getScheduleTemplate(session.token, templateId),
        listMasterActivities(session.token, session.daycareId, true),
        getResolvedActivityCategories(session.token, session.daycareId),
      ]);
      setTemplate(templateData);
      setMasterActivities(masterActivityData);
      setActivityCategories(categoryData.filter((category) => category.enabled));
    } catch (nextError) {
      showToast({
        message: nextError instanceof Error ? nextError.message : 'Gagal memuat detail template.',
        tone: 'danger',
      });
    } finally {
      setScreenLoading(false);
    }
  }, [session?.daycareId, session?.token, showToast, templateId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const categoryLabelMap = useMemo(
    () => new Map(activityCategories.map((category) => [category.code.toUpperCase(), category.label])),
    [activityCategories],
  );
  const masterActivityMap = useMemo(
    () => new Map(masterActivities.map((activity) => [activity.id, activity])),
    [masterActivities],
  );
  const sortedActivities = useMemo(
    () =>
      template?.activities
        .map((activity, index) => ({ activity, index }))
        .sort((left, right) => left.activity.startTime.localeCompare(right.activity.startTime) || left.index - right.index) ?? [],
    [template?.activities],
  );

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const activeSession = session;

  function openAddActivity() {
    setEditingActivityIndex(null);
    setActivityFormValue(initialActivityFormValue);
    setActivityFormErrors({});
    setActivityFormVisible(true);
  }

  function openEditActivity(index: number) {
    if (!template) return;

    const activity = template.activities[index];
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

  function applySelectedMasterActivity(masterActivityId: string) {
    if (!masterActivityId) {
      setActivityFormValue((current) => ({ ...current, daycareActivityId: '' }));
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

  async function persistTemplateActivities(nextActivities: ScheduleTemplateActivityInput[]) {
    if (!template || !activeSession.token) return;

    const orderedActivities = [...nextActivities].sort(
      (left, right) => left.startTime.localeCompare(right.startTime) || left.activityName.localeCompare(right.activityName),
    );

    const updated = await updateScheduleTemplate(activeSession.token, template.id, {
      activities: orderedActivities,
    });

    setTemplate(updated);
    return updated;
  }

  async function saveActivity() {
    if (!template || !validateActivityForm()) return;

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
        ? [...template.activities, nextActivity]
        : template.activities.map((item, index) => (index === editingActivityIndex ? nextActivity : item));

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
    if (!template) return;

    try {
      setSaving(true);
      const nextActivities = template.activities.filter((_, currentIndex) => currentIndex !== index);
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

  async function deactivateTemplate() {
    if (!template) return;

    try {
      setSaving(true);
      const updated = await deactivateScheduleTemplate(activeSession.token, template.id);
      setTemplate(updated);
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

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView contentContainerStyle={{ gap: 18, padding: 24, paddingBottom: 48 }}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="lg">
          <Box flex={1} gap="sm">
            <Pressable accessibilityRole="button" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
              <Box alignItems="center" borderColor="border" borderRadius="sm" borderWidth={1} flexDirection="row" gap="xs" minHeight={36} paddingHorizontal="md">
                <MaterialCommunityIcons name="arrow-left" size={17} color={appTheme.colors.textSecondary} />
                <Text style={{ fontSize: 12, fontWeight: '900' }}>Kembali</Text>
              </Box>
            </Pressable>
            <Text style={{ color: appTheme.colors.textSecondary, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' }}>Template Aktivitas</Text>
            <Text style={{ color: appTheme.colors.textPrimary, fontSize: 28, fontWeight: '900', lineHeight: 34 }}>
              {template?.name ?? 'Detail Template'}
            </Text>
            <Text color="textSecondary" style={{ fontSize: 13, fontWeight: '700' }}>
              {template ? `${getTemplateKind(template)} · ${template.activities.length} aktivitas` : 'Detail template aktivitas.'}
            </Text>
          </Box>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable accessibilityRole="button" onPress={openAddActivity}>
              <Box alignItems="center" backgroundColor="primary" borderRadius="sm" flexDirection="row" gap="xs" minHeight={42} paddingHorizontal="lg">
                <MaterialCommunityIcons name="plus" size={18} color={appTheme.colors.onPrimary} />
                <Text style={{ color: appTheme.colors.onPrimary, fontSize: 13, fontWeight: '900' }}>Tambah Aktivitas</Text>
              </Box>
            </Pressable>
            <Pressable accessibilityRole="button" disabled={saving || !template?.active} onPress={() => void deactivateTemplate()}>
              <Box
                alignItems="center"
                backgroundColor={template?.active ? 'surface' : 'background'}
                borderColor={template?.active ? 'danger' : 'border'}
                borderRadius="sm"
                borderWidth={1}
                flexDirection="row"
                gap="xs"
                minHeight={42}
                paddingHorizontal="lg"
              >
                <MaterialCommunityIcons name="archive-remove-outline" size={18} color={template?.active ? appTheme.colors.danger : appTheme.colors.textSecondary} />
                <Text style={{ color: template?.active ? appTheme.colors.danger : appTheme.colors.textSecondary, fontSize: 13, fontWeight: '900' }}>
                  Nonaktifkan
                </Text>
              </Box>
            </Pressable>
          </View>
        </Box>

        {screenLoading ? (
          <Box padding="lg">
            <Text color="textSecondary">Memuat detail template...</Text>
          </Box>
        ) : null}

        {!screenLoading && !template ? (
          <Box backgroundColor="surface" borderColor="border" borderRadius="sm" borderWidth={1} padding="lg">
            <Text style={{ fontSize: 14, fontWeight: '800' }}>Template tidak ditemukan.</Text>
          </Box>
        ) : null}

        {template ? (
          <>
            <Box flexDirection="row" flexWrap="wrap" gap="sm">
              <InfoPill label="Tipe" value={getTemplateKind(template)} />
              <InfoPill label="Jadwal" value={getTemplateScheduleText(template)} />
              <InfoPill label="Status" value={template.active ? 'Aktif' : 'Nonaktif'} />
            </Box>

            <Box backgroundColor="surface" borderColor="border" borderRadius="sm" borderWidth={1} style={{ overflow: 'hidden' }}>
              <Box borderColor="border" paddingHorizontal="lg" paddingVertical="md" style={{ borderBottomWidth: 1 }}>
                <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="md">
                  <Box gap="xxs">
                    <Text style={{ fontSize: 16, fontWeight: '900' }}>Aktivitas</Text>
                    <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '700' }}>
                      Kelola isi template dari halaman detail ini.
                    </Text>
                  </Box>
                  <Text color="textSecondary" style={{ fontSize: 12, fontWeight: '800' }}>
                    {template.activities.length} item
                  </Text>
                </Box>
              </Box>

              {isDesktop ? (
                <View style={styles.tablePanel}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableHeadText, styles.activityColumn]}>Aktivitas</Text>
                    <Text style={[styles.tableHeadText, styles.scheduleColumn]}>Jadwal</Text>
                    <Text style={[styles.tableHeadText, styles.categoryColumn]}>Kategori</Text>
                    <Text style={[styles.tableHeadText, styles.sitterColumn]}>Role</Text>
                    <Text style={[styles.tableHeadText, styles.actionsHeaderColumn]}>Aksi</Text>
                  </View>

                  {template.activities.length === 0 ? (
                    <View style={styles.emptyTableState}>
                      <MaterialCommunityIcons name="calendar-blank-outline" size={28} color="#94A3B8" />
                      <Text style={styles.emptyTitle}>Template ini belum punya aktivitas.</Text>
                      <Text style={styles.emptyMeta}>Tambahkan aktivitas untuk membangun jadwal template.</Text>
                    </View>
                  ) : (
                    sortedActivities.map(({ activity, index }) => {
                      const sourceLabel = activity.daycareActivityId
                        ? masterActivityMap.get(activity.daycareActivityId)?.name ?? 'Dari master activity'
                        : 'Aktivitas manual';
                      const categoryText = categoryLabelMap.get(activity.category.toUpperCase()) ?? activity.category;
                      const sitterLabel = sitterRoleLabel((activity.defaultSitterRole ?? 'ANY') as TemplateActivityFormValue['defaultSitterRole']);

                      return (
                        <View key={`${activity.activityName}-${activity.startTime}-${index}`} style={styles.tableRow}>
                          <View style={styles.activityColumn}>
                            <Text numberOfLines={1} style={styles.activityName}>{activity.activityName}</Text>
                            <Text numberOfLines={1} style={styles.activityMeta}>{sourceLabel}</Text>
                          </View>
                          <View style={styles.scheduleColumn}>
                            <Text numberOfLines={1} style={styles.tableCellText}>
                              {activity.startTime} - {activity.endTime}
                            </Text>
                            <Text numberOfLines={1} style={styles.activityMeta}>{formatDuration(String(activity.duration ?? ''))}</Text>
                          </View>
                          <View style={styles.categoryColumn}>
                            <View style={styles.categoryPill}>
                              <Text numberOfLines={1} style={styles.categoryPillText}>{categoryText}</Text>
                            </View>
                          </View>
                          <Text numberOfLines={1} style={[styles.tableCellText, styles.sitterColumn]}>{sitterLabel}</Text>
                          <View style={styles.actionsColumn}>
                            <Pressable accessibilityRole="button" disabled={saving} onPress={() => openEditActivity(index)} style={styles.actionButton}>
                              <MaterialCommunityIcons name="pencil-outline" size={16} color={appTheme.colors.primary} />
                              <Text style={styles.actionButtonText}>Ubah</Text>
                            </Pressable>
                            <Pressable accessibilityRole="button" disabled={saving} onPress={() => void deleteActivity(index)} style={styles.dangerActionButton}>
                              <MaterialCommunityIcons name="trash-can-outline" size={16} color={appTheme.colors.danger} />
                              <Text style={styles.dangerActionButtonText}>Hapus</Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              ) : (
                <Box padding="lg" gap="sm">
                  {template.activities.length === 0 ? (
                    <Box backgroundColor="background" borderColor="border" borderRadius="sm" borderWidth={1} padding="lg">
                      <Text color="textSecondary" style={{ fontSize: 13, fontWeight: '700' }}>
                        Template ini belum punya aktivitas.
                      </Text>
                    </Box>
                  ) : (
                    sortedActivities.map(({ activity, index }) => (
                      <Box
                        key={`${activity.activityName}-${activity.startTime}-${index}`}
                        backgroundColor="background"
                        borderColor="border"
                        borderRadius="sm"
                        borderWidth={1}
                        padding="md"
                        gap="xxs"
                      >
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
                            <Pressable accessibilityRole="button" disabled={saving} onPress={() => openEditActivity(index)}>
                              <Text style={{ color: appTheme.colors.primary, fontSize: 12, fontWeight: '800' }}>Ubah</Text>
                            </Pressable>
                            <Pressable accessibilityRole="button" disabled={saving} onPress={() => void deleteActivity(index)}>
                              <Text style={{ color: appTheme.colors.danger, fontSize: 12, fontWeight: '800' }}>Hapus</Text>
                            </Pressable>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </Box>
          </>
        ) : null}
      </ScrollView>

      <TemplateActivityEditorModal
        visible={activityFormVisible}
        saving={saving}
        value={activityFormValue}
        errors={activityFormErrors}
        masterActivities={masterActivities}
        categoryLabelMap={categoryLabelMap}
        editing={editingActivityIndex !== null}
        onClose={closeActivityForm}
        onChange={setActivityFormValue}
        onChooseSource={applySelectedMasterActivity}
        onSubmit={saveActivity}
      />
    </Box>
  );
}

type TemplateActivityEditorModalProps = {
  visible: boolean;
  saving: boolean;
  value: TemplateActivityFormValue;
  errors: TemplateActivityFormErrors;
  masterActivities: MasterActivity[];
  categoryLabelMap: Map<string, string>;
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
  categoryLabelMap,
  editing,
  onClose,
  onChange,
  onChooseSource,
  onSubmit,
}: TemplateActivityEditorModalProps) {
  const appTheme = useAppTheme();
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
                  placeholder="Pilih role sitter"
                  title="Pilih role sitter"
                  searchPlaceholder="Cari role..."
                  disabled={saving}
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

const styles = StyleSheet.create({
  tablePanel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableRow: {
    alignItems: 'center',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 12,
  },
  tableHeader: {
    backgroundColor: '#F8FAFC',
    minHeight: 42,
  },
  tableHeadText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  tableCellText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  activityColumn: {
    flex: 1.5,
    minWidth: 220,
  },
  scheduleColumn: {
    flex: 1,
    minWidth: 150,
  },
  categoryColumn: {
    flex: 0.85,
    minWidth: 130,
  },
  sitterColumn: {
    flex: 0.75,
    minWidth: 110,
  },
  actionsHeaderColumn: {
    flex: 0,
    flexBasis: 270,
    minWidth: 270,
    textAlign: 'right',
    width: 270,
  },
  actionsColumn: {
    alignItems: 'center',
    flex: 0,
    flexBasis: 270,
    flexDirection: 'row',
    flexGrow: 0,
    flexShrink: 0,
    gap: 8,
    justifyContent: 'flex-end',
    minWidth: 270,
    width: 270,
  },
  emptyTableState: {
    alignItems: 'center',
    gap: 6,
    minHeight: 132,
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  emptyMeta: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  activityName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 20,
  },
  activityMeta: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
    marginTop: 2,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryPillText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  iconActionButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  iconActionButtonDisabled: {
    opacity: 0.55,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    height: 34,
    justifyContent: 'center',
    minWidth: 76,
    paddingHorizontal: 10,
  },
  dangerActionButton: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    height: 34,
    justifyContent: 'center',
    minWidth: 84,
    paddingHorizontal: 10,
  },
  actionButtonText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  dangerActionButtonText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
});
