import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardLayoutClient from "./DashboardLayoutClient";
import { authenticatedShellMetadata } from "@/lib/seo";

/** Authenticated host shell — block indexing/crawling hints for every dashboard route. */
export const metadata: Metadata = authenticatedShellMetadata();

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
