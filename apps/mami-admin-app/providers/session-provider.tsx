import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { clearSessionToken, getSessionToken, setSessionToken } from '../services/storage/session';

type SessionContextValue = {
  isLoading: boolean;
  token: string | null;
  signIn: (accessToken: string, refreshToken?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

type SessionProviderProps = {
  children: React.ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function hydrate() {
      try {
        const storedToken = await getSessionToken();
        setToken(storedToken);
      } finally {
        setIsLoading(false);
      }
    }

    void hydrate();
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      isLoading,
      token,
      signIn: async (nextToken: string, refreshToken?: string) => {
        await setSessionToken(nextToken, refreshToken);
        setToken(nextToken);
      },
      signOut: async () => {
        await clearSessionToken();
        setToken(null);
      },
    }),
    [isLoading, token]
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
