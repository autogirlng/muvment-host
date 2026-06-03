import cn from "classnames";
import { forwardRef, ReactNode } from "react";

export type TableActionButtonVariant = "success" | "danger" | "neutral" | "primary";

type TableActionButtonProps = {
    icon?: ReactNode;
    variant?: TableActionButtonVariant;
    text: string;
    onClick?: () => void;
    disabled?: boolean;
};

const variantStyles: Record<TableActionButtonVariant, string> = {
    success:
        "bg-success-500 text-white hover:bg-success-600 shadow-[0_1px_2px_rgba(12,137,33,0.25)] disabled:bg-success-50 disabled:text-success-600 disabled:shadow-none",
    danger:
        "bg-error-900 text-white hover:bg-error-800 shadow-[0_1px_2px_rgba(230,28,28,0.2)] disabled:bg-error-50 disabled:text-error-800 disabled:shadow-none",
    neutral:
        "bg-grey-700 text-white hover:bg-grey-800 shadow-[0_1px_2px_rgba(16,25,40,0.15)] disabled:bg-grey-90 disabled:text-grey-500 disabled:shadow-none",
    primary:
        "bg-primary-500 text-white hover:bg-primary-600 shadow-[0_1px_2px_rgba(6,115,255,0.25)] disabled:bg-primary-50 disabled:text-primary-400 disabled:shadow-none",
};

export const TableActionButton = forwardRef<HTMLButtonElement, TableActionButtonProps>(
    ({ icon, variant = "primary", text, onClick, disabled = false }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all lg:w-auto",
                variantStyles[variant],
                disabled && "cursor-not-allowed opacity-80"
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {icon}
            <span>{text}</span>
        </button>
    )
);
TableActionButton.displayName = "TableActionButton";
