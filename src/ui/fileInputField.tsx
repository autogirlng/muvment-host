import { useRef } from "react";
import cn from "classnames";
import { Icons, Tooltip } from "@/ui"; // Assuming Icons.ic_cancel_circle and Icons.ic_file exist
import { FileFieldProps } from "./props";
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
    ...rest // Capture other props like `name`
}: FileFieldProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null; // Get the file or null if cleared/none selected
        onFileSelect?.(file); // Always call onFileSelect to update Formik with the File object (or null)
        // Note: No need to set internal state (like fileName) because we derive from 'value' prop
    };

    const handleClearFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Programmatically clear the native file input value
        }

        onFileSelect?.(null); // Notify parent that the file is cleared
    };

    // Determine the value to display in the readOnly text input
    const displayValue =
        value instanceof File
            ? value.name
            : typeof value === "string" && value !== "" // Ensure it's a non-empty string
                ? value
                : ""; // Fallback for empty string or null/undefined

    // Logic for showing the cancel icon: only if filePicker and a file/string is present
    const showClearIcon = filePicker && displayValue !== "";

    // Calculate padding based on icons present
    // Base padding (e.g., for default text inputs without special icons)
    let paddingRightClass = "";

    if (filePicker) {
        // For file picker, we always have ic_file. Add padding for it.
        // If we also have a clear icon, we need more space.
        paddingRightClass = showClearIcon ? "pr-16" : "pr-10"; // pr-16 for two icons, pr-10 for one (file icon)
    } else if ((id === "password" || id === "confirmPassword" || id === "currentPassword") && icon) {
        // For password fields with a toggle icon
        paddingRightClass = "pr-10"; // Space for the single password toggle icon
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
                        {/* The actual hidden file input */}
                        <input
                            ref={fileInputRef}
                            id={id} // Associate with label
                            type="file"
                            accept="image/*" // Consider making this prop-configurable
                            className="hidden"
                            onChange={handleFileChange} // Our internal handler which calls onFileSelect
                            onBlur={onBlur} // Pass onBlur directly to the hidden input for Formik's touched state
                            // Do NOT set a 'value' prop on type="file" inputs in React as it makes them controlled
                            // and can prevent file selection. undefined or "" is correct.
                            value={undefined}
                            {...rest} // Pass other standard input props like required, disabled
                        />
                        {/* The visible text input that triggers the file input */}
                        <input
                            type="text"
                            readOnly // This input is read-only
                            onClick={() => fileInputRef.current?.click()} // Clicks the hidden file input
                            value={displayValue} // This `value` MUST be a string (filename or empty)
                            placeholder={placeholder}
                            className={cn(
                                "cursor-pointer w-full rounded-[18px] p-4 text-sm h-[56px] outline-none",
                                inputClass,
                                error
                                    ? "border border-error-500"
                                    : variant === "filled"
                                        ? "bg-grey-800 text-grey-400 border-none"
                                        : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]",
                                paddingRightClass // Apply calculated padding
                            )}
                        // No onChange/onBlur needed directly on this readOnly text input as it doesn't change value
                        />
                        {/* Icons container for file picker */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {showClearIcon && (
                                <div
                                    className="fill-grey-500 cursor-pointer"
                                    onClick={handleClearFile}
                                >
                                    {Icons.ic_cancel_circle}
                                </div>
                            )}
                            {/* Always show the file icon for filePicker */}
                            <div className="fill-grey-500">
                                {Icons.ic_file}
                            </div>
                        </div>
                    </>
                ) : (
                    // Regular text input (not a file picker)
                    <>
                        <input
                            type={type || "text"}
                            id={id}
                            placeholder={placeholder}
                            className={cn(
                                "w-full rounded-[18px] p-4 text-sm h-[56px] outline-none",
                                inputClass,
                                paddingRightClass, // Apply calculated padding
                                error
                                    ? "border border-error-500"
                                    : variant === "filled"
                                        ? "bg-grey-800 text-grey-400 border-none"
                                        : "bg-white text-grey-900 border border-grey-300 hover:border-primary-500 focus:border-primary-500 focus:shadow-[0_0_0_4px_#1E93FF1A]"
                            )}
                            autoCorrect="off"
                            spellCheck="false"
                            autoComplete={`new-${type || "text"}`}
                            // Pass onChange and onBlur directly to the standard input
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value as string} // Explicitly cast to string here for non-file inputs
                            {...rest}
                        />
                        {/* Password toggle icon - position relative to its parent input, not the main container */}
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
            {error && <p className="text-error-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export { FileInputField };