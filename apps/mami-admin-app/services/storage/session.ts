import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'mami_admin_access_token';
const REFRESH_TOKEN_KEY = 'mami_admin_refresh_token';

export type AdminStoredSession = {
  accessToken: string | null;
  refreshToken: string | null;
};

const listeners = new Set<(session: AdminStoredSession) => void>();

function notify(session: AdminStoredSession) {
  for (const listener of listeners) {
    listener(session);
  }
}

export async function getSessionToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function getStoredSession(): Promise<AdminStoredSession> {
  const [accessToken, refreshToken] = await Promise.all([getSessionToken(), getRefreshToken()]);
  return {
    accessToken,
    refreshToken,
  };
}

export function subscribeSession(listener: (session: AdminStoredSession) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function setSessionToken(accessToken: string, refreshToken?: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
  notify({
    accessToken,
    refreshToken: refreshToken ?? null,
  });
}

export async function clearSessionToken() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  notify({
    accessToken: null,
    refreshToken: null,
  });
}
