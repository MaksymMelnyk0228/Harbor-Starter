import type { AuthUser } from "../types";

const TOKEN_KEY = "harbor.token";

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function token(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(value: string | null) {
  if (value) localStorage.setItem(TOKEN_KEY, value);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const current = token();
  if (current) {
    headers.set("Authorization", `Bearer ${current}`);
  }

  const response = await fetch(path, { ...init, headers });
  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as
    | T
    | { error?: { message?: string; details?: unknown } };

  if (!response.ok) {
    const errorPayload = payload as { error?: { message?: string; details?: unknown } };
    throw new ApiError(
      response.status,
      errorPayload.error?.message ?? "Request failed",
      errorPayload.error?.details
    );
  }

  return payload as T;
}

export function saveSession(result: { token: string; user: AuthUser }) {
  setToken(result.token);
}
