"use client";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { clearUser } from "@/lib/features/userSlice";
import { getClientStore } from "@/lib/storeHolder";
import { ReactNode, useState } from "react";
import { toast } from "react-toastify";

function sentBearerAuthorization(headers: unknown): boolean {
  if (!headers || typeof headers !== "object") return false;
  const h = headers as Record<string, unknown> & {
    get?: (name: string) => unknown;
  };
  const fromGet =
    typeof h.get === "function" ? h.get("Authorization") : undefined;
  const v =
    fromGet ?? h.Authorization ?? h.authorization;
  return typeof v === "string" && v.length > 0;
}

export default function ReactQueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error: unknown) => {
            if (!(error instanceof AxiosError)) return;
            const status = error.response?.status;
            if (status !== 401 && status !== 403) return;
            if (!sentBearerAuthorization(error.config?.headers)) return;
            toast.error("Session expired. Please log in again.");
            getClientStore()?.dispatch(clearUser());
            signOut({ callbackUrl: "/login?session_expired=true" });
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
