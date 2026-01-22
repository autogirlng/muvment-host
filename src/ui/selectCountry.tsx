import cn from "classnames";
import { Icons, SelectInput } from "@/ui";
import { SelectCountryProps } from "./props";

const allowedCountries = [
    { flag: Icons.ic_country_nigeria, option: "+234", value: "NG" },
    // { flag: Icons.ic_country_ghana, option: "+233", value: "GH" },
];

const SelectCountry = ({
    label,
    id,
    variant,
    value,
    onChange,
    labels,
    error,
    className,
    ...rest
}: SelectCountryProps) => {
    return (
        <div className={cn("w-full space-y-1", className, error && "-mb-[28px]")}>
            {label && (
                <label
                    htmlFor={id}
                    className={cn(
                        "text-sm block font-medium",
                        variant === "filled" ? "text-white" : "text-grey-900"
                    )}
                >
                    {label}
                </label>
            )}
            <SelectInput
                defaultValue="NG"
                variant="outlined"
                id="bank"
                options={allowedCountries}
                value={value}
                onChange={(value) => onChange(value)}
                error={error}
                {...rest}
            />
        </div>
    );
};

export { SelectCountry };
