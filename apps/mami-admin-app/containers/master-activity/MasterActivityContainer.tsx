import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Switch } from 'react-native-paper';
import {
  BottomDrawer,
  Button,
  DetailScreen,
  DrawerFormActions,
  SelectInput,
} from '@mami/ui';

import { TextField } from '../../components/input';
import { listActivityCategories } from '../../services/activity-category';
import {
  createMasterActivity,
  listMasterActivities,
  updateMasterActivity,
  type MasterActivityDefinition,
} from '../../services/master-activity';
import { Box, Text } from '../../theme/theme';

export function MasterActivityContainer() {
  const router = useRouter();
  const [activities, setActivities] = useState<MasterActivityDefinition[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
  const [editing, setEditing] = useState<MasterActivityDefinition | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('30');
  const [isStarter, setIsStarter] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const [activityData, categoryData] = await Promise.all([
        listMasterActivities(),
        listActivityCategories(),
      ]);
      setActivities(activityData);
      setCategoryOptions(
        categoryData
          .filter((item) => item.isActive)
          .map((item) => ({ label: item.defaultLabel, value: item.code })),
      );
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil master aktivitas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openForm(activity?: MasterActivityDefinition) {
    setEditing(activity ?? null);
    setName(activity?.name ?? '');
    setCategory(activity?.category ?? categoryOptions[0]?.value ?? '');
    setDuration(String(activity?.defaultDuration ?? 30));
    setIsStarter(activity?.isStarter ?? false);
    setError('');
    setDrawerVisible(true);
  }

  async function handleSubmit() {
    const defaultDuration = Number(duration);
    if (!name.trim() || !category || !Number.isFinite(defaultDuration) || defaultDuration <= 0) {
      setError('Nama, kategori, dan durasi yang valid wajib diisi.');
      return;
    }
    try {
      setSaving(true);
      const input = {
        name: name.trim(),
        category,
        defaultDuration,
        isStarter,
      };
      if (editing) {
        await updateMasterActivity(editing.id, input);
      } else {
        await createMasterActivity(input);
      }
      setDrawerVisible(false);
      await load();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal menyimpan master aktivitas.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DetailScreen title="Master Aktivitas" onBack={() => router.back()}>
      <Box flexDirection="row" justifyContent="flex-end">
        <Button label="Tambah Master" onPress={() => openForm()} />
      </Box>

      {loading ? <Text color="textSecondary">Memuat master aktivitas...</Text> : null}
      {error && !drawerVisible ? <Text color="danger">{error}</Text> : null}

      <Box gap="md">
        {activities.map((activity) => (
          <Box
            key={activity.id}
            padding="md"
            borderWidth={1}
            borderColor="border"
            borderRadius="md"
            backgroundColor="surface"
            gap="sm"
          >
            <Box flexDirection="row" justifyContent="space-between">
              <Box gap="xxs">
                <Text fontWeight="800">{activity.name}</Text>
                <Text variant="bodySmall" color="textSecondary">
                  {activity.category} · {activity.defaultDuration} menit · v{activity.version}
                </Text>
              </Box>
              <Text color={activity.isStarter ? 'success' : 'textSecondary'}>
                {activity.isStarter ? 'Starter' : 'Opsional'}
              </Text>
            </Box>
            <Button label="Ubah" variant="secondary" onPress={() => openForm(activity)} />
          </Box>
        ))}
      </Box>

      <BottomDrawer visible={drawerVisible} onDismiss={() => setDrawerVisible(false)}>
        <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 16 }}>
          {editing ? 'Ubah Master Aktivitas' : 'Tambah Master Aktivitas'}
        </Text>
        <Box gap="md">
          <TextField value={name} onChange={setName} placeholder="Nama aktivitas" />
          <SelectInput
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            title="Kategori"
            placeholder="Pilih kategori"
          />
          <TextField value={duration} onChange={setDuration} placeholder="Durasi (menit)" />
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text>Otomatis ditambahkan saat daycare disetujui</Text>
            <Switch value={isStarter} onValueChange={setIsStarter} />
          </Box>
          {error ? <Text color="danger">{error}</Text> : null}
          <DrawerFormActions
            submitLabel="Simpan"
            onCancel={() => setDrawerVisible(false)}
            onSubmit={() => void handleSubmit()}
            loading={saving}
          />
        </Box>
      </BottomDrawer>
    </DetailScreen>
  );
}
