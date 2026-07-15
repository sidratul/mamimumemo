import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import {
  Button,
  DetailScreen,
  FabButton,
  FieldShell,
  TextAreaField,
  TextField,
  useConfirm,
  useToast,
  type SelectOption,
} from '@mami/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Box, Text } from '../../../theme/theme';
import { useSession } from '../../../providers/session-provider';
import { useDaycareLayoutMode } from '../../../services/desktop/layout';
import {
  createMasterActivity,
  deactivateMasterActivity,
  listMasterActivities,
  updateMasterActivity,
  type MasterActivity,
} from '../../../services/operations/master-activities';
import { MasterActivityFormDrawer, type MasterActivityFormValue } from './master-activity-form-drawer';
import {
  getResolvedActivityCategories,
  type ResolvedActivityCategory,
} from '../../../services/operations/daycare-config';
import {
  initialMasterActivityFormValue,
  masterActivityFormSchema,
  normalizeMasterActivityCategory,
} from './master-activity-form.schema';

export function MasterActivitiesContainer() {
  const router = useRouter();
  const { isLoading, session } = useSession();
  const layoutMode = useDaycareLayoutMode();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  const [activities, setActivities] = useState<MasterActivity[]>([]);
  const [categories, setCategories] = useState<ResolvedActivityCategory[]>([]);
  const [screenLoading, setScreenLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<MasterActivity | null>(null);
  const [formValue, setFormValue] = useState<MasterActivityFormValue>(initialMasterActivityFormValue);

  useEffect(() => {
    async function run() {
      if (!session?.daycareId) {
        setScreenLoading(false);
        return;
      }

      try {
        setScreenLoading(true);
        const [activityData, categoryData] = await Promise.all([
          listMasterActivities(session.token, session.daycareId, true),
          getResolvedActivityCategories(session.token, session.daycareId),
        ]);
        setActivities(activityData);
        setCategories(categoryData.filter((category) => category.enabled));
      } catch (error) {
        showToast({
          message: error instanceof Error ? error.message : 'Gagal memuat master activity.',
          tone: 'danger',
        });
      } finally {
        setScreenLoading(false);
      }
    }

    void run();
  }, [session?.daycareId, session?.token, showToast]);

  const sortedActivities = useMemo(
    () => [...activities].sort((left, right) => left.name.localeCompare(right.name)),
    [activities]
  );
  const categoryOptions = categories.map((category) => ({
    label: category.label,
    value: category.code,
  }));
  const categoryLabels = new Map(
    categories.map((category) => [category.code, category.label]),
  );
  const getCategoryLabel = (category: string) =>
    categoryLabels.get(category.toUpperCase()) ?? category;

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }
  const activeSession = session;

  function openCreateDrawer() {
    setEditingActivity(null);
    setFormValue({
      ...initialMasterActivityFormValue,
      category: categoryOptions[0]?.value ?? '',
    });
    setDrawerVisible(true);
  }

  function openEditDrawer(activity: MasterActivity) {
    setEditingActivity(activity);
    setFormValue({
      name: activity.name,
      description: activity.description ?? '',
      category: activity.category,
      defaultDuration: String(activity.defaultDuration || 30),
    });
    setDrawerVisible(true);
  }

  function closeDrawer() {
    setDrawerVisible(false);
    setEditingActivity(null);
    setFormValue(initialMasterActivityFormValue);
  }

  async function handleSubmit(value: MasterActivityFormValue) {
    if (!activeSession.daycareId) {
      showToast({
        message: 'Daycare belum terhubung ke akun ini.',
        tone: 'danger',
      });
      return;
    }

    const duration = Number(value.defaultDuration);

    try {
      setSaving(true);
      setFormValue(value);

      if (editingActivity) {
        const updated = await updateMasterActivity(activeSession.token, editingActivity.id, {
          name: value.name.trim(),
          description: value.description?.trim() || '',
          category: normalizeMasterActivityCategory(value.category),
          defaultDuration: duration,
        });

        setActivities((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        showToast({ message: 'Aktivitas berhasil diperbarui.', tone: 'success' });
      } else {
        const created = await createMasterActivity(activeSession.token, {
          daycareId: activeSession.daycareId,
          name: value.name.trim(),
          description: value.description?.trim() || '',
          category: normalizeMasterActivityCategory(value.category),
          defaultDuration: duration,
        });

        setActivities((current) => [created, ...current]);
        showToast({ message: 'Aktivitas berhasil dibuat.', tone: 'success' });
      }

      closeDrawer();
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Gagal menyimpan aktivitas.',
        tone: 'danger',
      });
    } finally {
      setSaving(false);
    }
  }

  function handleDeactivate(activity: MasterActivity) {
    showConfirm({
      title: 'Nonaktifkan aktivitas',
      description: `Aktivitas "${activity.name}" akan dihapus dari daftar aktif.`,
      confirmLabel: 'Nonaktifkan',
      cancelLabel: 'Batal',
      onConfirm: async () => {
        try {
          const updated = await deactivateMasterActivity(activeSession.token, activity.id);
          setActivities((current) => current.filter((item) => item.id !== updated.id));
          showToast({ message: 'Aktivitas dinonaktifkan.', tone: 'success' });
        } catch (error) {
          showToast({
            message: error instanceof Error ? error.message : 'Gagal menonaktifkan aktivitas.',
            tone: 'danger',
          });
        }
      },
    });
  }

  if (layoutMode !== 'mobile') {
    return (
      <DesktopMasterActivitiesView
        activities={sortedActivities}
        categoryLabel={getCategoryLabel}
        editingActivity={editingActivity}
        formValue={formValue}
        loading={screenLoading}
        saving={saving}
        drawerVisible={drawerVisible}
        categoryOptions={categoryOptions}
        onCreate={openCreateDrawer}
        onEdit={openEditDrawer}
        onDeactivate={handleDeactivate}
        onCloseDrawer={closeDrawer}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <DetailScreen title="Aktivitas" onBack={() => router.back()} backgroundColor="#FFFFFF">
      {screenLoading ? (
        <Text variant="bodySmall" color="textSecondary">Memuat aktivitas...</Text>
      ) : null}

      {!screenLoading && sortedActivities.length === 0 ? (
        <Box padding="md" borderRadius="xl" style={{ borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text variant="bodySmall" color="textSecondary">
            Belum ada aktivitas aktif.
          </Text>
        </Box>
      ) : null}

      <Box gap="sm">
        {sortedActivities.map((activity) => (
          <Box
            key={activity.id}
            padding="md"
            borderRadius="xl"
            gap="sm"
            style={{ borderWidth: 1, borderColor: '#E2E8F0' }}
          >
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="sm">
              <Box flex={1} gap="xxs">
                <Text fontWeight="800" color="textPrimary">{activity.name}</Text>
                <Text variant="bodySmall" color="textSecondary">
                  {getCategoryLabel(activity.category)} · {activity.defaultDuration} menit
                </Text>
              </Box>
              <Box
                paddingHorizontal="sm"
                paddingVertical="xxs"
                borderRadius="full"
                style={{ backgroundColor: '#EEF2FF' }}
              >
                <Text variant="bodySmall" color="primary" fontWeight="800">
                  {getCategoryLabel(activity.category)}
                </Text>
              </Box>
            </Box>

            <Box flexDirection="row" gap="sm">
              <Button label="Ubah" variant="secondary" onPress={() => openEditDrawer(activity)} style={{ flex: 1, borderRadius: 14 }} />
              <Button label="Nonaktifkan" variant="danger" onPress={() => handleDeactivate(activity)} style={{ flex: 1, borderRadius: 14 }} />
            </Box>
          </Box>
        ))}
      </Box>

      <FabButton icon="plus" onPress={openCreateDrawer} />

      <MasterActivityFormDrawer
        visible={drawerVisible}
        value={formValue}
        editingActivity={editingActivity}
        loading={saving}
        categoryOptions={categoryOptions}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
      />
    </DetailScreen>
  );
}

type DesktopMasterActivitiesViewProps = {
  activities: MasterActivity[];
  categoryLabel: (category: string) => string;
  editingActivity: MasterActivity | null;
  formValue: MasterActivityFormValue;
  loading: boolean;
  saving: boolean;
  drawerVisible: boolean;
  categoryOptions: { label: string; value: string }[];
  onCreate: () => void;
  onEdit: (activity: MasterActivity) => void;
  onDeactivate: (activity: MasterActivity) => void;
  onCloseDrawer: () => void;
  onSubmit: (value: MasterActivityFormValue) => void | Promise<void>;
};

function DesktopMasterActivitiesView({
  activities,
  categoryLabel,
  editingActivity,
  formValue,
  loading,
  saving,
  drawerVisible,
  categoryOptions,
  onCreate,
  onEdit,
  onDeactivate,
  onCloseDrawer,
  onSubmit,
}: DesktopMasterActivitiesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredActivities = useMemo(
    () =>
      activities.filter((activity) => {
        const matchesCategory = categoryFilter === 'ALL' || activity.category === categoryFilter;

        if (!matchesCategory) {
          return false;
        }

        if (normalizedSearch) {
            const sourceLabel = activity.sourceMasterActivityId ? 'katalog' : 'daycare';
            const searchableText = [
              activity.name,
              activity.description ?? '',
              activity.category,
              categoryLabel(activity.category),
              sourceLabel,
            ]
              .join(' ')
              .toLowerCase();

            return searchableText.includes(normalizedSearch);
        }

        return true;
      }),
    [activities, categoryFilter, categoryLabel, normalizedSearch],
  );
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const visibleActivities = filteredActivities.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, normalizedSearch]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <SafeAreaView style={styles.desktopRoot} edges={['top', 'right']}>
      <ScrollView contentContainerStyle={styles.desktopScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopHeader}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Aktivitas Daycare</Text>
            <Text style={styles.title}>Master aktivitas</Text>
            <Text style={styles.subtitle}>
              Kelola aktivitas yang dipakai untuk template, jadwal, dan daily care.
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" onPress={onCreate} style={styles.primaryButton}>
              <MaterialCommunityIcons name="plus" size={19} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Buat Aktivitas</Text>
            </Pressable>
          </View>
        </View>

        {loading ? <Text style={styles.loadingText}>Memuat aktivitas...</Text> : null}

        <View style={styles.tableTools}>
          <View style={styles.searchFieldWrap}>
            <MaterialCommunityIcons name="magnify" size={21} color="#475569" />
            <TextInput
              value={searchQuery}
              placeholder="Cari aktivitas"
              placeholderTextColor="#94A3B8"
              onChangeText={setSearchQuery}
              style={styles.searchNativeInput}
            />
            {searchQuery ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bersihkan pencarian"
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                <MaterialCommunityIcons name="close" size={17} color="#64748B" />
              </Pressable>
            ) : null}
          </View>

          <CategorySelect
            value={categoryFilter}
            options={[{ label: 'Semua kategori', value: 'ALL' }, ...categoryOptions]}
            compact
            placeholder="Kategori"
            onChange={setCategoryFilter}
          />
        </View>

        <View style={styles.tablePanel}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeadText, styles.nameColumn]}>Nama</Text>
            <Text style={[styles.tableHeadText, styles.categoryColumn]}>Kategori</Text>
            <Text style={[styles.tableHeadText, styles.durationColumn]}>Durasi</Text>
            <Text style={[styles.tableHeadText, styles.sourceColumn]}>Sumber</Text>
            <Text style={[styles.tableHeadText, styles.actionsHeaderColumn]}>Aksi</Text>
          </View>

          {!loading && visibleActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={28} color="#94A3B8" />
              <Text style={styles.emptyTitle}>
                {activities.length === 0 ? 'Belum ada aktivitas aktif.' : 'Aktivitas tidak ditemukan.'}
              </Text>
              <Text style={styles.emptyMeta}>
                {activities.length === 0 ? 'Buat aktivitas baru untuk daycare ini.' : 'Coba ubah kata kunci pencarian.'}
              </Text>
            </View>
          ) : null}

          {visibleActivities.map((activity) => (
            <View key={activity.id} style={styles.tableRow}>
              <View style={styles.nameColumn}>
                <Text numberOfLines={1} style={styles.activityName}>{activity.name}</Text>
                <Text numberOfLines={1} style={styles.activityMeta}>
                  {activity.description?.trim() || 'Tidak ada deskripsi'}
                </Text>
              </View>
              <View style={styles.categoryColumn}>
                <View style={styles.categoryPill}>
                  <Text numberOfLines={1} style={styles.categoryPillText}>{categoryLabel(activity.category)}</Text>
                </View>
              </View>
              <Text style={[styles.tableCellText, styles.durationColumn]}>{activity.defaultDuration} menit</Text>
              <Text style={[styles.tableCellText, styles.sourceColumn]}>
                {activity.sourceMasterActivityId ? 'Katalog' : 'Daycare'}
              </Text>
              <View style={styles.actionsColumn}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Ubah ${activity.name}`}
                  onPress={() => onEdit(activity)}
                  style={[styles.actionButton, styles.editButton]}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={17} color="#334155" />
                  <Text numberOfLines={1} style={styles.actionButtonText}>Ubah</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Nonaktifkan ${activity.name}`}
                  onPress={() => onDeactivate(activity)}
                  style={[styles.actionButton, styles.dangerButton]}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={17} color="#B91C1C" />
                  <Text numberOfLines={1} style={styles.dangerButtonText}>Nonaktifkan</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View style={styles.paginationBar}>
            <Text style={styles.paginationMeta}>
              {filteredActivities.length === 0 ? '0 aktivitas' : `${pageStart + 1}-${Math.min(pageEnd, filteredActivities.length)} dari ${filteredActivities.length}`}
            </Text>
            <View style={styles.paginationActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Halaman sebelumnya"
                disabled={safePage <= 1}
                onPress={() => setPage((current) => Math.max(1, current - 1))}
                style={[styles.pageButton, safePage <= 1 ? styles.pageButtonDisabled : null]}
              >
                <MaterialCommunityIcons name="chevron-left" size={18} color={safePage <= 1 ? '#CBD5E1' : '#334155'} />
              </Pressable>
              <Text style={styles.pageIndicator}>
                {safePage} / {totalPages}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Halaman berikutnya"
                disabled={safePage >= totalPages}
                onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                style={[styles.pageButton, safePage >= totalPages ? styles.pageButtonDisabled : null]}
              >
                <MaterialCommunityIcons name="chevron-right" size={18} color={safePage >= totalPages ? '#CBD5E1' : '#334155'} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={drawerVisible} transparent animationType="fade" onRequestClose={onCloseDrawer}>
        <View style={styles.modalOverlay}>
          <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onCloseDrawer} style={styles.modalBackdrop} />
          <View style={styles.formPanel}>
            <View style={styles.formPanelHeader}>
              <View style={styles.formPanelTitleWrap}>
                <Text style={styles.formPanelTitle}>
                  {editingActivity ? 'Ubah Aktivitas' : 'Buat Aktivitas'}
                </Text>
                <Text style={styles.formPanelSubtitle}>
                  Aktivitas ini tersedia untuk template dan daily care.
                </Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onCloseDrawer} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formPanelScroll}>
              <DesktopMasterActivityForm
                value={formValue}
                saving={saving}
                editing={Boolean(editingActivity)}
                categoryOptions={categoryOptions}
                onCancel={onCloseDrawer}
                onSubmit={onSubmit}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

type DesktopMasterActivityFormProps = {
  value: MasterActivityFormValue;
  saving: boolean;
  editing: boolean;
  categoryOptions: SelectOption[];
  onCancel: () => void;
  onSubmit: (value: MasterActivityFormValue) => void | Promise<void>;
};

type CategorySelectProps = {
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  compact?: boolean;
  onChange: (value: string) => void;
};

function CategorySelect({
  value,
  options,
  placeholder = 'Pilih kategori',
  disabled,
  error,
  compact,
  onChange,
}: CategorySelectProps) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={[styles.categorySelectWrap, compact ? styles.categorySelectWrapCompact : null]}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: visible, disabled }}
          disabled={disabled}
          onPress={() => setVisible((current) => !current)}
          style={[
            compact ? styles.categorySelectCompact : styles.categorySelect,
            error ? styles.categorySelectError : null,
            disabled ? styles.disabledButton : null,
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              compact ? styles.categorySelectCompactText : styles.categorySelectText,
              selected ? null : styles.categorySelectPlaceholder,
            ]}
          >
            {selected?.label ?? placeholder}
          </Text>
          <MaterialCommunityIcons name={visible ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
        </Pressable>

      {visible ? (
        <View style={[styles.categoryDropdown, compact ? styles.categoryDropdownCompact : null]}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator
            style={styles.categoryDropdownScroller}
            contentContainerStyle={styles.categoryDropdownScroll}
          >
            {options.map((option) => {
              const active = option.value === value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    onChange(option.value);
                    setVisible(false);
                  }}
                  style={[styles.categoryDropdownItem, active ? styles.categoryDropdownItemActive : null]}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.categoryDropdownItemText, active ? styles.categoryDropdownItemTextActive : null]}
                  >
                    {option.label}
                  </Text>
                  {active ? <MaterialCommunityIcons name="check" size={17} color="#4F46E5" /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function DesktopMasterActivityForm({
  value,
  saving,
  editing,
  categoryOptions,
  onCancel,
  onSubmit,
}: DesktopMasterActivityFormProps) {
  const formik = useFormik<MasterActivityFormValue>({
    initialValues: value,
    enableReinitialize: true,
    validate: (values) => {
      const result = masterActivityFormSchema.safeParse(values);

      if (result.success) {
        return {};
      }

      return result.error.issues.reduce<Partial<Record<keyof MasterActivityFormValue, string>>>(
        (errors, issue) => {
          const field = issue.path[0];

          if (field === 'name' || field === 'description' || field === 'category' || field === 'defaultDuration') {
            errors[field] = issue.message;
          }

          return errors;
        },
        {},
      );
    },
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const categoryError = formik.touched.category ? formik.errors.category : undefined;
  const nameError = formik.touched.name ? formik.errors.name : undefined;
  const durationError = formik.touched.defaultDuration ? formik.errors.defaultDuration : undefined;

  return (
    <View style={styles.desktopForm}>
      <FieldShell label="Kategori" required error={categoryError} style={styles.categoryFormField}>
        <CategorySelect
          value={formik.values.category}
          disabled={saving}
          options={categoryOptions}
          placeholder="Pilih kategori"
          error={categoryError}
          onChange={(nextValue) => {
            void formik.setFieldValue('category', nextValue);
            void formik.setFieldTouched('category', true, false);
          }}
        />
      </FieldShell>

      <View style={styles.formTwoColumns}>
        <FieldShell label="Nama Aktivitas" required error={nameError} style={styles.formColumn}>
          <TextField
            value={formik.values.name}
            disabled={saving}
            placeholder="Contoh: Circle Time Pagi"
            backgroundColor="#FFFFFF"
            borderRadius={8}
            useBottomSheetInput={false}
            onChange={(nextValue) => {
              void formik.setFieldValue('name', nextValue);
              void formik.setFieldTouched('name', true, false);
            }}
          />
        </FieldShell>

        <FieldShell label="Durasi" required helperText="Menit" error={durationError} style={styles.durationField}>
          <TextField
            value={formik.values.defaultDuration}
            disabled={saving}
            placeholder="30"
            keyboardType="numeric"
            backgroundColor="#FFFFFF"
            borderRadius={8}
            useBottomSheetInput={false}
            onChange={(nextValue) => {
              void formik.setFieldValue('defaultDuration', nextValue);
              void formik.setFieldTouched('defaultDuration', true, false);
            }}
          />
        </FieldShell>
      </View>

      <FieldShell label="Deskripsi">
        <TextAreaField
          value={formik.values.description}
          disabled={saving}
          placeholder="Opsional. Jelaskan aktivitas ini untuk staff daycare."
          backgroundColor="#FFFFFF"
          borderRadius={8}
          numberOfLines={3}
          useBottomSheetInput={false}
          onChange={(nextValue) => {
            void formik.setFieldValue('description', nextValue);
          }}
        />
      </FieldShell>

      <View style={styles.formActionsRow}>
        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={onCancel}
          style={[styles.cancelPanelButton, styles.formActionButton, saving ? styles.disabledButton : null]}
        >
          <Text style={styles.cancelPanelButtonText}>Batal</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={() => {
            void formik.submitForm();
          }}
          style={[styles.savePanelButton, styles.formActionButton, saving ? styles.disabledButton : null]}
        >
          <Text numberOfLines={1} style={styles.savePanelButtonText}>
            {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan Aktivitas'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopRoot: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  desktopScroll: {
    gap: 22,
    padding: 28,
    paddingBottom: 48,
  },
  desktopHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  title: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
    marginTop: 4,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  tableTools: {
    alignItems: 'center',
    elevation: 20,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-start',
    position: 'relative',
    zIndex: 100,
  },
  searchFieldWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 0,
    flexDirection: 'row',
    gap: 8,
    height: 42,
    width: 300,
    paddingLeft: 12,
    paddingRight: 6,
  },
  searchNativeInput: {
    color: '#0F172A',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    height: 40,
    lineHeight: 18,
    minWidth: 0,
    padding: 0,
  },
  clearSearchButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  categorySelectWrap: {
    elevation: 30,
    position: 'relative',
    zIndex: 300,
  },
  categorySelectWrapCompact: {
    flexShrink: 0,
    width: 190,
    zIndex: 300,
  },
  categorySelect: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  categorySelectCompact: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 42,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    width: 210,
  },
  categorySelectError: {
    borderColor: '#B91C1C',
  },
  categorySelectText: {
    color: '#0F172A',
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  categorySelectCompactText: {
    color: '#0F172A',
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  categorySelectPlaceholder: {
    color: '#94A3B8',
  },
  categoryDropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    marginTop: 6,
    padding: 4,
    position: 'absolute',
    right: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    top: 42,
    zIndex: 500,
  },
  categoryDropdownScroll: {
    gap: 2,
  },
  categoryDropdownScroller: {
    maxHeight: 220,
  },
  categoryDropdownCompact: {
    top: 44,
  },
  categoryDropdownItem: {
    alignItems: 'center',
    borderRadius: 7,
    flexDirection: 'row',
    gap: 8,
    minHeight: 36,
    paddingHorizontal: 10,
  },
  categoryDropdownItemActive: {
    backgroundColor: '#EEF2FF',
  },
  categoryDropdownItemText: {
    color: '#334155',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  categoryDropdownItemTextActive: {
    color: '#4F46E5',
    fontWeight: '900',
  },
  tablePanel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  tableRow: {
    alignItems: 'center',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 66,
    paddingHorizontal: 14,
  },
  tableHeader: {
    backgroundColor: '#F8FAFC',
    minHeight: 44,
  },
  tableHeadText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  tableCellText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  nameColumn: {
    flex: 1.6,
    minWidth: 220,
  },
  categoryColumn: {
    flex: 0.9,
    minWidth: 130,
  },
  durationColumn: {
    flex: 0.65,
    minWidth: 92,
  },
  sourceColumn: {
    flex: 0.65,
    minWidth: 86,
  },
  actionsColumn: {
    flex: 0,
    flexBasis: 300,
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    minWidth: 300,
    width: 300,
  },
  actionsHeaderColumn: {
    flex: 0,
    flexBasis: 300,
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 300,
    textAlign: 'right',
    width: 300,
  },
  activityName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 20,
  },
  activityMeta: {
    color: '#94A3B8',
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
  actionButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 10,
    width: 134,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  actionButtonText: {
    color: '#334155',
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  dangerButtonText: {
    color: '#B91C1C',
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    gap: 6,
    minHeight: 140,
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
  paginationBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 54,
    paddingHorizontal: 14,
  },
  paginationMeta: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  paginationActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pageButton: {
    alignItems: 'center',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  pageButtonDisabled: {
    backgroundColor: '#F8FAFC',
  },
  pageIndicator: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
    minWidth: 48,
    textAlign: 'center',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  formPanel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    maxHeight: '88%',
    padding: 18,
    maxWidth: 720,
    width: '100%',
    zIndex: 1,
  },
  formPanelScroll: {
    gap: 18,
    paddingBottom: 2,
  },
  formPanelHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  formPanelTitleWrap: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  formPanelTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
  formPanelSubtitle: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  closeButton: {
    alignItems: 'center',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  desktopForm: {
    gap: 16,
  },
  categoryFormField: {
    elevation: 30,
    position: 'relative',
    zIndex: 300,
  },
  formTwoColumns: {
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
    zIndex: 1,
  },
  formColumn: {
    flex: 1,
    minWidth: 0,
  },
  durationField: {
    width: 150,
  },
  formActionsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    paddingTop: 2,
  },
  formActionButton: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelPanelButton: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: 'center',
  },
  cancelPanelButtonText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  savePanelButton: {
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    minHeight: 42,
    justifyContent: 'center',
  },
  savePanelButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
});
