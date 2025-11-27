import { ReactNode } from "react";
import { User } from "@/types";

export interface  MobileNavItemProps  {
    link?: string;
    name: string;
    icon: ReactNode;
    handleClick?: () => void;
    className?: string;
};

export interface NavPopupProps  {
     handleClick?: () => void;
      user: User | null
};

export interface DesktopNavProps  {
     user: User | null; 
     userToken: string
};
