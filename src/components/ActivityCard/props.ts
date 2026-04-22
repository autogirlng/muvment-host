export interface ActivityCardProps {
  primary?: boolean;
  title: string;
  value: string | number;
  modalTitle?: string;
  modalName?: string;
  modalIcon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}
