import { ReactNode } from "react";
import {  Banks } from "@/types";

export interface AvatarProps  {
  image?: string;
  initials: string | ReactNode;
  size?: string;
  color?: string;
};

export interface PopupProps  {
    trigger: ReactNode;
    content: ReactNode | string;
};

export interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: "filled" | "outlined";
    color?: "primary" | "white" | "transparent";
    radius?: "full" | "rounded" | "lg" | "md";
    fullWidth?: boolean;
    loading?: boolean;
    className?: string;
    [key: string]: any;
};

export interface DividerProps { 
  className?: string; 
  variant?: "light" | "dark"
 };

interface Steps  {
    title: string;
    description: string;
    button?: string;
};

export interface HowItWorksProps { 
  title: string; 
  className?: string; 
  steps: Steps[] 
};


export interface InputFieldProps  {
    name: string;
    id: string;
    type?: string;
    label?: string;
    placeholder: string;
    variant?: "outlined" | "filled";
    icon?: ReactNode;
    value?: string | any;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    info?: boolean;
    tooltipTitle?: string;
    tooltipDescription?: string;
    inputClass?: string;
    className?: string;
    toggleShowPassword?: () => void;
    [key: string]: any;
};



export interface OptionProps  {
    value: string;
    option: string;
    flag?: string | ReactNode;
};

export interface SelectInputProps  {
    className?: string;
    defaultValue?: string;
    id: string;
    label?: string;
    placeholder?: string;
    variant?: "outlined" | "filled";
    options: OptionProps[];
    onChange?: (value: string) => void;
    value?: string;
    error?: string;
    info?: boolean;
    tooltipTitle?: string;
    tooltipDescription?: string;
    disabled?: boolean;
    width?: string;
};


interface OfferList  {
    title: string;
    description: string;
    icon: ReactNode;
};

export interface WhatWeOfferProps {
    title: string;
    list: OfferList[];
    className?: string;
};

export interface SpinnerProps  { 
    className?: string 
};


export interface SelectCountryProps {
    name: string;
    id: string;
    label?: string;
    placeholder: string;
    variant?: "outlined" | "filled";
    value?: string | any;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange: (value: string) => void;
    [key: string]: any;
};

export interface PhoneNumberAndCountryFieldProps  {
    inputName: string;
    selectName: string;

    inputId: string;
    selectId: string;

    label?: string;

    inputPlaceholder: string;
    selectPlaceholder: string;

    inputValue: string | any;
    selectValue: string | any;

    inputOnChange: (value: any) => void;
    selectOnChange: (value: any) => void;

    inputOnBlur: (value: any) => void;
    selectOnBlur: (value: any) => void;

    inputClassname?: string;
    selectClassname?: string;

    inputError?: string;
    selectError?: string;

    inputDisabled?: boolean;
    selectDisabled?: boolean;

    variant?: "outlined" | "filled";
    info?: boolean;
    tooltipTitle?: string;
    tooltipDescription?: string;
};


export interface OtpFieldProps {
  name: string;
  id: string;
  label?: string;
  placeholder: string;
  variant?: "outlined" | "filled";
  value: string | any;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (otp: string) => void;
  numInputs: number;
  [key: string]: any;
};


export interface SelectSearchInputProps  {
    banks: Banks[];
    className?: string;
    id: string;
    label?: string;
    placeholder?: string;
    variant?: "outlined" | "filled";
    onChange?: (bank: Banks | null) => void;
    value?: Banks | null;
    error?: string;
    info?: boolean;
    tooltipTitle?: string;
    tooltipDescription?: string;
    disabled?: boolean;
    isLoading?: boolean;
};

export interface BookingBadgeProps  {
  status: "ACCEPTED" | "PENDING" | "CANCELLED" | "APPROVED" | "COMPLETED";
};


// export interface VehicleListingBadgeProps  {
//   status:
//     | "draft"
//     | "active"
//     | "pending"
//     | "maintenance"
//     | "booked"
//     | "submitted"
//     | "unavailable"
//     | "inactive";
// };


export interface ListingBadgeProps  {
  status:
    | "suspended"
    | "approved"
    | "rejected"
    | "review"
    | "feedback"
    | "accepted";
};


export interface TransactionBadgeProps  {
  status: "SUCCESS" | "PENDING" | "FAILED";
};

export interface PaymentBadgeProps  {
  status: "successful" | "pending" | "failed" | "paid" | "cancelled";
};

export interface ReferralBadgeProps  {
  status: "JOINED" | "PENDING";
};


export interface MoreButtonProps  { className?: string; onClick?: () => void;[key: string]: any };


export interface ChipProps {
    text: string;
    variant?: "filled" | "outlined";
    color?: "dark" | "light" | "lighter" | "primary";
    radius?: "full" | "md" | "sm";
    icon?: ReactNode;
    className?: string;
};

export interface BlurredDialogProps  {
    trigger: ReactNode;
    title?: string | ReactNode;
    description?: string;
    content: ReactNode | string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    width?: string;
};


export interface FullPageDialogProps  {
    trigger: ReactNode;
    title: string;
    description?: string;
    content: ReactNode | string;
};


export interface TextAreaProps {
    name: string;
    id: string;
    type?: string;
    label?: string;
    placeholder: string;
    variant?: "outlined" | "filled";
    icon?: ReactNode;
    value?: string | any;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    info?: boolean;
    tooltipTitle?: string;
    tooltipDescription?: string;
    inputClass?: string;
    className?: string;
    toggleShowPassword?: () => void;
    [key: string]: any;
};


export interface AppTabsProps  {
  tabs: { name: string; value: string; content: ReactNode }[];
  label: string;
  tabClass?: string;
  contentClass?: string;
};

export interface SearchInputProps  {
    name: string;
    variant?: "outlined" | "filled";
    disabled?: boolean;
    inputClass?: string;
    className?: string;
    value?: string | any;
    placeholder?: string;
    icon?: boolean;
    [key: string]: any;
};


export interface FilterOption  {
  option: string;
  value: string;
};

export interface FilterCategory  {
  title: string;
  options: FilterOption[];
};

export interface FilterByProps  {
  categories: FilterCategory[];
  onChange: (
    selectedFilters: Record<string, string[]>,
    dateRange?: { startDate: Date | null; endDate: Date | null }
  ) => void;
  hideOnMobile?: boolean;
  dateEnabled?: boolean;
};

export interface DateFilterProps  {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
};


// CALENDAR
export type ValuePiece = Date | null;

export type Value = Date | null | [ValuePiece, ValuePiece];

export interface DateRangeCalendarProps {
    title: string;
    buttonClass?: string;
    selectRange: boolean;
    value: Value;
    onChange: (value: Value) => void;
    setCalendarValues: (value: Value) => void;
    isOpen: boolean;
    handleIsOpen: (open: boolean) => void;
}

export interface ProfilePhotoUploadProps  {
    title: string;
    label: string;
    name: string;
    id: string;
    disabled?: boolean;
    image?: string | null;
    onChange: (name: string, value: File | null) => void;
    value: string | File | null;
    error?: string;
    isLoading: boolean; showButton: boolean;
    initials?: string;
};


export interface AppSwitchProps {
  className?: string;
  id: string;
  name: string;
  onChange?: (value: boolean) => void;
  value?: boolean;
  disabled?: boolean;
};


export interface PhotoUploadProps  {
  label: string;
  name: string;
  id: string;
  disabled?: boolean;
  image: ReactNode;
  onChange: (name: string, value: File | null) => void;
  value: string | File | null;
  error?: string;
  fieldName: string;
  handlePhotoDelete: (fieldName: string) => void;
};



export interface FileFieldProps  {
  name: string;
  id: string;
  type?: string;
  label?: string;
  placeholder: string;
  variant?: "outlined" | "filled";
  icon?: ReactNode; // This icon prop will now primarily be used for non-file inputs (e.g., password toggle)
  // Value can be a string (for display), a File object, or null
  value?: string | File | null; // Allow null to represent no file
  required?: boolean;
  disabled?: boolean;
  error?: string;
  info?: boolean;
  tooltipTitle?: string;
  tooltipDescription?: string;
  inputClass?: string;
  className?: string;

  toggleShowPassword?: () => void;

  /** Enable file picking */
  filePicker?: boolean;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Called with the File object (if filePicker is true) */
  onFileSelect?: (file: File | null) => void; // Allow null for clearing file
};


export interface SingleCheckBoxProps {
  id: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
  children?: ReactNode;
};

export interface GroupCheckBoxProps  {
  feature: string;
  onChange: (feature: string, checked: boolean) => void;
  checkedValues: string[];
  name?:string;
};



