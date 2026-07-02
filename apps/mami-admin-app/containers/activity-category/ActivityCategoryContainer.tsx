import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { BottomDrawer, Button, DetailScreen, DrawerFormActions, SelectInput } from '@mami/ui';

import { TextField } from '../../components/input';
import {
  createActivityCategory,
  listActivityCategories,
  type ActivityCategoryDefinition,
} from '../../services/activity-category';
import { Box, Text } from '../../theme/theme';

const behaviorOptions = [
  'GENERIC',
  'MEAL',
  'NAP',
  'TOILETING',
  'CARE',
  'PLAY',
  'LEARNING',
].map((value) => ({ label: value, value }));

export function ActivityCategoryContainer() {
  const router = useRouter();
  const [categories, setCategories] = useState<ActivityCategoryDefinition[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [behaviorType, setBehaviorType] =
    useState<ActivityCategoryDefinition['behaviorType']>('GENERIC');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');
      setCategories(await listActivityCategories());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil kategori.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSubmit() {
    if (!code.trim() || !label.trim()) {
      setError('Code dan label wajib diisi.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await createActivityCategory({
        code: code.trim().toUpperCase(),
        defaultLabel: label.trim(),
        behaviorType,
        defaultColor: color.trim() || undefined,
        defaultIcon: icon.trim() || undefined,
      });
      await load();
      setDrawerVisible(false);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal membuat kategori.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DetailScreen title="Kategori Aktivitas" onBack={() => router.back()}>
      <Box flexDirection="row" justifyContent="flex-end">
        <Button
          label="Tambah Kategori"
          onPress={() => {
            setCode('');
            setLabel('');
            setBehaviorType('GENERIC');
            setColor('');
            setIcon('');
            setError('');
            setDrawerVisible(true);
          }}
        />
      </Box>

      {loading ? <Text color="textSecondary">Memuat kategori...</Text> : null}
      {error && !drawerVisible ? <Text color="danger">{error}</Text> : null}

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
            <Box flexDirection="row" justifyContent="space-between">
              <Box gap="xxs">
                <Text fontWeight="800">{category.defaultLabel}</Text>
                <Text variant="bodySmall" color="textSecondary">
                  {category.code} · {category.behaviorType}
                </Text>
              </Box>
              <Text color={category.isActive ? 'success' : 'textSecondary'}>
                {category.isActive ? 'Aktif' : 'Nonaktif'}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>

      <BottomDrawer visible={drawerVisible} onDismiss={() => setDrawerVisible(false)}>
        <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 16 }}>
          Tambah Kategori
        </Text>
        <Box gap="md">
          <TextField value={code} onChange={setCode} placeholder="Code, contoh OUTDOOR_PLAY" />
          <TextField value={label} onChange={setLabel} placeholder="Label default" />
          <SelectInput
            value={behaviorType}
            onChange={(value) =>
              setBehaviorType(value as ActivityCategoryDefinition['behaviorType'])}
            options={behaviorOptions}
            title="Behavior Type"
            placeholder="Pilih behavior"
          />
          <TextField value={color} onChange={setColor} placeholder="Warna #RRGGBB (opsional)" />
          <TextField value={icon} onChange={setIcon} placeholder="Icon key (opsional)" />
          {error ? <Text color="danger">{error}</Text> : null}
          <DrawerFormActions
            submitLabel="Buat Kategori"
            onCancel={() => setDrawerVisible(false)}
            onSubmit={() => void handleSubmit()}
            loading={saving}
          />
        </Box>
      </BottomDrawer>
    </DetailScreen>
  );
}
