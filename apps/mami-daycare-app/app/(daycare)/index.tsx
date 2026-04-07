import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';

import { useSession } from '../../providers/session-provider';
import { getMyDaycareRegistration } from '../../services/registration';

export default function DaycareHomeScreen() {
  const { isLoading, session } = useSession();
  const [target, setTarget] = useState<'/(daycare)/registration-status' | '/(daycare)/operations' | null>(null);

  useEffect(() => {
    async function resolveTarget() {
      if (!session) {
        return;
      }

      try {
        const registration = await getMyDaycareRegistration(session.token);
        setTarget(registration?.approvalStatus === 'APPROVED' ? '/(daycare)/operations' : '/(daycare)/registration-status');
      } catch {
        setTarget('/(daycare)/registration-status');
      }
    }

    void resolveTarget();
  }, [session]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!target) {
    return null;
  }

  return <Redirect href={target} />;
}
