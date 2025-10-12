import Image from "next/image";
import React from "react";
import cn from "classnames";
import { SectionHeader } from "../SectionHeader";

type Props = {};

type featureProps = {
    title: string;
    description: string;
};

const features: featureProps[] = [
    {
        title: "Fleet Expansion Opportunities",
        description:
            "Grow your business with ease. Our platform supports multiple vehicle listings, helping you expand your fleet and increase your earnings.",
    },
    {
        title: "On-Demand Support",
        description:
            "Get help when you need it. Our on-demand support ensures you have assistance at your fingertips for any issues or questions.",
    },
    {
        title: "Booking Management",
        description:
            "Stay organized and efficient. Our comprehensive booking management tools allow you to track and manage all your rentals in one place.",
    },
    {
        title: "Instant Revenue Earnings",
        description:
            "Start earning immediately. Our platform enables you to see your earnings in real-time, giving you instant access to your hard-earned money.",
    },
];

function Overview({ }: Props) {
    return (
        <section className="lg:pb-[200px] px-5 sm:px-0">
            <div className="flex flex-col justify-center items-center gap-[28px] lg:gap-[77px]">
                <SectionHeader
                    className="text-h1 text-primary-900 text-center"
                    title="An all-in-one platform with..."
                />
                <div className="relative">
                    <div className="relative">
                        <Image
                            src="/images/landing/dashboard.png"
                            alt="dashboard"
                            width={719}
                            height={404}
                        />
                        <div className="hidden lg:block lg:absolute right-16 top-0">
                            <Image
                                src="/icons/stars.png"
                                alt="stars"
                                width={88}
                                height={84}
                            />
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "lg:absolute border border-grey-100 rounded-3xl p-8 3xl:p-10 backdrop-blur  w-full lg:w-[250px] xl:w-[370px] 3xl:w-[470px] 4xl:w-[574px] space-y-4 3xl:space-y-[22px]",
                                    index === 0 && "bottom-[137px] right-[608px]",
                                    index === 1 && "bottom-[137px] left-[608px]",
                                    index === 2 && "top-[375px] right-[405px]",
                                    index === 3 && "top-[375px] left-[405px]"
                                )}
                            >
                                <h3 className="text-h5 2xl:text-h4 3xl:text-h3">
                                    {feature.title}
                                </h3>
                                <p className="text-sm 2xl:text-base 3xl:text-h6">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* slider  */}
                </div>
            </div>
        </section>
    );
}

export default Overview;
