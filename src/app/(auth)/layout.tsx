"use client";

import { ReactNode, useEffect, useState } from "react";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { logo_icon_white } from "@/ui/assets";
import { FullPageSpinner } from "@/ui/spinner";


export default function AuthLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(true);
    const { user_token } = useAuth();

    const otpRoutes = ["/verify-email", "/forgot-password/otp"];
    const isOtpScreen = otpRoutes.includes(pathname);

    useEffect(() => {
        if (user_token) {
            router.push("/dashboard");
        } else {
            setLoading(false);
        }
    }, [router, user_token]);

    if (loading) {
        return <FullPageSpinner />;
    }

    return (
        <main>
            <div className="min-h-screen h-full flex">
                <div className="hidden md:block w-1/2 h-auto relative">
                    <div className="fixed top-0 left-0 w-1/2 h-full">
                        <Link href="/" className="block absolute top-10 left-14 z-10">
                            <Image
                                className="w-16"
                                src={logo_icon_white}
                                alt="logo"
                                width={83}
                                height={83}
                            />
                        </Link>
                        <Image
                            className="h-full w-full object-cover"
                            src={`/images/auth/${pathname === "/login" ? "login_bg" : pathname === "/signup" ? "signup_bg" : "reset_password_bg"}.jpeg`}
                            alt=""
                            width={1000}
                            height={1000}
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20" />
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex justify-center items-center px-5 sm:px-10 py-8 sm:py-14">
                    <div
                        className={cn(
                            "w-full",
                            isOtpScreen ? "max-w-[711px]" : "max-w-[534px]"
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
