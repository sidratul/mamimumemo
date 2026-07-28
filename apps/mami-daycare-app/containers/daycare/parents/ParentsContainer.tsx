import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Redirect } from 'expo-router';
import { CONTROL_HEIGHT } from '@mami/ui';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  DetailScreen,
  FieldShell,
  PasswordField,
  TextAreaField,
  TextField,
  useConfirm,
  useToast,
} from '@mami/ui';

import { useSession } from '../../../providers/session-provider';
import { useDaycareLayoutMode } from '../../../services/desktop/layout';
import {
  createDaycareParent,
  deactivateDaycareParent,
  getDaycareRoster,
  updateDaycareParentProfile,
  type DaycareParent,
} from '../../../services/operations/daycare-roster';
import { Box, Text } from '../../../theme/theme';

type ParentFormValue = {
  name: string;
  email: string;
  phone: string;
  password: string;
  notes: string;
};

type ParentFormErrors = Partial<Record<keyof ParentFormValue | 'submit', string>>;

const initialFormValue: ParentFormValue = {
  name: '',
  email: '',
  phone: '',
  password: '',
  notes: '',
};

export function ParentsContainer() {
  const { isLoading, session } = useSession();
  const layoutMode = useDaycareLayoutMode();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [parents, setParents] = useState<DaycareParent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formValue, setFormValue] = useState<ParentFormValue>(initialFormValue);
  const [formErrors, setFormErrors] = useState<ParentFormErrors>({});
  const [editingParent, setEditingParent] = useState<DaycareParent | null>(null);

  useEffect(() => {
    async function run() {
      if (!session?.daycareId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const roster = await getDaycareRoster(session.token, session.daycareId);
        setParents(roster.parents);
      } catch (error) {
        showToast({
          message: error instanceof Error ? error.message : 'Gagal memuat orang tua.',
          tone: 'danger',
        });
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [session?.daycareId, session?.token, showToast]);

  const sortedParents = useMemo(
    () => [...parents].sort((left, right) => left.user.name.localeCompare(right.user.name)),
    [parents],
  );

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }
  const activeSession = session;

  function openCreateForm() {
    setEditingParent(null);
    setFormValue(initialFormValue);
    setFormErrors({});
    setFormVisible(true);
  }

  function openEditForm(parent: DaycareParent) {
    setEditingParent(parent);
    setFormValue({
      name: parent.user.name,
      email: parent.user.email,
      phone: parent.user.phone,
      password: '',
      notes: parent.customData.notes ?? parent.customData.deskripsi ?? '',
    });
    setFormErrors({});
    setFormVisible(true);
  }

  function closeForm() {
    setFormVisible(false);
    setFormValue(initialFormValue);
    setFormErrors({});
    setEditingParent(null);
  }

  function updateForm<K extends keyof ParentFormValue>(key: K, value: ParentFormValue[K]) {
    setFormValue((current) => ({ ...current, [key]: value }));
    setFormErrors((current) => {
      const next = { ...current };
      delete next[key];
      delete next.submit;
      return next;
    });
  }

  function validateForm() {
    const nextErrors: ParentFormErrors = {};

    if (!formValue.name.trim()) {
      nextErrors.name = 'Nama wajib diisi.';
    }

    if (!editingParent) {
      if (!formValue.email.trim()) {
        nextErrors.email = 'Email wajib diisi.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.email.trim())) {
        nextErrors.email = 'Format email tidak valid.';
      }

      if (!formValue.phone.trim()) {
        nextErrors.phone = 'Nomor telepon wajib diisi.';
      }

      if (!formValue.password) {
        nextErrors.password = 'Password awal wajib diisi.';
      } else if (formValue.password.length < 6) {
        nextErrors.password = 'Password minimal 6 karakter.';
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleCreate() {
    if (!activeSession.daycareId) {
      showToast({ message: 'Daycare belum terhubung ke akun ini.', tone: 'danger' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      if (editingParent) {
        const updated = await updateDaycareParentProfile(activeSession.token, editingParent.id, {
          name: formValue.name,
          notes: formValue.notes,
        });
        setParents((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        showToast({ message: 'Orang tua berhasil diperbarui.', tone: 'success' });
        closeForm();
        return;
      }

      const created = await createDaycareParent(activeSession.token, {
        daycareId: activeSession.daycareId,
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        password: formValue.password,
        notes: formValue.notes,
      });
      setParents((current) => [created, ...current]);
      showToast({ message: 'Orang tua berhasil ditambahkan.', tone: 'success' });
      closeForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menambahkan orang tua.';
      setFormErrors((current) => ({
        ...current,
        submit: message,
        ...(message.toLowerCase().includes('email') ? { email: message } : {}),
      }));
    } finally {
      setSaving(false);
    }
  }

  function handleDeactivate(parent: DaycareParent) {
    showConfirm({
      title: 'Nonaktifkan orang tua',
      description: `${parent.user.name} tidak akan tampil di daftar aktif.`,
      confirmLabel: 'Nonaktifkan',
      cancelLabel: 'Batal',
      onConfirm: async () => {
        try {
          const updated = await deactivateDaycareParent(activeSession.token, parent.id);
          setParents((current) => current.filter((item) => item.id !== updated.id));
          showToast({ message: 'Orang tua dinonaktifkan.', tone: 'success' });
        } catch (error) {
          showToast({
            message: error instanceof Error ? error.message : 'Gagal menonaktifkan orang tua.',
            tone: 'danger',
          });
        }
      },
    });
  }

  if (layoutMode !== 'mobile') {
    return (
      <DesktopParentsView
        parents={sortedParents}
        loading={loading}
        saving={saving}
        formVisible={formVisible}
        formValue={formValue}
        formErrors={formErrors}
        editingParent={editingParent}
        onCreate={openCreateForm}
        onEdit={openEditForm}
        onCloseForm={closeForm}
        onChangeForm={updateForm}
        onSubmit={handleCreate}
        onDeactivate={handleDeactivate}
      />
    );
  }

  return (
    <DetailScreen title="Orang Tua" backgroundColor="#FFFFFF">
      <Box flexDirection="row" justifyContent="flex-end">
        <Button label="Tambah Orang Tua" onPress={openCreateForm} />
      </Box>

      {loading ? <Text color="textSecondary">Memuat orang tua...</Text> : null}

      {!loading && sortedParents.length === 0 ? (
        <Box padding="lg" borderRadius="lg" style={{ borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text color="textSecondary">Belum ada orang tua aktif.</Text>
        </Box>
      ) : null}

      <Box gap="sm">
        {sortedParents.map((parent) => (
          <Box key={parent.id} padding="md" gap="sm" style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 }}>
            <Box gap="xxs">
              <Text fontWeight="800" color="textPrimary">{parent.user.name}</Text>
              <Text variant="bodySmall" color="textSecondary">{parent.user.email}</Text>
              <Text variant="bodySmall" color="textSecondary">{parent.user.phone}</Text>
            </Box>
            <Box flexDirection="row" gap="sm">
              <Button label="Ubah" variant="secondary" onPress={() => openEditForm(parent)} style={{ flex: 1 }} />
              <Button label="Nonaktifkan" variant="danger" onPress={() => handleDeactivate(parent)} style={{ flex: 1 }} />
            </Box>
          </Box>
        ))}
      </Box>

      <ParentFormModal
        visible={formVisible}
        saving={saving}
        value={formValue}
        errors={formErrors}
        editing={Boolean(editingParent)}
        onChange={updateForm}
        onClose={closeForm}
        onSubmit={handleCreate}
      />
    </DetailScreen>
  );
}

type DesktopParentsViewProps = {
  parents: DaycareParent[];
  loading: boolean;
  saving: boolean;
  formVisible: boolean;
  formValue: ParentFormValue;
  formErrors: ParentFormErrors;
  editingParent: DaycareParent | null;
  onCreate: () => void;
  onEdit: (parent: DaycareParent) => void;
  onCloseForm: () => void;
  onChangeForm: <K extends keyof ParentFormValue>(key: K, value: ParentFormValue[K]) => void;
  onSubmit: () => void;
  onDeactivate: (parent: DaycareParent) => void;
};

function DesktopParentsView({
  parents,
  loading,
  saving,
  formVisible,
  formValue,
  formErrors,
  editingParent,
  onCreate,
  onEdit,
  onCloseForm,
  onChangeForm,
  onSubmit,
  onDeactivate,
}: DesktopParentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredParents = normalizedSearch
    ? parents.filter((parent) =>
        [parent.user.name, parent.user.email, parent.user.phone, parent.customData.notes ?? '']
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : parents;
  const totalPages = Math.max(1, Math.ceil(filteredParents.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const visibleParents = filteredParents.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage(1);
  }, [normalizedSearch]);

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
            <Text style={styles.eyebrow}>Keluarga</Text>
            <Text style={styles.title}>Orang tua</Text>
            <Text style={styles.subtitle}>Kelola akun parent dan kontak keluarga anak daycare.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={onCreate} style={styles.primaryButton}>
            <MaterialCommunityIcons name="account-plus-outline" size={19} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Tambah Orang Tua</Text>
          </Pressable>
        </View>

        {loading ? <Text style={styles.loadingText}>Memuat orang tua...</Text> : null}

        <View style={styles.tableTools}>
          <View style={styles.searchFieldWrap}>
            <MaterialCommunityIcons name="magnify" size={21} color="#475569" />
            <TextInput
              value={searchQuery}
              placeholder="Cari orang tua"
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
            <Text style={[styles.tableHeadText, styles.emailColumn]}>Email</Text>
            <Text style={[styles.tableHeadText, styles.phoneColumn]}>Telepon</Text>
            <Text style={[styles.tableHeadText, styles.childrenColumn]}>Anak</Text>
            <Text style={[styles.tableHeadText, styles.actionsHeaderColumn]}>Aksi</Text>
          </View>

          {!loading && visibleParents.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-group-outline" size={28} color="#94A3B8" />
              <Text style={styles.emptyTitle}>{parents.length === 0 ? 'Belum ada orang tua aktif.' : 'Orang tua tidak ditemukan.'}</Text>
              <Text style={styles.emptyMeta}>{parents.length === 0 ? 'Tambahkan orang tua pertama untuk daycare ini.' : 'Coba ubah kata kunci pencarian.'}</Text>
            </View>
          ) : null}

          {visibleParents.map((parent) => (
            <View key={parent.id} style={styles.tableRow}>
              <View style={styles.nameColumn}>
                <Text numberOfLines={1} style={styles.parentName}>{parent.user.name}</Text>
                <Text numberOfLines={1} style={styles.parentMeta}>{parent.customData.notes || 'Tidak ada catatan'}</Text>
              </View>
              <Text numberOfLines={1} style={[styles.tableCellText, styles.emailColumn]}>{parent.user.email}</Text>
              <Text numberOfLines={1} style={[styles.tableCellText, styles.phoneColumn]}>{parent.user.phone}</Text>
              <Text style={[styles.tableCellText, styles.childrenColumn]}>{parent.childrenIds.length}</Text>
              <View style={styles.actionsColumn}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Ubah ${parent.user.name}`}
                  onPress={() => onEdit(parent)}
                  style={[styles.actionButton, styles.editButton]}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={17} color="#334155" />
                  <Text numberOfLines={1} style={styles.actionButtonText}>Ubah</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Nonaktifkan ${parent.user.name}`}
                  onPress={() => onDeactivate(parent)}
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
              {filteredParents.length === 0 ? '0 orang tua' : `${pageStart + 1}-${Math.min(pageEnd, filteredParents.length)} dari ${filteredParents.length}`}
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
              <Text style={styles.pageIndicator}>{safePage} / {totalPages}</Text>
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

      <ParentFormModal
        visible={formVisible}
        saving={saving}
        value={formValue}
        errors={formErrors}
        editing={Boolean(editingParent)}
        onChange={onChangeForm}
        onClose={onCloseForm}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  );
}

type ParentFormModalProps = {
  visible: boolean;
  saving: boolean;
  value: ParentFormValue;
  errors: ParentFormErrors;
  editing: boolean;
  onChange: <K extends keyof ParentFormValue>(key: K, value: ParentFormValue[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function ParentFormModal({ visible, saving, value, errors, editing, onChange, onClose, onSubmit }: ParentFormModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={styles.modalBackdrop} />
        <View style={styles.formPanel}>
          <View style={styles.formPanelHeader}>
            <View style={styles.formPanelTitleWrap}>
              <Text style={styles.formPanelTitle}>{editing ? 'Ubah Orang Tua' : 'Tambah Orang Tua'}</Text>
              <Text style={styles.formPanelSubtitle}>
                {editing ? 'Ubah nama dan deskripsi parent.' : 'Akun ini dapat dipakai untuk akses parent app.'}
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formPanelScroll}>
            <View style={editing ? styles.formField : styles.formTwoColumns}>
              <FieldShell label="Nama" required error={errors.name} style={editing ? undefined : styles.formColumn}>
                <TextField value={value.name} disabled={saving} placeholder="Nama orang tua" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('name', next)} />
              </FieldShell>
              {!editing ? (
              <FieldShell label="Telepon" required error={errors.phone} style={styles.formColumn}>
                <TextField value={value.phone} disabled={saving} placeholder="Nomor telepon" keyboardType="phone-pad" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('phone', next)} />
              </FieldShell>
              ) : null}
            </View>

            {!editing ? (
            <View style={styles.formTwoColumns}>
              <FieldShell label="Email" required error={errors.email} style={styles.formColumn}>
                <TextField value={value.email} disabled={saving} placeholder="email@domain.com" keyboardType="email-address" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('email', next)} />
              </FieldShell>
              <FieldShell label="Password Awal" required error={errors.password} style={styles.formColumn}>
                <PasswordField value={value.password} disabled={saving} placeholder="Minimal 6 karakter" backgroundColor="#FFFFFF" borderRadius={8} useBottomSheetInput={false} onChange={(next) => onChange('password', next)} />
              </FieldShell>
            </View>
            ) : null}

            <FieldShell label="Deskripsi" error={errors.notes}>
              <TextAreaField value={value.notes} disabled={saving} placeholder="Opsional" backgroundColor="#FFFFFF" borderRadius={8} numberOfLines={3} useBottomSheetInput={false} onChange={(next) => onChange('notes', next)} />
            </FieldShell>

            {errors.submit ? <Text style={styles.fieldError}>{errors.submit}</Text> : null}

            <View style={styles.formActionsRow}>
              <Pressable accessibilityRole="button" disabled={saving} onPress={onClose} style={[styles.cancelPanelButton, styles.formActionButton, saving ? styles.disabledButton : null]}>
                <Text style={styles.cancelPanelButtonText}>Batal</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={saving} onPress={onSubmit} style={[styles.savePanelButton, styles.formActionButton, saving ? styles.disabledButton : null]}>
                <Text style={styles.savePanelButtonText}>
                  {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan Orang Tua'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    flexDirection: 'row',
    gap: 12,
  },
  searchFieldWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: CONTROL_HEIGHT,
    paddingLeft: 12,
    paddingRight: 6,
    width: 300,
  },
  searchNativeInput: {
    color: '#0F172A',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    height: CONTROL_HEIGHT - 2,
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
    flex: 1.3,
    minWidth: 200,
  },
  emailColumn: {
    flex: 1.2,
    minWidth: 190,
  },
  phoneColumn: {
    flex: 0.8,
    minWidth: 130,
  },
  childrenColumn: {
    flex: 0.45,
    minWidth: 70,
  },
  actionsColumn: {
    flex: 0,
    flexBasis: 300,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    minWidth: 300,
    width: 300,
  },
  actionsHeaderColumn: {
    flex: 0,
    flexBasis: 300,
    minWidth: 300,
    textAlign: 'right',
    width: 300,
  },
  parentName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 20,
  },
  parentMeta: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    marginTop: 2,
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
  actionButtonText: {
    color: '#334155',
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
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
    justifyContent: 'center',
    minHeight: 140,
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
    maxWidth: 720,
    padding: 18,
    width: '100%',
    zIndex: 1,
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
  formPanelScroll: {
    gap: 16,
    paddingBottom: 2,
  },
  formTwoColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  formColumn: {
    flex: 1,
    minWidth: 0,
  },
  formField: {
    gap: 8,
  },
  fieldError: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
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
    justifyContent: 'center',
    minHeight: 42,
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
    justifyContent: 'center',
    minHeight: 42,
  },
  savePanelButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
});
