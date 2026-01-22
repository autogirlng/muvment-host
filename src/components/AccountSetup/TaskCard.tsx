import Link from "next/link";
import cn from "classnames";
import { TaskCardProps } from "./props";


export function TaskCard({ icon, title, link, linkText }: TaskCardProps) {
    return (
        <div
            className={cn(
                "h-[250px] 2xl:h-[294px] w-full sm:max-w-[480px] p-4 text-center rounded-3xl space-y-2.5 flex flex-col justify-center items-center bg-grey-75 first:bg-primary-500 text-black first:text-white text-sm md:text-base 2xl:text-h6 group"
            )}
        >
            <div className="group-first:hidden text-grey-700">{icon}</div>
            <h6 className="!font-semibold">
                {title}
            </h6>
            <Link
                href={link}
                className="text-primary-500 group-first:text-white !font-normal"
            >
                {linkText}
            </Link>
        </div>
    );
}
