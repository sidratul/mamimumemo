type GraphqlLikeError = {
  message?: string;
  extensions?: Record<string, unknown>;
  path?: readonly (string | number)[];
};

type ApolloLikeError = {
  message?: string;
  graphQLErrors?: GraphqlLikeError[];
  networkError?: {
    message?: string;
    name?: string;
    statusCode?: number;
    result?: unknown;
  };
  cause?: unknown;
};

export function getApolloErrorMessage(error: unknown, fallback: string) {
  const apolloError = error as ApolloLikeError | undefined;

  if (apolloError?.graphQLErrors?.length) {
    return apolloError.graphQLErrors.map((item) => item.message).filter(Boolean).join('\n');
  }

  if (apolloError?.networkError?.message) {
    return apolloError.networkError.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function logApolloError(
  operation: string,
  error: unknown,
  extras?: Record<string, unknown>
) {
  const apolloError = error as ApolloLikeError | undefined;

  console.error(`[Apollo:${operation}] request failed`, {
    message: apolloError?.message ?? (error instanceof Error ? error.message : String(error)),
    graphQLErrors: apolloError?.graphQLErrors?.map((item) => ({
      message: item.message,
      path: item.path,
      code: item.extensions?.code,
    })),
    networkError: apolloError?.networkError
      ? {
          name: apolloError.networkError.name,
          message: apolloError.networkError.message,
          statusCode: apolloError.networkError.statusCode,
          result: apolloError.networkError.result,
        }
      : undefined,
    extras,
  });
}
