import { ReactNode } from "react";
export interface EmptyStateProps {
    title: string;
    message?: string | ReactNode;
    image: string;
    imageSize?: string;
    noBg?: boolean;
};