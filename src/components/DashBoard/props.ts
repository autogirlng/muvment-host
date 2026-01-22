import { ReactNode } from "react";
export interface InnerPageProps {
    isInnerPage?: boolean;
    title: string;
    description?: string;
    backLink?: string;
    children: ReactNode;
};

export interface SectionTitleProps { icon?: ReactNode; title: string };
