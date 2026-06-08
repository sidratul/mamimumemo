import type { FormikHelpers } from 'formik';
import { BottomDrawer, Button, DynamicForm } from '@mami/ui';

import { Box, Text } from '../../../theme/theme';
import type { MasterActivity } from '../../../services/operations/master-activities';
import {
  masterActivityFormFields,
  masterActivityFormSchema,
  type MasterActivityFormValue,
} from './master-activity-form.schema';

type MasterActivityFormDrawerProps = {
  visible: boolean;
  value: MasterActivityFormValue;
  editingActivity: MasterActivity | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (value: MasterActivityFormValue, helper: FormikHelpers<MasterActivityFormValue>) => void | Promise<void>;
};

export function MasterActivityFormDrawer({
  visible,
  value,
  editingActivity,
  loading,
  onClose,
  onSubmit,
}: MasterActivityFormDrawerProps) {
  return (
    <BottomDrawer visible={visible} onDismiss={onClose}>
      <Box gap="xs">
        <Text fontSize={20} fontWeight="800" color="textPrimary">
          {editingActivity ? 'Ubah Aktivitas' : 'Buat Aktivitas'}
        </Text>
        <Text variant="bodySmall" color="textSecondary">
          Aktivitas ini akan tersedia untuk dipakai di template daycare.
        </Text>
      </Box>

      <DynamicForm<MasterActivityFormValue>
        fields={masterActivityFormFields}
        data={value}
        schema={masterActivityFormSchema}
        submitLabel={loading ? 'Menyimpan...' : editingActivity ? 'Simpan Perubahan' : 'Simpan Aktivitas'}
        loading={loading}
        onSubmit={onSubmit}
      />

      <Button label="Batal" variant="secondary" onPress={onClose} />
    </BottomDrawer>
  );
}
