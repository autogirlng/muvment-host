import type { ReactNode } from "react";

export interface ActivityCardProps {
  primary?: boolean;
  title: string;
  value: string | number;
  modalTitle?: string;
  modalName?: string;
  modalIcon?: ReactNode;
  /** Format numeric value as ₦ with grouping (e.g. listing revenue without graph modal). */
  showCurrency?: boolean;
  isLoading?: boolean;
  className?: string;
}
