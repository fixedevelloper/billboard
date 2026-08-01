export type NotificationType = "USER_WELCOME" | "ORDER_CREATED" | "ORDER_DELEGATED" | "ORDER_PAID" | "ORDER_EXPIRED";
export type NotificationStatus = "SENT" | "FAILED";

export interface Notification {
  id: string;
  type: NotificationType;
  subject: string;
  status: NotificationStatus;
  createdAt: string;
}
