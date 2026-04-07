import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'mami_daycare_session';

export type DaycareSession = {
  token: string;
  refreshToken?: string;
  daycareId: string;
  ownerEmail: string;
  ownerName: string;
};

const listeners = new Set<(session: DaycareSession | null) => void>();

function notify(session: DaycareSession | null) {
  for (const listener of listeners) {
    listener(session);
  }
}

export async function getDaycareSession() {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DaycareSession;
  } catch {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    notify(null);
    return null;
  }
}

export function subscribeDaycareSession(listener: (session: DaycareSession | null) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function setDaycareSession(session: DaycareSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  notify(session);
}

export async function updateDaycareSessionTokens(token: string, refreshToken?: string) {
  const current = await getDaycareSession();
  if (!current) {
    await clearDaycareSession();
    return;
  }

  const nextSession: DaycareSession = {
    ...current,
    token,
    refreshToken,
  };

  await setDaycareSession(nextSession);
}

export async function clearDaycareSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
  notify(null);
}
