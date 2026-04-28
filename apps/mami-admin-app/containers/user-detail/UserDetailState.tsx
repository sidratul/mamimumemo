import { ActivityIndicator } from 'react-native-paper';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Box, Text } from '../../theme/theme';

type UserDetailStateProps =
  | {
      type: 'loading';
    }
  | {
      type: 'error';
      message: string;
    };

export function UserDetailState(props: UserDetailStateProps) {
  return (
    <ScreenContainer>
      <Box
        backgroundColor="surface"
        borderColor="border"
        borderWidth={1}
        borderRadius="lg"
        padding="xl"
        gap="sm"
        marginHorizontal="xl"
        marginTop="xxl"
        alignItems={props.type === 'loading' ? 'center' : undefined}>
        {props.type === 'loading' ? (
          <>
            <ActivityIndicator color="#4D96FF" />
            <Text color="textSecondary">Memuat detail user...</Text>
          </>
        ) : (
          <>
            <Text color="danger" style={{ fontWeight: '700' }}>
              Detail user tidak tersedia
            </Text>
            <Text color="textSecondary">{props.message}</Text>
          </>
        )}
      </Box>
    </ScreenContainer>
  );
}
