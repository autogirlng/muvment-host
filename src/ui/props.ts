import { ReactNode } from "react";

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



