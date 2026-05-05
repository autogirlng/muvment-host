"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useAppSelector } from "@/lib/hooks";
import { FullPageSpinner } from "@/ui";
import { SideNav, MobileNav, TopHeader } from "@/components/Navbar";
import useUser from "@/hooks/useUser";

export default function DashboardLayoutClient({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, userToken } = useAppSelector((state) => state.user);
    const { status, data: session } = useSession();
    const { getUser } = useUser();

    const effectiveToken = session?.user?.accessToken ?? userToken;
    const sessionBusy = status === "loading" && !userToken;
    const profileBusy =
        !!effectiveToken &&
        !user?.data?.userId &&
        (getUser.isPending || getUser.isFetching);

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
                router.push("/settings/account-setup");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, pathname]);

    if (sessionBusy || profileBusy) {
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
