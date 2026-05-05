import type { PageSeoInput } from "./types";

type PublicPageDefinition = Required<Pick<PageSeoInput, "path" | "title" | "description">> &
  Omit<PageSeoInput, "path" | "title" | "description">;

/**
 * Full SEO inputs for indexable marketing / legal / auth entry routes.
 * Used by segment layouts + Json-LD (single source of truth).
 */
export const PUBLIC_PAGES_SEO = {
  privacyPolicy: {
    path: "/privacy-policy",
    title: "Privacy Policy",
    description:
      "Read how Muvment Host collects, uses, stores, and protects your personal data when you use our platform.",
    keywords: [
      "privacy policy",
      "data protection",
      "Muvment",
      "host platform",
      "personal information",
      "Nigeria",
    ],
  },
  termsOfService: {
    path: "/terms-of-service",
    title: "Terms of Service",
    description:
      "Terms and conditions for hosts using Muvment Host — fees, responsibilities, acceptable use, and dispute handling.",
    keywords: [
      "terms of service",
      "terms and conditions",
      "Muvment Host",
      "host agreement",
      "legal",
      "Nigeria",
    ],
  },
  cancellationPolicy: {
    path: "/cancellation-policy",
    title: "Cancellation Policy",
    description:
      "Understand cancellation rules, refunds, and host obligations for bookings made through Muvment Host.",
    keywords: [
      "cancellation policy",
      "refunds",
      "bookings",
      "Muvment Host",
      "trips",
      "Nigeria",
    ],
  },
  login: {
    path: "/login",
    title: "Sign in",
    description:
      "Sign in to your Muvment Host account to manage listings, bookings, payouts, and vehicle onboarding.",
    keywords: ["login", "sign in", "Muvment Host", "host account", "dashboard"],
  },
  signup: {
    path: "/signup",
    title: "Create your host account",
    description:
      "Register as a host on Muvment to onboard vehicles, accept bookings, and track earnings in one place.",
    keywords: ["sign up", "register", "host signup", "Muvment Host", "fleet"],
  },
} as const satisfies Record<string, PublicPageDefinition>;

export type PublicPageKey = keyof typeof PUBLIC_PAGES_SEO;
