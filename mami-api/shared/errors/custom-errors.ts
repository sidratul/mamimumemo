import { GraphQLError } from "graphql";

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "VALIDATION_ERROR",
        http: { status: 400 },
      },
    });
  }
}

export class AuthenticationError extends GraphQLError {
  constructor(message: string = "Authentication required") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}

export class AuthorizationError extends GraphQLError {
  constructor(message: string = "Access denied") {
    super(message, {
      extensions: {
        code: "FORBIDDEN",
        http: { status: 403 },
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, {
      extensions: {
        code: "NOT_FOUND",
        http: { status: 404 },
      },
    });
  }
}

export class InternalServerError extends GraphQLError {
  constructor(message: string = "Internal server error") {
    super(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
}