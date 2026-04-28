import { ScreenHeader } from '@mami/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../../providers/session-provider';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SettingsAccountSection } from './SettingsAccountSection';

export function SettingsContainer() {
  const { signOut } = useSession();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScreenContainer>
        <ScreenHeader title="Settings" subtitle="Area konfigurasi admin." />
        <SettingsAccountSection onSignOut={() => void signOut()} />
      </ScreenContainer>
    </SafeAreaView>
  );
}
