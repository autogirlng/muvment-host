import cn from "classnames";
import { SectionHeaderProps } from "./props";


export function SectionHeader({
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
    children,
}: SectionHeaderProps) {
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
