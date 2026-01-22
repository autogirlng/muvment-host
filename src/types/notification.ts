export enum NotificationType {
  BOOKING_REQUEST = "BOOKING_REQUEST",
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  BOOKING_CANCELED = "BOOKING_CANCELED",
  UPCOMING_BOOKING = "UPCOMING_BOOKING",
  GUEST_CHECK_IN = "GUEST_CHECK_IN",
  GUEST_CHECK_OUT = "GUEST_CHECK_OUT",
  VEHICLE_ACCEPTED = "VEHICLE_ACCEPTED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  SECURITY_ALERT = "SECURITY_ALERT",
  NEW_REVIEW = "NEW_REVIEW",
  SPECIAL_OFFER = " SPECIAL_OFFER",
}

export interface Notification  {
  id: string;
  title: string;
  message: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  trxReference: null;
  transaction: null;
  notificationType: NotificationType;
};

export interface NotificationDataType  {
  data: Notification[];
  totalCount: number;
  unreadCount: number;
};
