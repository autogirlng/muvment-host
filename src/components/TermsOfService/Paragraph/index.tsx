import { ParagraphProps } from "@/components/TermsOfService/props";

export const ParagraphText = ({ children, className = "" }: ParagraphProps) => (
    <p className={`text-base text-gray-700 leading-relaxed  text-sm${className}`}>
        {children}
    </p>
);
