import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role?: "HOST" | "CUSTOMER" | string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    firstName: string;
    lastName: string;
    role?: "HOST" | "CUSTOMER" | string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
    role?: "HOST" | "CUSTOMER" | string;
  }
}
