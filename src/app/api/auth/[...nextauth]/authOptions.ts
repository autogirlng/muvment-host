import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  NEXTAUTH_CREDENTIALS_SESSION_MARKER,
  resolveAuthLoginUrl,
  resolveUsersMeUrl,
  UserType,
} from "@/utils/constants";

function readPayload(json: Record<string, unknown>): Record<string, unknown> {
  const data = json.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return json;
}

function pickString(
  obj: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return undefined;
}

export const authOptions: NextAuthOptions = {
  // trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const extra = credentials as Record<string, unknown>;
        const tokenFromClient =
          typeof extra.accessToken === "string" && extra.accessToken.length > 0
            ? extra.accessToken
            : undefined;

        if (tokenFromClient) {
          const meRes = await fetch(resolveUsersMeUrl(), {
            headers: {
              Authorization: `Bearer ${tokenFromClient}`,
              Accept: "application/json",
            },
          });

          let meJson: Record<string, unknown>;
          try {
            meJson = (await meRes.json()) as Record<string, unknown>;
          } catch {
            throw new Error("Invalid profile response");
          }

          if (!meRes.ok) {
            const msg =
              typeof meJson.message === "string"
                ? meJson.message
                : "Session validation failed";
            throw new Error(msg);
          }

          const profile = readPayload(meJson);
          const userId =
            pickString(profile, "userId", "user_id", "id", "sub") ?? "";
          const email =
            pickString(profile, "email") ?? String(credentials.email ?? "");
          const firstName =
            pickString(profile, "firstName", "first_name") ?? "";
          const lastName = pickString(profile, "lastName", "last_name") ?? "";
          const refreshToken =
            typeof extra.refreshToken === "string" ? extra.refreshToken : "";

          return {
            id: userId,
            email,
            name: `${firstName} ${lastName}`.trim() || email,
            accessToken: tokenFromClient,
            refreshToken,
            firstName,
            lastName,
          };
        }

        if (
          !credentials.password ||
          credentials.password === NEXTAUTH_CREDENTIALS_SESSION_MARKER
        ) {
          return null;
        }

        const loginUrl = resolveAuthLoginUrl();

        const res = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            userType: UserType.HOST,
          }),
        });

        let json: Record<string, unknown>;
        try {
          json = (await res.json()) as Record<string, unknown>;
        } catch {
          throw new Error("Login failed");
        }

        const payload = readPayload(json);
        const accessToken = pickString(
          payload,
          "accessToken",
          "access_token",
          "token"
        );
        const refreshToken =
          pickString(payload, "refreshToken", "refresh_token") ?? "";

        if (!res.ok || !accessToken) {
          const msg =
            typeof json.message === "string"
              ? json.message
              : typeof json.data === "string"
                ? json.data
                : "Login failed";
          throw new Error(msg);
        }

        const userId =
          pickString(payload, "userId", "user_id", "id", "sub") ?? "";
        const email =
          pickString(payload, "email") ?? String(credentials.email ?? "");
        const firstName = pickString(payload, "firstName", "first_name") ?? "";
        const lastName = pickString(payload, "lastName", "last_name") ?? "";

        return {
          id: userId,
          email,
          name: `${firstName} ${lastName}`.trim() || email,
          accessToken,
          refreshToken,
          firstName,
          lastName,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.userId = token.userId as string;
      session.user.email = token.email as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
