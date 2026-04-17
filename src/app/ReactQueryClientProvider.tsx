"use client";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { ReactNode, useState } from "react";
import { toast } from "react-toastify";

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
            const err = error as { response?: { status?: number } };
            if (err?.response?.status === 401 || err?.response?.status === 403) {
              toast.error("Session expired. Please log in again.");
              signOut({ callbackUrl: "/login?session_expired=true" });
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
