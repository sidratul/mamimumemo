import { useCallback, useEffect, useState } from 'react';
import {
  BottomDrawer,
  Button,
  DetailScreen,
  DrawerFormActions,
  TextField,
} from '@mami/ui';
import { Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { useSession } from '../../../providers/session-provider';
import {
  getResolvedActivityCategories,
  updateDaycareActivityCategory,
  type ResolvedActivityCategory,
} from '../../../services/operations/daycare-config';
import { Box, Text } from '../../../theme/theme';

export function CategoryConfigContainer() {
  const router = useRouter();
  const { session } = useSession();
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
