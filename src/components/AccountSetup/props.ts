import { ReactNode } from "react";

export interface TaskCardProps {
    icon?: ReactNode;
    title: string;
    link: string;
    linkText: string;
};