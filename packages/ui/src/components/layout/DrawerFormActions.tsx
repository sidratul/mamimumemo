import { Button } from 'react-native-paper';

type DrawerFormActionsProps = {
  loading?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
};

export function DrawerFormActions({
  loading = false,
  cancelLabel = 'Batal',
  submitLabel = 'Simpan',
  onCancel,
  onSubmit,
  submitDisabled = false,
}: DrawerFormActionsProps) {
  return (
    <>
      <Button mode="outlined" style={{ flex: 1 }} disabled={loading} onPress={onCancel}>
        {cancelLabel}
      </Button>
      <Button mode="contained" style={{ flex: 1 }} loading={loading} disabled={loading || submitDisabled} onPress={onSubmit}>
        {submitLabel}
      </Button>
    </>
  );
}
