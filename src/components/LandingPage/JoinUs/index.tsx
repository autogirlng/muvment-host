import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SectionHeader } from "@/components/LandingPage/SectionHeader";
import { Button } from "@/ui";



function JoinUs() {
    return (
        <section className="bg-primary-500 relative">
            <div className="flex items-center justify-center gap-[117px] lg:w-3/5">
                <div className="w-full md:max-w-[740px] xl:max-w-[950px] px-11">
                    <SectionHeader
                        className="pt-[101px] md:pt-[170px] lg:pt-[170px] xl:pt-[170px] 2xl:pt-[200px] 3xl:pt-[355px] pb-[101px] md:pb-[170px] lg:pb-[170px] xl:pb-[190px] 2xl:pb-[250px] 3xl:pb-[411px] text-white text-center lg:text-left space-y-3"
                        title="No experience needed to join the Muvment platform"
                        description=" Whether you’re an individual looking to earn extra income or a business wanting to manage and expand your fleet, our platform caters to all. Join 100+ hosts who are maximizing their vehicle’s potential."
                    >
                        <br />
                        <Link href="/signup">
                            <Button color="white" variant="filled" radius="lg">
                                Sign Up
                            </Button>
                        </Link>
                    </SectionHeader>
                </div>
                <div className="md:absolute top-0 right-0 lg:w-[35%] xl:w-[33%] 3xl:w-2/5 h-full hidden lg:block md:min-w-[420px] 3xl:min-w-[675px]">
                    <Image
                        src="/images/landing/join_us.png"
                        alt=""
                        width={720}
                        height={1080}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </section>

    );
}

export { JoinUs };
