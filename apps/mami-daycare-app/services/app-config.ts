import { deletePersistedItem, getPersistedItem, setPersistedItem } from '@mami/core';

import { DEFAULT_GRAPHQL_URL, env } from '../config/env';
import { isDesktopRuntime } from './desktop/runtime';

const APP_CONFIG_KEY = 'mami_daycare_app_config';

export type DaycareAppConfig = {
  graphqlUrl: string;
};

const listeners = new Set<(config: DaycareAppConfig) => void>();

function normalizeGraphqlUrl(value: string) {
  return value.trim();
}

function validateGraphqlUrl(value: string) {
  const normalized = normalizeGraphqlUrl(value);

  try {
    const url = new URL(normalized);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('URL harus memakai http atau https.');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'URL harus memakai http atau https.') {
      throw error;
    }
    throw new Error('URL GraphQL tidak valid.');
  }

  return normalized;
}

function notify(config: DaycareAppConfig) {
  listeners.forEach((listener) => listener(config));
}

export function getDefaultAppConfig(): DaycareAppConfig {
  return {
    graphqlUrl: env.graphqlUrl || DEFAULT_GRAPHQL_URL,
  };
}

export async function getDaycareAppConfig() {
  const saved = await getPersistedItem(APP_CONFIG_KEY);
  if (!saved) {
    return getDefaultAppConfig();
  }

  try {
    const parsed = JSON.parse(saved) as Partial<DaycareAppConfig>;
    return {
      ...getDefaultAppConfig(),
      ...parsed,
      graphqlUrl: parsed.graphqlUrl ? validateGraphqlUrl(parsed.graphqlUrl) : getDefaultAppConfig().graphqlUrl,
    };
  } catch {
    await deletePersistedItem(APP_CONFIG_KEY);
    return getDefaultAppConfig();
  }
}

export async function getConfiguredGraphqlUrl() {
  return (await getDaycareAppConfig()).graphqlUrl;
}

export async function saveDaycareAppConfig(config: DaycareAppConfig) {
  const nextConfig = {
    graphqlUrl: validateGraphqlUrl(config.graphqlUrl),
  };

  await setPersistedItem(APP_CONFIG_KEY, JSON.stringify(nextConfig));
  notify(nextConfig);
  return nextConfig;
}

export async function resetDaycareAppConfig() {
  const defaultConfig = getDefaultAppConfig();
  await deletePersistedItem(APP_CONFIG_KEY);
  notify(defaultConfig);
  return defaultConfig;
}

export function subscribeDaycareAppConfig(listener: (config: DaycareAppConfig) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function checkGraphqlConnection(graphqlUrl: string) {
  const url = validateGraphqlUrl(graphqlUrl);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'query DesktopHealthCheck { __typename }',
    }),
  });

  if (!response.ok) {
    throw new Error(`API merespons HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as { data?: unknown; errors?: { message?: string }[] };
  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message || 'API GraphQL menolak request.');
  }

  return true;
}

export const daycareRuntime = {
  isDesktop: isDesktopRuntime,
};
