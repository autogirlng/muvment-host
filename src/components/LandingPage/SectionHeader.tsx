import cn from "classnames";
import { ReactNode } from "react";

type Props = {
    title: string;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    children?: ReactNode;
};

export function SectionHeader({
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
    children,
}: Props) {
    return (
        <div className={cn("space-y-[11px]", className)}>
            <h1 className={cn("text-h3 md:text-h2 3xl:text-h1", titleClassName)}>
                {title}
            </h1>
            {description && (
                <p
                    className={cn(
                        "text-sm md:text-base 3xl:text-h6",
                        descriptionClassName
                    )}
                >
                    {description}
                </p>
            )}
            {children}
        </div>
    );
}
