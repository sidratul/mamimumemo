import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  clearDaycareSession,
  getDaycareSession,
  setDaycareSession,
  subscribeDaycareSession,
  type DaycareSession,
} from '../services/storage/session';

type SessionContextValue = {
  isLoading: boolean;
  session: DaycareSession | null;
  saveSession: (session: DaycareSession) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<DaycareSession | null>(null);

  useEffect(() => {
    async function hydrate() {
      try {
        const saved = await getDaycareSession();
        setSession(saved);
      } finally {
        setIsLoading(false);
      }
    }

    void hydrate();
    return subscribeDaycareSession((nextSession) => {
      setSession(nextSession);
    });
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      isLoading,
      session,
      saveSession: async (nextSession) => {
        await setDaycareSession(nextSession);
        setSession(nextSession);
      },
      signOut: async () => {
        await clearDaycareSession();
        setSession(null);
      },
    }),
    [isLoading, session]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside SessionProvider');
  }
  return context;
}
