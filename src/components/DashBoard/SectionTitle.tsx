import { SectionTitleProps } from "./props";

export default function SectionTitle({ icon, title }: SectionTitleProps) {
    return (
        <p className="flex items-center gap-2 text-sm font-medium text-grey-700 sm:text-base 2xl:text-xl">
            <span className="text-primary-500">{icon}</span>
            <span>{title}</span>
        </p>
    );
}
