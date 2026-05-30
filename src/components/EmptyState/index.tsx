import Image from "next/image";
import cn from "classnames";
import { EmptyStateProps } from "./props";


export default function EmptyState({
    title,
    message,
    image,
    imageSize,
    noBg,
    containerClassName,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center space-y-4 px-5 sm:space-y-6 2xl:space-y-10",
                containerClassName,
                !containerClassName &&
                    (noBg ? "py-16" : "rounded-[40px] bg-grey-75 py-[88px]"),
            )}
        >
            <Image
                src={image}
                alt=""
                width={182}
                height={151}
                className={cn("w-[100px] 3xl:w-[182px]", imageSize)}
            />
            <div className="space-y-2 text-center text-grey-500 sm:space-y-3 2xl:space-y-6">
                <h3 className="text-lg font-semibold text-grey-700 sm:text-xl 2xl:text-h4 4xl:text-h3">
                    {title}
                </h3>
                {message && (
                    <p className="text-sm font-medium sm:text-base 2xl:text-xl 4xl:text-h6">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
