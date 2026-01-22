import { SectionTitleProps } from "./props";

export default function SectionTitle({ icon, title }: SectionTitleProps) {
    return (
        <p className="flex items-center gap-2 text-base 2xl:text-xl text-grey-700">
            {icon}
            <span>{title}</span>
        </p>
    );
}
