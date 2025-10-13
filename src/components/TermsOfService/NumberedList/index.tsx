import React from "react";
import { NumberedListProps } from "@/components/TermsOfService/props";


export const NumberedList = ({ items, className = "" }: NumberedListProps) => (
    <ol className={`list-decimal pl-6 space-y-4 ${className}`}>
        {items.map((item, index) => (
            <li key={index} className="text-base text-gray-800">
                {item.title && <h4 className="text-sm">{item.title}</h4>}
                {item.content && (
                    <p className="mt-1 text-sm text-gray-700 text-[14px]">
                        {item.content}
                    </p>
                )}
                {item.subItems && (
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex} className="text-gray-700  text-[14px]">
                                {subItem}
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        ))}
    </ol>
);
