import Constants from 'expo-constants';
import { z } from 'zod';

const schema = z.object({
  graphqlUrl: z.string().url(),
});

const raw = {
  graphqlUrl:
    process.env.EXPO_PUBLIC_GRAPHQL_URL ??
    Constants.expoConfig?.extra?.graphqlUrl ??
    '',
};

const parsed = schema.safeParse(raw);

if (!parsed.success) {
  throw new Error(`Invalid daycare app env: ${parsed.error.message}`);
}

export const env = {
  graphqlUrl: parsed.data.graphqlUrl,
};
