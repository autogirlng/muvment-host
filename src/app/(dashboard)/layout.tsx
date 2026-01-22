"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/lib/hooks";
import { FullPageSpinner } from "@/ui";
import { SideNav, MobileNav, TopHeader } from "@/components/Navbar";
import useUser from "@/hooks/useUser";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isLoading, user } = useAppSelector((state) => state.user);
    const { getUser } = useUser();

    useEffect(() => {
        if (user) {
            if (
                pathname.includes("/account-setup") ||
                pathname.includes("/notifications") ||
                pathname.includes("/profile") ||
                pathname.includes("/settings")
            ) {
                return;
            }
            if (
                pathname !== "/dashboard" &&
                (!user?.data.phoneVerified)
            ) {
                router.push("/account-setup");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, pathname]);

    if (isLoading || getUser.isLoading) {
        return <FullPageSpinner />;
    }

    return (
        <main className="">
            {pathname.includes("/vehicle-onboarding") ? (
                children
            ) : (
                <>
                    <MobileNav user={user ?? null} />
                    <SideNav />
                    <div className="w-full md:w-[calc(100%-250px)] 2xl:w-[calc(100%-272px)] ml-0 md:ml-[250px] 2xl:ml-[272px] shadow-[12px_4px_100px_0px_#00000012">
                        <TopHeader />
                        <div className="px-4 md:px-6 2xl:px-8">{children}</div>
                    </div>
                </>
            )}
        </main>
    );
}
