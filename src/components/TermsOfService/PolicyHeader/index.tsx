"use client";
import Image from "next/image";
import { PolicyHeaderProps } from "@/components/TermsOfService/props";
import { SectionTitle } from "@/components/TermsOfService/SectionTile";

export const PolicyHeader = ({
    title,
    imageSrc,
    date,
    bgColor = "bg-[#0673FF]",
}: PolicyHeaderProps) => {
    return (
        <div className={`relative h-64 lg:h-[500px] w-full ${bgColor}`}>
            {/* Centered content wrapper */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                {/* Image with text overlay */}
                <div className="relative w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 ">
                    <Image
                        src={imageSrc}
                        alt=""
                        fill
                        className="object-contain bg-[#141B341F]/12"
                        priority
                    />
                    <div className="absolute inset-0 flex items-center  justify-center m-1">
                        <SectionTitle className="text-white text-center text-lg md:text-h3 text-nowrap font-semibold">
                            {title}
                        </SectionTitle>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[-20px] right-4 bg-[#0D419B]/90 px-4 py-2 rounded-lg shadow-md z-20">
                <p className="text-xs md:text-sm font-medium text-white">
                    Last updated: {date}
                </p>
            </div>
        </div>
    );
};
