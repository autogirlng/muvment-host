import Image from "next/image";
import { Fragment } from "react";
import { SectionHeader } from "../SectionHeader";

type Props = {};

type packageProps = {
    title: string;
    description: string;
};

const packages: packageProps[] = [
    {
        title: "Airport Pickups",
        description:
            "Optimize your vehicle’s earning potential with Airport pickup services. This option is perfect for hosts looking for a high-return but low-maintenance service.",
    },
    {
        title: "\u00A0Single Day Trips",
        description:
            "Rent out your vehicle for 12 hours, complete with a driver, and enjoy income from just one booking.",
    },
    {
        title: "Multiple Day Trips",
        description:
            "Benefit from extended rental with long-term bookings, allowing you to earn more from a single vehicle over several days - including monthly extensions.",
    },
];

export function VehiclePackages({ }: Props) {
    return (
        <section className="py-[120px] lg:pt-24 3xl:pt-[107px] lg:pb-[150px] 3xl:pb-[200px] px-5">
            <div className="space-y-10 md:space-y-[100px] 3xl:space-y-[157px] max-w-[1100px] 3xl:max-w-[1510px] mx-auto">
                <SectionHeader
                    className="text-primary-900 text-center"
                    title="There is a plan and package for every vehicle owner"
                />
                <div className="flex flex-col md:flex-row items-center gap-[70px] md:gap-6 lg:gap-[60px] 3xl:gap-[125px] mx-auto md:max-w-full">
                    {packages.map((item, index) => (
                        <Fragment key={index}>
                            <div className="max-w-[400px] md:max-w-[375px] w-full space-y-[22px] px-8 md:px-4">
                                <div className="flex space-x-2">
                                    {Array.from({ length: index + 1 }, (_, num) => (
                                        <Image
                                            key={num}
                                            src={`/images/landing/polygon${num + 1}.png`}
                                            alt=""
                                            width={60}
                                            height={60}
                                            className="w-9 3xl:w-[60px] object-cover"
                                        />
                                    ))}
                                </div>

                                <h3 className="text-h4 3xl:text-h3 !font-bold">{item.title}</h3>
                                <p className="text-base 3xl:text-h6">{item.description}</p>
                            </div>
                            {index < packages.length - 1 && (
                                <div className="hidden md:block w-[1px] h-[185px] bg-grey-300"></div>
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
