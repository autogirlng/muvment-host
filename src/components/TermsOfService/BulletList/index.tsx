import React from "react";
import { BulletListProps } from "@/components/TermsOfService/props";



export const BulletList = ({
    items,
    className = "text-blue-400",
}: BulletListProps) => (
    <ul className={`pl-2 space-y-2`}>
        {
            items.map((item, index) => (
                <p className={`"text-sm" ${className}`} key={index}>
                    {item}
                </p>
            ))
        }
    </ul>
);
