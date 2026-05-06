import { Image } from 'expo-image';
import { Button, InputComponentProps } from '@mami/ui';

import { Box, Text } from '../../theme/theme';

type DaycareCreateLogoFieldProps = InputComponentProps<string> & {
  uploading?: boolean;
  onPickLogo: () => Promise<string | null>;
};

export function DaycareCreateLogoField({
  value,
  disabled,
  onChange,
  onPickLogo,
  uploading = false,
}: DaycareCreateLogoFieldProps) {
  return (
    <Box gap="sm">
      {value ? (
        <Image source={{ uri: value }} style={{ width: 72, height: 72, borderRadius: 12 }} contentFit="cover" />
      ) : (
        <Box
          alignItems="center"
          justifyContent="center"
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            backgroundColor: '#F1F5F9',
            borderWidth: 1,
            borderColor: '#E2E8F0',
          }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Logo</Text>
        </Box>
      )}
      <Button
        label={uploading ? 'Mengunggah...' : value ? 'Ganti Logo' : 'Upload Logo'}
        variant="secondary"
        disabled={disabled || uploading}
        onPress={() => {
          void (async () => {
            const nextValue = await onPickLogo();
            if (nextValue) {
              onChange(nextValue);
            }
          })();
        }}
      />
    </Box>
  );
}
