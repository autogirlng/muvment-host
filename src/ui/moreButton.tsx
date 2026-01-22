import { Icons } from "@/ui";
import cn from "classnames";
import { MoreButtonProps } from "./props";



const MoreButton = ({ className, onClick, ...rest }: MoreButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit mx-auto",
                className
            )}
            {...rest}
        >
            {Icons.ic_more}
        </button>
    );
};

export { MoreButton };
