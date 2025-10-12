import React from "react";
import Link from "next/link";
import { Button } from "@/ui";

function GetStarted() {
    return (
        <section className="px-2 md:px-8 py-[120px] md:py-[200px]">
            <div className="bg-footer-overlay bg-no-repeat bg-cover bg-primary-500 h-[460px] md:h-[800px] 3xl:h-[965px] rounded-[63px] md:rounded-[177px] px-8">
                <div className="h-full w-full flex flex-col gap-3 md:gap-9 items-center justify-center text-white text-center">
                    <h1 className="text-h5 md:text-h2 3xl:text-h1 max-w-[900px]">
                        If you travel frequently, <br /> why let your car sit{" "}
                        <span className="text-warning-300">idle?</span>
                    </h1>
                    <p className="text-sm md:text-h3 3xl:text-4xl">
                        Rent it out and earn extra income while you’re away.
                    </p>
                    <br />
                    <Link href="/signup">
                        <Button color="white" variant="filled" radius="lg">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export { GetStarted };
