import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  DetailScreen,
  FieldShell,
  TextAreaField,
  TextField,
  useConfirm,
  useToast,
} from '@mami/ui';

import { OverlaySelect, type OverlaySelectOption } from '../../../components/molecules/OverlaySelect';
import { SimpleDateInput } from '../../../components/molecules/SimpleDateInput';
import { useSession } from '../../../providers/session-provider';
import { useDaycareLayoutMode } from '../../../services/desktop/layout';
import {
  createDaycareChild,
  deactivateDaycareChild,
  getDaycareRoster,
  purgeDaycareChild,
  type DaycareChild,
  type DaycareParent,
} from '../../../services/operations/daycare-roster';
import { Box, Text } from '../../../theme/theme';

type ChildFormValue = {
  parentId: string;
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  notes: string;
};

type ChildFormErrors = Partial<Record<keyof ChildFormValue | 'submit', string>>;

const initialFormValue: ChildFormValue = {
  parentId: '',
  name: '',
  birthDate: '',
  gender: 'MALE',
  notes: '',
};

const genderOptions: OverlaySelectOption[] = [
  { label: 'Laki-laki', value: 'MALE' },
  { label: 'Perempuan', value: 'FEMALE' },
];

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
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

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export default function DaycareChildrenScreen() {
  const { isLoading, session } = useSession();
  const layoutMode = useDaycareLayoutMode();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [children, setChildren] = useState<DaycareChild[]>([]);
  const [parents, setParents] = useState<DaycareParent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formValue, setFormValue] = useState<ChildFormValue>(initialFormValue);
  const [formErrors, setFormErrors] = useState<ChildFormErrors>({});

  useEffect(() => {
    async function run() {
      if (!session?.daycareId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const roster = await getDaycareRoster(session.token, session.daycareId);
        setChildren(roster.children);
        setParents(roster.parents);
      } catch (error) {
        showToast({
          message: error instanceof Error ? error.message : 'Gagal memuat data anak.',
          tone: 'danger',
        });
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [session?.daycareId, session?.token, showToast]);

  const parentById = useMemo(
    () => new Map(parents.map((parent) => [parent.id, parent])),
    [parents],
  );
  const parentOptions = parents.map((parent) => ({
    label: parent.user.name,
    value: parent.id,
  }));
  const sortedChildren = useMemo(
    () => [...children].sort((left, right) => left.profile.name.localeCompare(right.profile.name)),
    [children],
  );

  if (isLoading) return null;
  if (!session) return <Redirect href="/(auth)/login" />;
  const activeSession = session;

  function openCreateForm() {
    setFormValue({
      ...initialFormValue,
      parentId: parentOptions[0]?.value ?? '',
    });
    setFormErrors({});
    setFormVisible(true);
  }

  function closeForm() {
    setFormVisible(false);
    setFormValue(initialFormValue);
    setFormErrors({});
  }

  function updateForm<K extends keyof ChildFormValue>(key: K, value: ChildFormValue[K]) {
    setFormValue((current) => ({ ...current, [key]: value }));
    setFormErrors((current) => {
      const next = { ...current };
      delete next[key];
      delete next.submit;
      return next;
    });
  }

  function validateForm() {
    const nextErrors: ChildFormErrors = {};

    if (!formValue.parentId) nextErrors.parentId = 'Orang tua wajib dipilih.';
    if (!formValue.name.trim()) nextErrors.name = 'Nama anak wajib diisi.';
    if (!formValue.birthDate.trim()) nextErrors.birthDate = 'Tanggal lahir wajib diisi.';
    else if (!isValidSimpleDate(formValue.birthDate)) nextErrors.birthDate = 'Tanggal lahir harus valid.';
    if (!formValue.gender) nextErrors.gender = 'Gender wajib dipilih.';

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleCreate() {
    if (!activeSession.daycareId) {
      showToast({ message: 'Daycare belum terhubung ke akun ini.', tone: 'danger' });
      return;
    }

    if (!validateForm()) return;

    try {
      setSaving(true);
      const created = await createDaycareChild(activeSession.token, {
        daycareId: activeSession.daycareId,
        parentId: formValue.parentId,
        name: formValue.name,
        birthDate: birthDateInputToApiDate(formValue.birthDate),
        gender: formValue.gender,
        notes: formValue.notes,
      });
      setChildren((current) => [created, ...current]);
      setParents((current) =>
        current.map((parent) =>
          parent.id === formValue.parentId
            ? { ...parent, childrenIds: Array.from(new Set([...parent.childrenIds, created.id])) }
            : parent,
        ),
      );
      showToast({ message: 'Anak berhasil ditambahkan.', tone: 'success' });
      closeForm();
    } catch (error) {
      setFormErrors((current) => ({
        ...current,
        submit: error instanceof Error ? error.message : 'Gagal menambahkan anak.',
      }));
    } finally {
      setSaving(false);
    }
  }

  function handleDeactivate(child: DaycareChild) {
    showConfirm({
      title: 'Nonaktifkan anak',
      description: `${child.profile.name} tidak akan tampil di daftar aktif.`,
      confirmLabel: 'Nonaktifkan',
      cancelLabel: 'Batal',
      onConfirm: async () => {
        try {
          const updated = await deactivateDaycareChild(activeSession.token, child.id);
          setChildren((current) => current.filter((item) => item.id !== updated.id));
          showToast({ message: 'Anak dinonaktifkan.', tone: 'success' });
        } catch (error) {
          showToast({
            message: error instanceof Error ? error.message : 'Gagal menonaktifkan anak.',
            tone: 'danger',
          });
        }
      },
    });
  }

  function handlePurge(child: DaycareChild) {
    showConfirm({
      title: 'Hapus permanen anak',
      description: `${child.profile.name} akan dihapus permanen. Aksi ini hanya berhasil jika anak belum punya riwayat operasional.`,
      confirmLabel: 'Hapus Permanen',
      cancelLabel: 'Batal',
      onConfirm: async () => {
        try {
          await purgeDaycareChild(activeSession.token, child.id);
          setChildren((current) => current.filter((item) => item.id !== child.id));
          setParents((current) =>
            current.map((parent) =>
              parent.id === child.parentId
                ? { ...parent, childrenIds: parent.childrenIds.filter((childId) => childId !== child.id) }
                : parent,
            ),
          );
          showToast({ message: 'Anak dihapus permanen.', tone: 'success' });
        } catch (error) {
          showToast({
            message: error instanceof Error ? error.message : 'Gagal menghapus permanen anak.',
            tone: 'danger',
          });
        }
      },
    });
  }

  if (layoutMode !== 'mobile') {
    return (
      <DesktopChildrenView
        childItems={sortedChildren}
        parents={parents}
        parentById={parentById}
        loading={loading}
        saving={saving}
        formVisible={formVisible}
        formValue={formValue}
        formErrors={formErrors}
        onCreate={openCreateForm}
        onCloseForm={closeForm}
        onChangeForm={updateForm}
        onSubmit={handleCreate}
        onDeactivate={handleDeactivate}
        onPurge={handlePurge}
      />
    );
  }

  return (
    <DetailScreen title="Daftar Anak" backgroundColor="#FFFFFF">
      <Box flexDirection="row" justifyContent="flex-end">
        <Button label="Tambah Anak" onPress={openCreateForm} disabled={parents.length === 0} />
      </Box>

      {loading ? <Text color="textSecondary">Memuat anak...</Text> : null}
      {!loading && parents.length === 0 ? <Text color="textSecondary">Tambahkan orang tua terlebih dahulu.</Text> : null}

      <Box gap="sm">
        {sortedChildren.map((child) => (
          <Box key={child.id} padding="md" gap="sm" style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 }}>
            <Box gap="xxs">
              <Text fontWeight="800" color="textPrimary">{child.profile.name}</Text>
              <Text variant="bodySmall" color="textSecondary">
                {parentById.get(child.parentId)?.user.name ?? 'Parent tidak ditemukan'}
              </Text>
              <Text variant="bodySmall" color="textSecondary">
                {formatDate(child.profile.birthDate)} · {child.profile.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
              </Text>
            </Box>
            <Button label="Nonaktifkan" variant="danger" onPress={() => handleDeactivate(child)} />
          </Box>
        ))}
      </Box>

      <ChildFormModal
        visible={formVisible}
        saving={saving}
        value={formValue}
        errors={formErrors}
        parentOptions={parentOptions}
        onChange={updateForm}
        onClose={closeForm}
        onSubmit={handleCreate}
      />
    </DetailScreen>
  );
}

type DesktopChildrenViewProps = {
  childItems: DaycareChild[];
  parents: DaycareParent[];
  parentById: Map<string, DaycareParent>;
  loading: boolean;
  saving: boolean;
  formVisible: boolean;
  formValue: ChildFormValue;
  formErrors: ChildFormErrors;
  onCreate: () => void;
  onCloseForm: () => void;
  onChangeForm: <K extends keyof ChildFormValue>(key: K, value: ChildFormValue[K]) => void;
  onSubmit: () => void;
  onDeactivate: (child: DaycareChild) => void;
  onPurge: (child: DaycareChild) => void;
};

function DesktopChildrenView({
  childItems,
  parents,
  parentById,
  loading,
  saving,
  formVisible,
  formValue,
  formErrors,
  onCreate,
  onCloseForm,
  onChangeForm,
  onSubmit,
  onDeactivate,
  onPurge,
}: DesktopChildrenViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const parentOptions = parents.map((parent) => ({
    label: parent.user.name,
    value: parent.id,
  }));
  const filteredChildren = normalizedSearch
    ? childItems.filter((child) =>
        [
          child.profile.name,
          parentById.get(child.parentId)?.user.name ?? '',
          child.profile.gender,
          child.customData.notes ?? '',
        ].join(' ').toLowerCase().includes(normalizedSearch),
      )
    : childItems;
  const totalPages = Math.max(1, Math.ceil(filteredChildren.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const visibleChildren = filteredChildren.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage(1);
  }, [normalizedSearch]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <SafeAreaView style={styles.desktopRoot} edges={['top', 'right']}>
      <ScrollView contentContainerStyle={styles.desktopScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopHeader}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Keluarga</Text>
            <Text style={styles.title}>Daftar anak</Text>
            <Text style={styles.subtitle}>Kelola data anak dan hubungkan ke orang tua aktif.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={parents.length === 0}
            onPress={onCreate}
            style={[styles.primaryButton, parents.length === 0 ? styles.disabledButton : null]}
          >
            <MaterialCommunityIcons name="baby-face-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Tambah Anak</Text>
          </Pressable>
        </View>

        {loading ? <Text style={styles.loadingText}>Memuat anak...</Text> : null}

        <View style={styles.tableTools}>
          <View style={styles.searchFieldWrap}>
            <MaterialCommunityIcons name="magnify" size={21} color="#475569" />
            <TextInput
              value={searchQuery}
              placeholder="Cari anak"
              placeholderTextColor="#94A3B8"
              onChangeText={setSearchQuery}
              style={styles.searchNativeInput}
            />
            {searchQuery ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Bersihkan pencarian" onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                <MaterialCommunityIcons name="close" size={17} color="#64748B" />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.tablePanel}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeadText, styles.nameColumn]}>Nama</Text>
            <Text style={[styles.tableHeadText, styles.parentColumn]}>Orang Tua</Text>
            <Text style={[styles.tableHeadText, styles.birthColumn]}>Lahir</Text>
            <Text style={[styles.tableHeadText, styles.genderColumn]}>Gender</Text>
            <Text style={[styles.tableHeadText, styles.actionsHeaderColumn]}>Aksi</Text>
          </View>

          {!loading && visibleChildren.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="baby-face-outline" size={30} color="#94A3B8" />
              <Text style={styles.emptyTitle}>{childItems.length === 0 ? 'Belum ada anak aktif.' : 'Anak tidak ditemukan.'}</Text>
              <Text style={styles.emptyMeta}>
                {parents.length === 0 ? 'Tambahkan orang tua terlebih dahulu.' : 'Tambahkan anak pertama atau ubah pencarian.'}
              </Text>
            </View>
          ) : null}

          {visibleChildren.map((child) => (
            <View key={child.id} style={styles.tableRow}>
              <View style={styles.nameColumn}>
                <Text numberOfLines={1} style={styles.childName}>{child.profile.name}</Text>
                <Text numberOfLines={1} style={styles.childMeta}>{child.customData.notes || 'Tidak ada catatan'}</Text>
              </View>
              <Text numberOfLines={1} style={[styles.tableCellText, styles.parentColumn]}>
                {parentById.get(child.parentId)?.user.name ?? '-'}
              </Text>
              <Text style={[styles.tableCellText, styles.birthColumn]}>{formatDate(child.profile.birthDate)}</Text>
              <Text style={[styles.tableCellText, styles.genderColumn]}>{child.profile.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</Text>
              <View style={styles.actionsColumn}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push({ pathname: '/(daycare)/children/[id]', params: { id: child.id } })}
                  style={[styles.actionButton, styles.editButton]}
                >
                  <MaterialCommunityIcons name="eye-outline" size={17} color="#334155" />
                  <Text numberOfLines={1} style={styles.actionButtonText}>Detail</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => onDeactivate(child)} style={[styles.actionButton, styles.dangerButton]}>
                  <MaterialCommunityIcons name="trash-can-outline" size={17} color="#B91C1C" />
                  <Text numberOfLines={1} style={styles.dangerButtonText}>Nonaktifkan</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => onPurge(child)} style={[styles.actionButton, styles.purgeButton]}>
                  <MaterialCommunityIcons name="delete-forever-outline" size={17} color="#7F1D1D" />
                  <Text numberOfLines={1} style={styles.purgeButtonText}>Hapus</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View style={styles.paginationBar}>
            <Text style={styles.paginationMeta}>
              {filteredChildren.length === 0 ? '0 anak' : `${pageStart + 1}-${Math.min(pageEnd, filteredChildren.length)} dari ${filteredChildren.length}`}
            </Text>
            <View style={styles.paginationActions}>
              <Pressable disabled={safePage <= 1} onPress={() => setPage((current) => Math.max(1, current - 1))} style={[styles.pageButton, safePage <= 1 ? styles.pageButtonDisabled : null]}>
                <MaterialCommunityIcons name="chevron-left" size={18} color={safePage <= 1 ? '#CBD5E1' : '#334155'} />
              </Pressable>
              <Text style={styles.pageIndicator}>{safePage} / {totalPages}</Text>
              <Pressable disabled={safePage >= totalPages} onPress={() => setPage((current) => Math.min(totalPages, current + 1))} style={[styles.pageButton, safePage >= totalPages ? styles.pageButtonDisabled : null]}>
                <MaterialCommunityIcons name="chevron-right" size={18} color={safePage >= totalPages ? '#CBD5E1' : '#334155'} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <ChildFormModal
        visible={formVisible}
        saving={saving}
        value={formValue}
        errors={formErrors}
        parentOptions={parentOptions}
        onChange={onChangeForm}
        onClose={onCloseForm}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  );
}

type ChildFormModalProps = {
  visible: boolean;
  saving: boolean;
  value: ChildFormValue;
  errors: ChildFormErrors;
  parentOptions: OverlaySelectOption[];
  onChange: <K extends keyof ChildFormValue>(key: K, value: ChildFormValue[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function ChildFormModal({ visible, saving, value, errors, parentOptions, onChange, onClose, onSubmit }: ChildFormModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={styles.modalBackdrop} />
        <View style={styles.formPanel}>
          <View style={styles.formPanelHeader}>
            <View style={styles.formPanelTitleWrap}>
              <Text style={styles.formPanelTitle}>Tambah Anak</Text>
              <Text style={styles.formPanelSubtitle}>Hubungkan anak ke orang tua yang sudah terdaftar.</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formPanelScroll}>
            <FieldShell label="Orang Tua" required error={errors.parentId} style={styles.parentSelectField}>
              <OverlaySelect
                value={value.parentId}
                placeholder="Pilih orang tua"
                options={parentOptions}
                onChange={(next) => onChange('parentId', next)}
              />
            </FieldShell>

            <View style={styles.formTwoColumns}>
              <FieldShell label="Nama Anak" required error={errors.name} style={styles.formColumn}>
                <TextField value={value.name} disabled={saving} placeholder="Nama anak" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('name', next)} />
              </FieldShell>
              <FieldShell label="Tanggal Lahir" required error={errors.birthDate} style={styles.formColumn}>
                <SimpleDateInput
                  value={value.birthDate}
                  disabled={saving}
                  error={errors.birthDate}
                  onChange={(next) => onChange('birthDate', next)}
                />
              </FieldShell>
            </View>

            <FieldShell label="Gender" required error={errors.gender} style={styles.genderSelectField}>
              <OverlaySelect
                value={value.gender}
                placeholder="Pilih gender"
                options={genderOptions}
                onChange={(next) => onChange('gender', next as ChildFormValue['gender'])}
              />
            </FieldShell>

            <FieldShell label="Catatan">
              <TextAreaField value={value.notes} disabled={saving} placeholder="Opsional" backgroundColor="#FFFFFF" borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('notes', next)} />
            </FieldShell>

            {errors.submit ? <Text style={styles.fieldError}>{errors.submit}</Text> : null}

            <View style={styles.formActionsRow}>
              <Pressable accessibilityRole="button" disabled={saving} onPress={onClose} style={[styles.cancelPanelButton, styles.formActionButton, saving ? styles.disabledButton : null]}>
                <Text style={styles.cancelPanelButtonText}>Batal</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={saving} onPress={onSubmit} style={[styles.savePanelButton, styles.formActionButton, saving ? styles.disabledButton : null]}>
                <Text style={styles.savePanelButtonText}>{saving ? 'Menyimpan...' : 'Simpan Anak'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  desktopRoot: { backgroundColor: '#F8FAFC', flex: 1 },
  desktopScroll: { gap: 22, padding: 28, paddingBottom: 48 },
  desktopHeader: { alignItems: 'center', flexDirection: 'row', gap: 18, justifyContent: 'space-between' },
  headerCopy: { flex: 1, minWidth: 0 },
  eyebrow: { color: '#4F46E5', fontSize: 12, fontWeight: '900', lineHeight: 16, textTransform: 'uppercase' },
  title: { color: '#0F172A', fontSize: 32, fontWeight: '900', lineHeight: 38, marginTop: 4 },
  subtitle: { color: '#64748B', fontSize: 14, fontWeight: '600', lineHeight: 20, marginTop: 4 },
  primaryButton: { alignItems: 'center', backgroundColor: '#4F46E5', borderRadius: 8, flexDirection: 'row', gap: 8, minHeight: 42, paddingHorizontal: 14 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', lineHeight: 18 },
  loadingText: { color: '#64748B', fontSize: 13, fontWeight: '700' },
  tableTools: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  searchFieldWrap: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: 8, borderWidth: 1, flexDirection: 'row', gap: 8, height: 42, paddingLeft: 12, paddingRight: 6, width: 300 },
  searchNativeInput: { color: '#0F172A', flex: 1, fontSize: 13, fontWeight: '700', height: 40, lineHeight: 18, minWidth: 0, padding: 0 },
  clearSearchButton: { alignItems: 'center', borderRadius: 8, height: 28, justifyContent: 'center', width: 28 },
  tablePanel: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  tableRow: { alignItems: 'center', borderBottomColor: '#E2E8F0', borderBottomWidth: 1, flexDirection: 'row', gap: 12, minHeight: 66, paddingHorizontal: 14 },
  tableHeader: { backgroundColor: '#F8FAFC', minHeight: 44 },
  tableHeadText: { color: '#64748B', fontSize: 11, fontWeight: '900', lineHeight: 16, textTransform: 'uppercase' },
  tableCellText: { color: '#334155', fontSize: 13, fontWeight: '700', lineHeight: 18 },
  nameColumn: { flex: 1.2, minWidth: 200 },
  parentColumn: { flex: 1, minWidth: 170 },
  birthColumn: { flex: 0.75, minWidth: 120 },
  genderColumn: { flex: 0.75, minWidth: 110 },
  actionsColumn: { flex: 0, flexBasis: 386, flexDirection: 'row', gap: 8, justifyContent: 'flex-end', minWidth: 386, width: 386 },
  actionsHeaderColumn: { flex: 0, flexBasis: 386, minWidth: 386, textAlign: 'right', width: 386 },
  childName: { color: '#0F172A', fontSize: 14, fontWeight: '900', lineHeight: 20 },
  childMeta: { color: '#94A3B8', fontSize: 11, fontWeight: '700', lineHeight: 15, marginTop: 2 },
  actionButton: { alignItems: 'center', borderRadius: 8, borderWidth: 1, flexDirection: 'row', gap: 6, justifyContent: 'center', minHeight: 36, paddingHorizontal: 10, width: 134 },
  editButton: { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1' },
  dangerButton: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  purgeButton: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA', width: 86 },
  actionButtonText: { color: '#334155', flexShrink: 1, fontSize: 12, fontWeight: '900', lineHeight: 16 },
  dangerButtonText: { color: '#B91C1C', flexShrink: 1, fontSize: 12, fontWeight: '900', lineHeight: 16 },
  purgeButtonText: { color: '#7F1D1D', flexShrink: 1, fontSize: 12, fontWeight: '900', lineHeight: 16 },
  emptyState: { alignItems: 'center', gap: 6, justifyContent: 'center', minHeight: 140, padding: 20 },
  emptyTitle: { color: '#0F172A', fontSize: 15, fontWeight: '900', lineHeight: 20 },
  emptyMeta: { color: '#64748B', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  paginationBar: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between', minHeight: 54, paddingHorizontal: 14 },
  paginationMeta: { color: '#64748B', fontSize: 13, fontWeight: '800', lineHeight: 18 },
  paginationActions: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  pageButton: { alignItems: 'center', borderColor: '#E2E8F0', borderRadius: 8, borderWidth: 1, height: 34, justifyContent: 'center', width: 34 },
  pageButtonDisabled: { backgroundColor: '#F8FAFC' },
  pageIndicator: { color: '#334155', fontSize: 13, fontWeight: '900', lineHeight: 18, minWidth: 48, textAlign: 'center' },
  modalOverlay: { alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.42)', flex: 1, justifyContent: 'center', padding: 24 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  formPanel: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: 8, borderWidth: 1, gap: 18, maxHeight: '88%', maxWidth: 720, padding: 18, width: '100%', zIndex: 1 },
  formPanelHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
  formPanelTitleWrap: { flex: 1, gap: 4, minWidth: 0 },
  formPanelTitle: { color: '#0F172A', fontSize: 20, fontWeight: '900', lineHeight: 26 },
  formPanelSubtitle: { color: '#64748B', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  closeButton: { alignItems: 'center', borderColor: '#E2E8F0', borderRadius: 8, borderWidth: 1, height: 36, justifyContent: 'center', width: 36 },
  formPanelScroll: { gap: 16, paddingBottom: 2 },
  parentSelectField: { elevation: 30, position: 'relative', zIndex: 300 },
  formTwoColumns: { flexDirection: 'row', gap: 12, position: 'relative', zIndex: 1 },
  genderSelectField: { elevation: 20, position: 'relative', zIndex: 200 },
  formColumn: { flex: 1, minWidth: 0 },
  fieldError: { color: '#B91C1C', fontSize: 12, fontWeight: '700', lineHeight: 16 },
  formActionsRow: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end', paddingTop: 2 },
  formActionButton: { flex: 1 },
  disabledButton: { opacity: 0.6 },
  cancelPanelButton: { alignItems: 'center', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', borderRadius: 8, borderWidth: 1, justifyContent: 'center', minHeight: 42 },
  cancelPanelButtonText: { color: '#334155', fontSize: 13, fontWeight: '900', lineHeight: 18 },
  savePanelButton: { alignItems: 'center', backgroundColor: '#4F46E5', borderRadius: 8, justifyContent: 'center', minHeight: 42 },
  savePanelButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', lineHeight: 18 },
});
