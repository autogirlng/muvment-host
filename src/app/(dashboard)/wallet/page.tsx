"use client";

import dynamic from "next/dynamic";

const Wallet = dynamic(() => import("@/components/Wallet"), { ssr: false });

export default function WalletPage() {
    return (
        <main className="py-11 space-y-11">
            <Wallet />
        </main>
    );
}
