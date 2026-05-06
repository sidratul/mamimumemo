import { Divider, List } from 'react-native-paper';
import { Button } from '@mami/ui';

import { DaycareDetailSection } from './DaycareDetailSection';
import { Box, Text } from '../../theme/theme';

type DaycareDocumentsSectionProps = {
  legalDocuments: {
    type: string;
    url: string;
    verified: boolean;
  }[];
  getDocumentName: (value: string) => string;
  onOpenDocument: (url: string) => void;
  onPressUpdate: () => void;
};

export function DaycareDocumentsSection({
  legalDocuments,
  getDocumentName,
  onOpenDocument,
  onPressUpdate,
}: DaycareDocumentsSectionProps) {
  return (
    <DaycareDetailSection title="Dokumen">
      {legalDocuments.length === 0 ? (
        <Text color="textSecondary">Belum ada dokumen.</Text>
      ) : (
        <Box>
          {legalDocuments.map((document, index) => (
            <Box key={`${document.type}-${index}`}>
              {index > 0 ? <Divider /> : null}
              <List.Item
                title={document.type}
                description={getDocumentName(document.url)}
                onPress={() => onOpenDocument(document.url)}
                left={() => (
                  <Box
                    width={28}
                    height={28}
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      backgroundColor: document.verified ? '#E7F7EF' : '#F0EAFF',
                      borderRadius: 8,
                      marginLeft: 12,
                      marginTop: 10,
                    }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: document.verified ? '#34B27B' : '#8B6DFF' }}>
                      {document.type.charAt(0).toUpperCase()}
                    </Text>
                  </Box>
                )}
                right={() => <List.Icon icon="chevron-right" />}
              />
            </Box>
          ))}
        </Box>
      )}
      <Button label="Upload Dokumen" onPress={onPressUpdate} variant="secondary" />
    </DaycareDetailSection>
  );
}
