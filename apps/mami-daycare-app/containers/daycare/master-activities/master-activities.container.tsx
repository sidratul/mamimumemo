import { useEffect, useMemo, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { Button, DetailScreen, FabButton, useConfirm, useToast } from '@mami/ui';

import { Box, Text } from '../../../theme/theme';
import { useSession } from '../../../providers/session-provider';
import {
  createMasterActivity,
  deactivateMasterActivity,
  listMasterActivities,
  updateMasterActivity,
  type MasterActivity,
} from '../../../services/operations/master-activities';
import { MasterActivityFormDrawer, type MasterActivityFormValue } from './master-activity-form-drawer';
import {
  initialMasterActivityFormValue,
  normalizeMasterActivityCategory,
} from './master-activity-form.schema';

function getCategoryLabel(category: MasterActivity['category']) {
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
  }
}

export function MasterActivitiesContainer() {
  const router = useRouter();
  const { isLoading, session } = useSession();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  const [activities, setActivities] = useState<MasterActivity[]>([]);
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
        const data = await listMasterActivities(session.token, session.daycareId, true);
        setActivities(data);
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

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  function openCreateDrawer() {
    setEditingActivity(null);
    setFormValue(initialMasterActivityFormValue);
    setDrawerVisible(true);
  }

  function openEditDrawer(activity: MasterActivity) {
    setEditingActivity(activity);
    setFormValue({
      name: activity.name,
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
    if (!session.daycareId) {
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
        const updated = await updateMasterActivity(session.token, editingActivity.id, {
          name: value.name.trim(),
          category: normalizeMasterActivityCategory(value.category),
          defaultDuration: duration,
        });

        setActivities((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        showToast({ message: 'Aktivitas berhasil diperbarui.', tone: 'success' });
      } else {
        const created = await createMasterActivity(session.token, {
          daycareId: session.daycareId,
          name: value.name.trim(),
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
          const updated = await deactivateMasterActivity(session.token, activity.id);
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

  return (
    <DetailScreen title="Aktivitas" onBack={() => router.back()} backgroundColor="#FFFFFF">
      {screenLoading ? (
        <Text variant="bodySmall" color="textSecondary">Memuat aktivitas...</Text>
      ) : null}

      {!screenLoading && sortedActivities.length === 0 ? (
        <Box padding="md" borderRadius="xl" style={{ borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text variant="bodySmall" color="textSecondary">
            Belum ada master activity aktif untuk daycare ini.
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
        onClose={closeDrawer}
        onSubmit={handleSubmit}
      />
    </DetailScreen>
  );
}
