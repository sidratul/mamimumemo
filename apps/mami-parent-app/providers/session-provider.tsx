import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { loginAsParent } from '../services/auth/auth';
import {
  clearSession,
  getStoredSession,
  setSession,
  subscribeSession,
  type ParentProfile,
  updateStoredProfile,
} from '../services/storage/session';

type SessionContextValue = {
  isLoading: boolean;
  token: string | null;
  isAuthenticated: boolean;
  user: ParentProfile | null;
  signIn: (values: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (values: { name: string; email: string }) => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ParentProfile | null>(null);

  useEffect(() => {
    async function hydrate() {
      try {
        const storedSession = await getStoredSession();
        setToken(storedSession.accessToken);
        setUser(storedSession.profile);
      } finally {
        setIsLoading(false);
      }
    }

    void hydrate();

    return subscribeSession((session) => {
      setToken(session.accessToken);
      setUser(session.profile);
    });
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      isLoading,
      token,
      isAuthenticated: Boolean(user),
      user,
      signIn: async ({ email, password }) => {
        const result = await loginAsParent(email, password);
        await setSession(result.accessToken, result.refreshToken, result.profile);
        setToken(result.accessToken);
        setUser(result.profile);
      },
      signOut: async () => {
        await clearSession();
        setToken(null);
        setUser(null);
      },
      updateProfile: async ({ name, email }) => {
        if (!user) {
          return;
        }

        const nextProfile: ParentProfile = {
          ...user,
          name,
          email,
        };

        await updateStoredProfile(nextProfile);
        setUser(nextProfile);
      },
    }),
    [isLoading, token, user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return context;
}
