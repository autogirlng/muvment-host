import React from "react";
import { AuthPageHeaderProps } from "./props";

export default function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
    return (
        <div className="space-y-2 2xl:space-y-3">
            <h1 className="text-h4 sm:text-h2 2xl:text-h1 font-medium text-black">{title}</h1>
            <p className="text-sm 2xl:text-base text-grey-500">{description}</p>
        </div>
    );
}
