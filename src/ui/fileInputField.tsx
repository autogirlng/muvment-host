import { useRef } from "react";
import cn from "classnames";
import { Icons, Tooltip } from "@/ui";
import { FileFieldProps } from "./props";

function getUploadedFileName(url: string): string {
    try {
        const pathname = new URL(url).pathname;
        const segment = pathname.split("/").pop() ?? "document";
        return decodeURIComponent(segment.split(".")[0] ?? segment).replace(/_/g, " ");
    } catch {
        return "Uploaded document";
    }
}

function isImageUrl(url: string): boolean {
    return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(url);
}

const FileInputField = ({
    id,
    label,
    placeholder,
    variant,
    type,
    icon,
    error,
    info,
    tooltipTitle,
    tooltipDescription,
    inputClass,
    className,
    toggleShowPassword,
    filePicker = false,
    onChange,
    onBlur,
    onFileSelect,
    value,
    accept,
    ...rest
}: FileFieldProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileSelect?.(file);
    };

    const handleClearFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onFileSelect?.(null);
    };

    const isExistingUrl = typeof value === "string" && value.includes("http");
    const displayValue =
        value instanceof File
            ? value.name
            : isExistingUrl
              ? getUploadedFileName(value)
              : typeof value === "string" && value !== ""
                ? value
                : "";

    const showClearIcon = filePicker && displayValue !== "";

    let paddingRightClass = "";

    if (filePicker) {
        paddingRightClass = showClearIcon ? "pr-16" : "pr-10";
    } else if ((id === "password" || id === "confirmPassword" || id === "currentPassword") && icon) {
        paddingRightClass = "pr-10";
    }

    return (
        <div className={cn("w-full space-y-1", className)}>
            {label && (
                <label
                    htmlFor={id}
                    className={cn(
                        "label text-sm block font-medium text-nowrap",
                        variant === "filled" ? "text-white" : "text-grey-900",
                        info && "flex items-center gap-3"
                    )}
                >
                    <span> {label}</span>
                    {info && (
                        <Tooltip
                            title={tooltipTitle || ""}
                            description={tooltipDescription || ""}
                        />
                    )}
                </label>
            )}
            <div className="relative">
                {filePicker ? (
                    <>
                        <input
                            ref={fileInputRef}
                            id={id}
                            type="file"
                            accept={accept ?? "image/*,application/pdf"}
                            className="hidden"
                            onChange={handleFileChange}
                            onBlur={onBlur}
                            value={undefined}
                            {...rest}
                        />
                        <input
                            type="text"
                            readOnly
                            onClick={() => fileInputRef.current?.click()}
                            value={displayValue}
                            placeholder={placeholder}
                            className={cn(
                                "cursor-pointer w-full rounded-[18px] p-4 text-sm h-[56px] outline-none",
                                inputClass,
                                error
                                    ? "border border-error-500"
                                    : variant === "filled"
                                      ? "bg-grey-800 text-grey-400 border-none"
                                      : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]",
                                paddingRightClass
                            )}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {showClearIcon && (
                                <div
                                    className="fill-grey-500 cursor-pointer"
                                    onClick={handleClearFile}
                                >
                                    {Icons.ic_cancel_circle}
                                </div>
                            )}
                            <div className="fill-grey-500">{Icons.ic_file}</div>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            type={type || "text"}
                            id={id}
                            placeholder={placeholder}
                            className={cn(
                                "w-full rounded-[18px] p-4 text-sm h-[56px] outline-none",
                                inputClass,
                                paddingRightClass,
                                error
                                    ? "border border-error-500"
                                    : variant === "filled"
                                      ? "bg-grey-800 text-grey-400 border-none"
                                      : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]"
                            )}
                            autoCorrect="off"
                            spellCheck="false"
                            autoComplete={`new-${type || "text"}`}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value as string}
                            {...rest}
                        />
                        {((id === "password" || id === "confirmPassword" || id === "currentPassword") && icon) && (
                            <div
                                className="absolute right-4 top-1/2 -translate-y-1/2 fill-grey-500 cursor-pointer"
                                onClick={toggleShowPassword}
                            >
                                {icon}
                            </div>
                        )}
                    </>
                )}
            </div>

            {isExistingUrl && (
                <div className="mt-3 rounded-xl border border-grey-200 bg-grey-50 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-grey-500">
                                {label}
                            </p>
                            <p className="text-sm font-medium text-grey-800 truncate">
                                {getUploadedFileName(value)}
                            </p>
                        </div>
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-xs font-semibold text-primary-500 hover:underline"
                        >
                            View preview
                        </a>
                    </div>
                    {isImageUrl(value) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={value}
                            alt={`${label} preview`}
                            className="max-h-40 w-full rounded-lg object-contain bg-white border border-grey-100"
                        />
                    )}
                </div>
            )}

            {error && <p className="text-error-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export { FileInputField };
