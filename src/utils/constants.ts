import { SignupFormValues } from "@/types";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const baseAPIURL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Backend auth segment relative to `NEXT_PUBLIC_API_BASE_URL` (e.g. …/api → …/api/v1/auth/login).
 * Matches legacy host-app paths (`/v1/auth/...`).
 */
export const AUTH_API_BASE = "/auth";

/** Current-user profile (relative to API base), aligned with `/v1/auth/...`. */
export const USER_ME_PATH = "/users/me";

/** Same URL axios uses for login — used by NextAuth `authorize` fallback on the server. */
export function resolveAuthLoginUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return `${base}${AUTH_API_BASE}/login`;
}

/** Absolute URL for NextAuth `authorize` token validation (server-side fetch). */
export function resolveUsersMeUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return `${base}${USER_ME_PATH}`;
}

/**
 * Sent as `password` when the browser has already called `/v1/auth/login`; NextAuth `authorize`
 * must use `accessToken` + `/v1/users/me` instead of posting login again.
 */
export const NEXTAUTH_CREDENTIALS_SESSION_MARKER = "__nextauth_session_sync__";

export const fullNameRegEx = /^[A-Za-z'-]+\s[A-Za-z'-]+(?:\s[A-Za-z'-]+)*\s*$/;

export const phoneNumberRegEx = /^(\d{11})$/;

export const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const uppercaseRegex = /[A-Z]/;

export const lowercaseRegex = /[a-z]/;

export const numberRegex = /[0-9]/;

export const specialCharRegex = /[@$!#%*?_&]/;

export const spacesRegex = /^\S*$/;

// export const standardServiceFeeInPercentage = 0.2;

type PasswordCheckKey = keyof NonNullable<SignupFormValues["password_checks"]>;
export const passwordChecks: { label: string; check: PasswordCheckKey }[] = [
  { label: "8 characters long", check: "length" },
  { label: "One digit", check: "digit" },
  { label: "One uppercase character", check: "uppercase_letters" },
  { label: "One special character", check: "special_character" },
  { label: "One lowercase character", check: "lowercase_letters" },
  { label: "Must not include spaces", check: "no_space" },
];


export enum UserType {
  HOST="HOST"
}