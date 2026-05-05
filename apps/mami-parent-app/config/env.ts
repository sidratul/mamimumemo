import Constants from 'expo-constants';
import { z } from 'zod';

const schema = z.object({
  apiBaseUrl: z.string().url(),
  graphqlUrl: z.string().url(),
});

const raw = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    Constants.expoConfig?.extra?.apiBaseUrl ??
    'https://api.example.com',
  graphqlUrl:
    process.env.EXPO_PUBLIC_GRAPHQL_URL ??
    Constants.expoConfig?.extra?.graphqlUrl ??
    'https://api.example.com/graphql',
};

const parsed = schema.safeParse(raw);

if (!parsed.success) {
  throw new Error(`Invalid app env: ${parsed.error.message}`);
}

export const env = parsed.data;
