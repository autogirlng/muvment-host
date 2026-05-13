import { ReactNode } from "react";

export interface TableCellProps {
    content: string | ReactNode;
    className?: string;
    isBadge?: boolean;
    type?: "transaction" | "booking";
    icon?: ReactNode;
    title?: string;
};