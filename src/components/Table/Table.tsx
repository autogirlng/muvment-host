import cn from "classnames";
import { ReactNode } from "react";
import {
    tableBodyClass,
    tableClass,
    tableInnerClass,
    tableRowClass,
    tableWrapperClass,
} from "./tableStyles";

type TableProps = {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
    /** Desktop: scroll table body with sticky column headers */
    stickyHeader?: boolean;
};

export function Table({
    children,
    className,
    innerClassName,
    stickyHeader = false,
}: TableProps) {
    return (
        <div className={cn(tableWrapperClass, className)}>
            <div
                className={cn(
                    tableInnerClass,
                    stickyHeader &&
                        "lg:max-h-[min(560px,calc(100vh-16rem))] lg:overflow-y-auto lg:overscroll-contain",
                    innerClassName
                )}
            >
                <table className={tableClass}>{children}</table>
            </div>
        </div>
    );
}

export function TableBody({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <tbody className={cn(tableBodyClass, className)}>{children}</tbody>;
}

export function TableRow({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <tr className={cn(tableRowClass, className)}>{children}</tr>;
}
