import React from "react";
import { SectionTitleProps } from "@/components/TermsOfService/props";

export const SectionTitle = ({
    children,
    className = "",
}: SectionTitleProps) => (
    <h2 className={`text-xl sm:text-2xl font-semibold mb-4 ${className}`}>
        {children}
    </h2>
);
