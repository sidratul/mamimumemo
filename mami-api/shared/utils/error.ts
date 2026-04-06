export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

// You can add other custom error classes here
// export class AuthenticationError extends Error { ... }
// export class AuthorizationError extends Error { ... }
