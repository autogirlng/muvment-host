import { TermsContentContainerProps } from "@/components/TermsOfService/props";

export const TermsContentContainer = ({
    children,
    className = "",
}: TermsContentContainerProps) => (
    <div className={`px-6 sm:px-8 ${className}`}>{children}</div>
);
