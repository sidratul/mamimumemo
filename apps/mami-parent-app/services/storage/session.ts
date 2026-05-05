import { deletePersistedItem, getPersistedItem, setPersistedItem } from '@mami/core';

const ACCESS_TOKEN_KEY = 'mami_parent_access_token';
const REFRESH_TOKEN_KEY = 'mami_parent_refresh_token';
const PROFILE_KEY = 'mami_parent_profile';

export type ParentProfile = {
  id: string;
  name: string;
  email: string;
  role: 'PARENT';
};

export type ParentStoredSession = {
  accessToken: string | null;
  refreshToken: string | null;
  profile: ParentProfile | null;
};

const listeners = new Set<(session: ParentStoredSession) => void>();

function notify(session: ParentStoredSession) {
  for (const listener of listeners) {
    listener(session);
  }
}

export async function getSessionToken() {
  return getPersistedItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return getPersistedItem(REFRESH_TOKEN_KEY);
}

export async function getStoredProfile() {
  const raw = await getPersistedItem(PROFILE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ParentProfile;
  } catch {
    await deletePersistedItem(PROFILE_KEY);
    return null;
  }
}

export async function getStoredSession(): Promise<ParentStoredSession> {
  const [accessToken, refreshToken, profile] = await Promise.all([
    getSessionToken(),
    getRefreshToken(),
    getStoredProfile(),
  ]);

  return {
    accessToken,
    refreshToken,
    profile,
  };
}

export function subscribeSession(listener: (session: ParentStoredSession) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function setSession(
  accessToken: string,
  refreshToken: string | undefined,
  profile: ParentProfile,
) {
  await setPersistedItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    await setPersistedItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await deletePersistedItem(REFRESH_TOKEN_KEY);
  }
  await setPersistedItem(PROFILE_KEY, JSON.stringify(profile));

  notify({
    accessToken,
    refreshToken: refreshToken ?? null,
    profile,
  });
}

export async function updateSessionTokens(accessToken: string, refreshToken?: string) {
  const current = await getStoredSession();
  if (!current.profile) {
    await clearSession();
    return;
  }

  await setSession(accessToken, refreshToken, current.profile);
}

export async function updateStoredProfile(profile: ParentProfile) {
  const current = await getStoredSession();
  if (!current.accessToken) {
    return;
  }

  await setSession(current.accessToken, current.refreshToken ?? undefined, profile);
}

export async function clearSession() {
  await Promise.all([
    deletePersistedItem(ACCESS_TOKEN_KEY),
    deletePersistedItem(REFRESH_TOKEN_KEY),
    deletePersistedItem(PROFILE_KEY),
  ]);

  notify({
    accessToken: null,
    refreshToken: null,
    profile: null,
  });
}
