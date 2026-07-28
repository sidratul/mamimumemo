import { deletePersistedItem, getPersistedItem, setPersistedItem } from '@mami/core';

const SESSION_KEY = 'mami_daycare_session';

export type DaycareSession = {
  token: string;
  refreshToken?: string;
  daycareId: string;
  ownerEmail: string;
  ownerName: string;
};

function normalizeDaycareId(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const candidate = value as { id?: unknown; _id?: unknown; toString?: unknown };

    if (typeof candidate.id === 'string') return candidate.id;
    if (typeof candidate._id === 'string') return candidate._id;
    if (typeof candidate.id === 'object' && candidate.id && typeof (candidate.id as { toString?: unknown }).toString === 'function') {
      const next = (candidate.id as { toString: () => string }).toString();
      if (next && next !== '[object Object]') return next;
    }
    if (typeof candidate._id === 'object' && candidate._id && typeof (candidate._id as { toString?: unknown }).toString === 'function') {
      const next = (candidate._id as { toString: () => string }).toString();
      if (next && next !== '[object Object]') return next;
    }
    if (typeof candidate.toString === 'function') {
      const next = candidate.toString();
      if (next && next !== '[object Object]') return next;
    }
  }

  return '';
}

function normalizeSession(session: unknown): DaycareSession | null {
  if (!session || typeof session !== 'object') {
    return null;
  }

  const current = session as Partial<DaycareSession> & { daycareId?: unknown };
  const daycareId = normalizeDaycareId(current.daycareId);

  if (!daycareId || typeof current.token !== 'string' || typeof current.ownerEmail !== 'string' || typeof current.ownerName !== 'string') {
    return null;
  }

  return {
    token: current.token,
    refreshToken: typeof current.refreshToken === 'string' ? current.refreshToken : undefined,
    daycareId,
    ownerEmail: current.ownerEmail,
    ownerName: current.ownerName,
  };
}

const listeners = new Set<(session: DaycareSession | null) => void>();

function notify(session: DaycareSession | null) {
  for (const listener of listeners) {
    listener(session);
  }
}

export async function getDaycareSession() {
  const raw = await getPersistedItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const session = normalizeSession(parsed);

    if (!session) {
      await deletePersistedItem(SESSION_KEY);
      notify(null);
      return null;
    }

    if (JSON.stringify(parsed) !== JSON.stringify(session)) {
      await setPersistedItem(SESSION_KEY, JSON.stringify(session));
    }

    return session;
  } catch {
    await deletePersistedItem(SESSION_KEY);
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
  const normalized = normalizeSession(session);
  if (!normalized) {
    await deletePersistedItem(SESSION_KEY);
    notify(null);
    return;
  }

  await setPersistedItem(SESSION_KEY, JSON.stringify(normalized));
  notify(normalized);
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
  await deletePersistedItem(SESSION_KEY);
  notify(null);
}
