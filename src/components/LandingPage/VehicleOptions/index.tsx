import Image from "next/image";
import Link from "next/link";
import React from "react";
import { truck, bus, suv, sedan } from "@/ui/assets";
import { Button } from "@/ui";
import { SectionHeader } from "../SectionHeader";
import { optionProps } from "@/components/LandingPage/props";


const vehicles: optionProps[] = [
    {
        image: sedan,
        type: "Sedan",
    },
    {
        image: suv,
        type: "SUV",
    },
    {
        image: truck,
        type: "Truck",
    },
    {
        image: bus,
        type: "Bus",
    },
];

function VehicleOptions() {
    return (
        <section className="px-5 pb-5 sm:pb-10 3xl:pb-[53px]">
            <div className="pt-[97px] pb-[155px] md:bg-grey-75 rounded-[75px] md:rounded-[97px] px-5">
                <div className="space-y-[114px]">
                    <SectionHeader
                        className="max-w-[860px] mx-auto text-primary-900 text-center "
                        title="No limitations"
                        description=" Anyone with a reliable car can turn their vehicle into a
              money-making asset. Whether you have a sedan, SUV, bus, or truck,
              there's a demand for your vehicle."
                    >
                        <br />
                        <Link href="/signup">
                            <Button variant="filled" color="primary" radius="md">
                                Get Started
                            </Button>
                        </Link>
                    </SectionHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[165px] gap-y-[93px] max-w-[746px] mx-auto px-5 sm:px-0">
                        {vehicles.map((option, index) => (
                            <div key={index} className="flex flex-col items-center gap-1.5">
                                <Image
                                    src={option.image}
                                    alt=""
                                    width={290}
                                    height={138}
                                    className="w-[200px] md:w-[250px] 3xl:w-[290px] object-cover"
                                />
                                <p className="text-base md:text-h6 !font-semibold">
                                    {option.type}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export { VehicleOptions };
