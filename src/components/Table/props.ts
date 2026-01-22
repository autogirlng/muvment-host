import { ReactNode } from "react";

export interface TableCellProps {
    content: string;
    className?: string;
    isBadge?: boolean;
    type?: "transaction" | "booking";
    icon?: ReactNode;
};