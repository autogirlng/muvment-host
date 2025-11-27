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
