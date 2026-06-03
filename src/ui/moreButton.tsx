import { Icons } from "@/ui";
import cn from "classnames";
import { MoreButtonProps } from "./props";

const MoreButton = ({ className, onClick, ...rest }: MoreButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-grey-200 bg-white text-grey-700 shadow-sm transition-all hover:border-grey-300 hover:bg-grey-50 hover:text-grey-900 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
                className
            )}
            aria-label="More actions"
            {...rest}
        >
            {Icons.ic_more}
        </button>
    );
};

export { MoreButton };
