import cn from "classnames";
import Link from "next/link";
import { ReactNode } from "react";
import { tableCellBaseClass, tableCellValueClass, tableMobileTitleClass } from "./tableStyles";

type TableActionCellProps = {
    title?: string;
    href: string;
    label: string;
    className?: string;
    icon?: ReactNode;
    variant?: "primary" | "outline";
};

const TableActionCell = ({
    title = "Actions",
    href,
    label,
    className,
    icon,
    variant = "outline",
}: TableActionCellProps) => (
    <td className={cn(tableCellBaseClass, className)}>
        <span className={tableMobileTitleClass}>{title}</span>
        <div className={tableCellValueClass}>
            <Link
                href={href}
                className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                    variant === "outline"
                        ? "border border-primary-500 bg-white text-primary-500 hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600"
                        : "bg-primary-500 text-white shadow-sm hover:bg-primary-600"
                )}
            >
                {icon}
                {label}
            </Link>
        </div>
    </td>
);

export default TableActionCell;
