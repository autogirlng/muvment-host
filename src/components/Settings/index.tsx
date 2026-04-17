"use client";

import Link from "next/link";
import { Icons } from "@/ui";

export default function Settings() {
    return (
        <div className="space-y-8">
            {/* Account Setup Card */}
            <Link href="/settings/account-setup">
                <div className="bg-white border border-grey-200 rounded-2xl p-6 2xl:p-8 flex items-center justify-between gap-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-primary-75 rounded-full text-primary-500">
                            {Icons.ic_setting}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg 2xl:text-xl font-semibold text-grey-700">
                                Account Setup
                            </h3>
                            <p className="text-sm text-grey-500">
                                Complete these tasks to get full access to Muvment&apos;s
                                functionalities
                            </p>
                        </div>
                    </div>
                    <span className="text-grey-400 *:!w-5 *:!h-5">
                        {Icons.ic_chevron_right}
                    </span>
                </div>
            </Link>
        </div>
    );
}
