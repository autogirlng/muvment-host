import { ReactNode } from "react";
import { User } from "@/types";

export interface DesktopNavProps  { 
    user: User | null;
    userToken: string
};

export interface MobileNavProps { 
    userToken?: string;
     user: User | null
};

export interface MobileNavItemProps {
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

export interface SideNavItemProps { 
    link: string;
    name: string;
    icon: ReactNode 
};

