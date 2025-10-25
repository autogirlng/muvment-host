import { Notification } from "@/types";


export interface NotificationProps  {
  isError: boolean;
  isLoading: boolean;
  notifications: Notification[];
  isDivider?: boolean;
};
