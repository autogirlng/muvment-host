"use client";

import Link from "next/link";
import { Handshake, Settings, ChevronRight } from "lucide-react";

import { useMou } from "@/hooks/mou/useMou";

// Settings: show MOU status
function MouStatusCard() {
    const { useGetHostMou } = useMou();
    const mouQuery = useGetHostMou();
    const mou = mouQuery.data?.data?.[0];

    return (
        <Link href="/settings/mou">
            <div className="bg-white border border-grey-200 rounded-2xl p-6 2xl:p-8 flex items-center justify-between gap-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary-75 rounded-full text-primary-500">
                        <Handshake strokeWidth={1.5} className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg 2xl:text-xl font-semibold text-grey-700 tracking-wide">
                            MOU Agreement
                        </h3>
                        <p className="text-sm text-grey-500">
                            {mou ? `Status: ${mou.status}` : "Not submitted"}
                        </p>
                    </div>
                </div>
                <span className="text-grey-400">
                    <ChevronRight strokeWidth={1.5} className="w-5 h-5" />
                </span>
            </div>
        </Link>
    );
}

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <MouStatusCard />
            {/* Account Setup Card */}
            <Link href="/settings/account-setup">
                <div className="bg-white border border-grey-200 rounded-2xl p-6 2xl:p-8 flex items-center justify-between gap-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-primary-75 rounded-full text-primary-500">
                            <Settings strokeWidth={1.5} className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg 2xl:text-xl font-semibold text-grey-700 tracking-wide">
                                Account Setup
                            </h3>
                            <p className="text-sm text-grey-500">
                                Complete these tasks to get full access to Muvment&apos;s
                                functionalities
                            </p>
                        </div>
                    </div>
                    <span className="text-grey-400">
                        <ChevronRight strokeWidth={1.5} className="w-5 h-5" />
                    </span>
                </div>
            </Link>
        </div>
    );
}