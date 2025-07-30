export const RESPONSE_STATUSES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  FOUND: 302,
  NOT_FOUND: 404,
  SERVER: 500,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
} as const;

export const BACKEND_RESOURCES = {
  AUTH: "/auth",
  USERS: "/users",
  CONVERSATIONS: "/conversations",
  MESSAGES: "/messages",
} as const;
