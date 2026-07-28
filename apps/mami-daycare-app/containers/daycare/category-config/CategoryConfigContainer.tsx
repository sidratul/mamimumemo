import { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { CONTROL_HEIGHT } from '@mami/ui';
import {
  BottomDrawer,
  Button,
  DetailScreen,
  DrawerFormActions,
  FieldShell,
  TextLabel as UiTextLabel,
  TextMuted as UiTextMuted,
  TextField,
} from '@mami/ui';
import { Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useSession } from '../../../providers/session-provider';
import { useDaycareLayoutMode } from '../../../services/desktop/layout';
import {
  getResolvedActivityCategories,
  updateDaycareActivityCategory,
  type ResolvedActivityCategory,
} from '../../../services/operations/daycare-config';
import { Box, Text } from '../../../theme/theme';

export function CategoryConfigContainer() {
  const router = useRouter();
  const { session } = useSession();
  const layoutMode = useDaycareLayoutMode();
  const [categories, setCategories] = useState<ResolvedActivityCategory[]>([]);
  const [selected, setSelected] = useState<ResolvedActivityCategory | null>(null);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!session?.token || !session.daycareId) {
      return;
    }
    try {
      setLoading(true);
      setError('');
      setCategories(
        await getResolvedActivityCategories(session.token, session.daycareId),
      );
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil kategori.');
    } finally {
      setLoading(false);
    }
  }, [session?.daycareId, session?.token]);

  useEffect(() => {
    void load();
  }, [load]);

  function openEditor(category: ResolvedActivityCategory) {
    setSelected(category);
    setLabel(category.label);
    setColor(category.color ?? '');
    setEnabled(category.enabled);
    setError('');
  }

  async function handleSave() {
    if (!selected || !session?.token || !session.daycareId) {
      return;
    }
    try {
      setSaving(true);
      setError('');
      await updateDaycareActivityCategory(
        session.token,
        session.daycareId,
        selected._id,
        {
          label: label.trim(),
          color: color.trim(),
          enabled,
        },
      );
      await load();
      setSelected(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal menyimpan konfigurasi.');
    } finally {
      setSaving(false);
    }
  }

  if (layoutMode !== 'mobile') {
    return (
      <DesktopCategoryConfigView
        categories={categories}
        selected={selected}
        label={label}
        color={color}
        enabled={enabled}
        loading={loading}
        saving={saving}
        error={error}
        onEdit={openEditor}
        onClose={() => setSelected(null)}
        onLabelChange={setLabel}
        onColorChange={setColor}
        onEnabledChange={setEnabled}
        onSave={() => void handleSave()}
      />
    );
  }

  return (
    <DetailScreen title="Label Kategori" onBack={() => router.back()}>
      {loading ? <Text color="textSecondary">Memuat kategori...</Text> : null}
      {error && !selected ? <Text color="danger">{error}</Text> : null}
      <Box gap="md">
        {categories.map((category) => (
          <Box
            key={category._id}
            padding="md"
            borderWidth={1}
            borderColor="border"
            borderRadius="md"
            backgroundColor="surface"
          >
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
              <Box flex={1} gap="xxs">
                <Text fontWeight="800">{category.label}</Text>
                <Text variant="bodySmall" color="textSecondary">
                  Default: {category.defaultLabel} · {category.code}
                </Text>
              </Box>
              <Button label="Ubah" variant="secondary" onPress={() => openEditor(category)} />
            </Box>
          </Box>
        ))}
      </Box>

      <BottomDrawer visible={Boolean(selected)} onDismiss={() => setSelected(null)}>
        <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 16 }}>
          Konfigurasi {selected?.defaultLabel}
        </Text>
        <Box gap="md">
          <TextField value={label} onChange={setLabel} placeholder="Label untuk daycare" />
          <TextField value={color} onChange={setColor} placeholder="Warna #RRGGBB" />
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontWeight="700">Tampilkan kategori</Text>
            <Switch value={enabled} onValueChange={setEnabled} />
          </Box>
          {error ? <Text color="danger">{error}</Text> : null}
          <DrawerFormActions
            submitLabel="Simpan"
            onCancel={() => setSelected(null)}
            onSubmit={() => void handleSave()}
            loading={saving}
          />
        </Box>
      </BottomDrawer>
    </DetailScreen>
  );
}

type DesktopCategoryConfigViewProps = {
  categories: ResolvedActivityCategory[];
  selected: ResolvedActivityCategory | null;
  label: string;
  color: string;
  enabled: boolean;
  loading: boolean;
  saving: boolean;
  error: string;
  onEdit: (category: ResolvedActivityCategory) => void;
  onClose: () => void;
  onLabelChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onEnabledChange: (value: boolean) => void;
  onSave: () => void;
};

function DesktopCategoryConfigView({
  categories,
  selected,
  label,
  color,
  enabled,
  loading,
  saving,
  error,
  onEdit,
  onClose,
  onLabelChange,
  onColorChange,
  onEnabledChange,
  onSave,
}: DesktopCategoryConfigViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ENABLED' | 'DISABLED'>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredCategories = categories
    .filter((category) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ENABLED' ? category.enabled : !category.enabled);

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        category.label,
        category.defaultLabel,
        category.code,
        category.color ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .sort((left, right) => left.resolvedSortOrder - right.resolvedSortOrder || left.label.localeCompare(right.label));
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const visibleCategories = filteredCategories.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage(1);
  }, [normalizedSearch, statusFilter]);

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
            <Text style={styles.eyebrow}>Konfigurasi Daycare</Text>
            <Text style={styles.title}>Label kategori</Text>
            <Text style={styles.subtitle}>
              Atur nama, warna, dan status kategori aktivitas yang tampil untuk daycare ini.
            </Text>
          </View>
        </View>

        {loading ? <Text style={styles.loadingText}>Memuat kategori...</Text> : null}
        {error && !selected ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.tableTools}>
          <View style={styles.searchFieldWrap}>
            <MaterialCommunityIcons name="magnify" size={21} color="#475569" />
            <TextInput
              value={searchQuery}
              placeholder="Cari kategori"
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

          <View style={styles.segmentedFilter}>
            {[
              { label: 'Semua', value: 'ALL' },
              { label: 'Aktif', value: 'ENABLED' },
              { label: 'Nonaktif', value: 'DISABLED' },
            ].map((option) => {
              const active = statusFilter === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setStatusFilter(option.value as typeof statusFilter)}
                  style={[styles.segmentButton, active ? styles.segmentButtonActive : null]}
                >
                  <Text style={[styles.segmentText, active ? styles.segmentTextActive : null]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.tablePanel}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeadText, styles.labelColumn]}>Label</Text>
            <Text style={[styles.tableHeadText, styles.defaultColumn]}>Default</Text>
            <Text style={[styles.tableHeadText, styles.codeColumn]}>Kode</Text>
            <Text style={[styles.tableHeadText, styles.colorColumn]}>Warna</Text>
            <Text style={[styles.tableHeadText, styles.statusColumn]}>Status</Text>
            <Text style={[styles.tableHeadText, styles.actionsHeaderColumn]}>Aksi</Text>
          </View>

          {!loading && visibleCategories.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="tag-outline" size={28} color="#94A3B8" />
              <Text style={styles.emptyTitle}>
                {categories.length === 0 ? 'Belum ada kategori.' : 'Kategori tidak ditemukan.'}
              </Text>
              <Text style={styles.emptyMeta}>
                {categories.length === 0 ? 'Jalankan seed kategori untuk daycare ini.' : 'Coba ubah kata kunci atau filter status.'}
              </Text>
            </View>
          ) : null}

          {visibleCategories.map((category) => (
            <View key={category._id} style={styles.tableRow}>
              <View style={styles.labelColumn}>
                <Text numberOfLines={1} style={styles.categoryName}>{category.label}</Text>
                <Text numberOfLines={1} style={styles.categoryMeta}>Urutan {category.resolvedSortOrder}</Text>
              </View>
              <Text numberOfLines={1} style={[styles.tableCellText, styles.defaultColumn]}>{category.defaultLabel}</Text>
              <Text numberOfLines={1} style={[styles.tableCellText, styles.codeColumn]}>{category.code}</Text>
              <View style={styles.colorColumn}>
                <View style={styles.colorPreviewRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: category.color || '#CBD5E1' }]} />
                  <Text numberOfLines={1} style={styles.colorText}>{category.color || '-'}</Text>
                </View>
              </View>
              <View style={styles.statusColumn}>
                <View style={[styles.statusPill, category.enabled ? styles.statusPillActive : styles.statusPillMuted]}>
                  <Text style={[styles.statusPillText, category.enabled ? styles.statusPillTextActive : styles.statusPillTextMuted]}>
                    {category.enabled ? 'Aktif' : 'Nonaktif'}
                  </Text>
                </View>
              </View>
              <View style={styles.actionsColumn}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Ubah ${category.label}`}
                  onPress={() => onEdit(category)}
                  style={[styles.actionButton, styles.editButton]}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={17} color="#334155" />
                  <Text numberOfLines={1} style={styles.actionButtonText}>Ubah</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View style={styles.paginationBar}>
            <Text style={styles.paginationMeta}>
              {filteredCategories.length === 0 ? '0 kategori' : `${pageStart + 1}-${Math.min(pageEnd, filteredCategories.length)} dari ${filteredCategories.length}`}
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

      <Modal visible={Boolean(selected)} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={styles.modalBackdrop} />
          <View style={styles.formPanel}>
            <View style={styles.formPanelHeader}>
              <View style={styles.formPanelTitleWrap}>
                <Text style={styles.formPanelTitle}>Konfigurasi Kategori</Text>
                <Text style={styles.formPanelSubtitle}>
                  {selected ? `${selected.defaultLabel} · ${selected.code}` : 'Atur label kategori daycare.'}
                </Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Tutup form" onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formPanelScroll}>
              <FieldShell label="Label Daycare" required>
                <TextField
                  value={label}
                  disabled={saving}
                  onChange={onLabelChange}
                  placeholder="Label untuk daycare"
                  backgroundColor="#FFFFFF"
                  borderRadius={8}
                  useBottomSheetInput={false}
                />
              </FieldShell>

              <FieldShell label="Warna">
                <View style={styles.colorInputRow}>
                  <View style={[styles.colorInputPreview, { backgroundColor: color || '#CBD5E1' }]} />
                  <View style={styles.colorInput}>
                    <TextField
                      value={color}
                      disabled={saving}
                      onChange={onColorChange}
                      placeholder="#4F46E5"
                      backgroundColor="#FFFFFF"
                      borderRadius={8}
                      useBottomSheetInput={false}
                    />
                  </View>
                </View>
              </FieldShell>

              <View style={styles.switchRow}>
                <View style={styles.switchCopy}>
                  <UiTextLabel>Tampilkan kategori</UiTextLabel>
                  <UiTextMuted style={styles.switchHint}>Kategori nonaktif tidak tampil saat membuat aktivitas.</UiTextMuted>
                </View>
                <Switch value={enabled} disabled={saving} onValueChange={onEnabledChange} />
              </View>

              {error ? <Text style={styles.fieldError}>{error}</Text> : null}

              <View style={styles.formActionsRow}>
                <Pressable
                  accessibilityRole="button"
                  disabled={saving}
                  onPress={onClose}
                  style={[styles.cancelPanelButton, styles.formActionButton, saving ? styles.disabledButton : null]}
                >
                  <Text style={styles.cancelPanelButtonText}>Batal</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={saving}
                  onPress={onSave}
                  style={[styles.savePanelButton, styles.formActionButton, saving ? styles.disabledButton : null]}
                >
                  <Text style={styles.savePanelButtonText}>{saving ? 'Menyimpan...' : 'Simpan'}</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  loadingText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  tableTools: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-start',
  },
  searchFieldWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexShrink: 0,
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
  segmentedFilter: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 2,
    height: 42,
    padding: 3,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 6,
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  segmentButtonActive: {
    backgroundColor: '#EEF2FF',
  },
  segmentText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  segmentTextActive: {
    color: '#4F46E5',
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
  labelColumn: {
    flex: 1.2,
    minWidth: 190,
  },
  defaultColumn: {
    flex: 1,
    minWidth: 150,
  },
  codeColumn: {
    flex: 0.65,
    minWidth: 100,
  },
  colorColumn: {
    flex: 0.8,
    minWidth: 130,
  },
  statusColumn: {
    flex: 0.65,
    minWidth: 100,
  },
  actionsColumn: {
    flex: 0,
    flexBasis: 134,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minWidth: 134,
    width: 134,
  },
  actionsHeaderColumn: {
    flex: 0,
    flexBasis: 134,
    minWidth: 134,
    textAlign: 'right',
    width: 134,
  },
  categoryName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 20,
  },
  categoryMeta: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    marginTop: 2,
  },
  colorPreviewRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  colorSwatch: {
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 1,
    height: 18,
    width: 18,
  },
  colorText: {
    color: '#334155',
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillActive: {
    backgroundColor: '#ECFDF5',
  },
  statusPillMuted: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  statusPillTextActive: {
    color: '#047857',
  },
  statusPillTextMuted: {
    color: '#64748B',
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
    width: 96,
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
    maxWidth: 620,
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
  fieldError: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  colorInputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  colorInputPreview: {
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    width: 42,
  },
  colorInput: {
    flex: 1,
    minWidth: 0,
  },
  switchRow: {
    alignItems: 'center',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 12,
  },
  switchCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  switchHint: {
    fontSize: 12,
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
