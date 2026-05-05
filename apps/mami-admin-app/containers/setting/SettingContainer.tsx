import { Screen } from '@mami/ui';

import { useSession } from '../../providers/session-provider';
import { SettingsAccountSection } from './SettingsAccountSection';

export function SettingsContainer() {
  const { signOut } = useSession();

  return (
    <Screen title="Settings" subtitle="Area konfigurasi admin.">
      <SettingsAccountSection onSignOut={() => void signOut()} />
    </Screen>
  );
}
