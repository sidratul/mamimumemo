import { DrawerFormActions } from '@mami/ui';
import { Divider, IconButton } from 'react-native-paper';

import { TextField } from '../../components/input';
import { Box, Text } from '../../theme/theme';

type DocumentDraft = {
  type: string;
  url: string;
  verified: boolean;
};

type DaycareDocumentFormProps = {
  documents: DocumentDraft[];
  loading: boolean;
  error?: string;
  getDocumentName: (value: string) => string;
  onCancel: () => void;
  onChangeType: (index: number, value: string) => void;
  onUpload: (index: number) => void;
  onSubmit: () => void;
};

export function DaycareDocumentForm({
  documents,
  loading,
  error,
  getDocumentName,
  onCancel,
  onChangeType,
  onUpload,
  onSubmit,
}: DaycareDocumentFormProps) {
  return (
    <Box gap="md">
      {documents.map((document, index) => (
        <Box key={`document-${index}`} gap="sm">
          {index > 0 ? <Divider style={{ marginVertical: 4 }} /> : null}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Tipe dokumen</Text>
          <TextField
            placeholder="Contoh: NIB atau Akta Pendirian"
            value={document.type}
            onChange={(value) => onChangeType(index, value)}
            disabled={loading}
          />
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            gap="sm"
            paddingHorizontal="md"
            paddingVertical="sm"
            style={{
              borderWidth: 1,
              borderColor: '#D7DDEA',
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
            }}>
            <Box flex={1} gap="xs">
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>File dokumen</Text>
              <Text color="textSecondary" numberOfLines={2}>
                {getDocumentName(document.url)}
              </Text>
            </Box>
            <IconButton
              icon="upload"
              size={20}
              containerColor="#EEF3FF"
              iconColor="#4D96FF"
              loading={loading}
              disabled={loading}
              onPress={() => onUpload(index)}
            />
          </Box>
        </Box>
      ))}

      <Box flexDirection="row" gap="sm">
        <DrawerFormActions onCancel={onCancel} onSubmit={onSubmit} loading={loading} />
      </Box>

      {error ? <Text color="danger">{error}</Text> : null}
    </Box>
  );
}
