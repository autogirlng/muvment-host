import { ReactNode } from "react";
export interface ActivityCardProps  {
  primary?: boolean;
  title: string;
  value: string;
  modalTitle?: string;
  modalName?: string;
  modalIcon?: ReactNode;
  isLoading?: boolean;
  className?: string;
};