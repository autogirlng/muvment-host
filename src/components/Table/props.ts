import { ReactNode } from "react";

export interface TableCellProps {
    content: string | ReactNode;
    className?: string;
    isBadge?: boolean;
    type?: "transaction" | "booking" | "listing";
    icon?: ReactNode;
    title?: string;
}
