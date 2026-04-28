import { Button } from 'react-native-paper';
import { Image } from 'expo-image';
import { InputComponentProps } from '@mami/ui';

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
            borderRadius: 12,
            backgroundColor: '#EEF3FB',
            borderWidth: 1,
            borderColor: '#D7DDEA',
          }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#6F7E95' }}>Logo</Text>
        </Box>
      )}
      <Button
        mode="outlined"
        loading={uploading}
        disabled={disabled || uploading}
        onPress={() => {
          void (async () => {
            const nextValue = await onPickLogo();
            if (nextValue) {
              onChange(nextValue);
            }
          })();
        }}>
        {value ? 'Ganti Logo' : 'Upload Logo'}
      </Button>
    </Box>
  );
}
