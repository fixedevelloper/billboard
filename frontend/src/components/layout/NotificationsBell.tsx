"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNotifications } from "@/features/notifications/useNotifications";

export function NotificationsBell() {
  const t = useTranslations("dashboardShell");
  const { notifications, loading } = useNotifications();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative px-2.5" aria-label={t("notifications")}>
          <Bell className="size-4" />
          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-medium text-white">
              {notifications.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("notifications")}</DialogTitle>
        </DialogHeader>
        {loading && <p className="text-sm text-zinc-500">{t("notificationsLoading")}</p>}
        {!loading && notifications.length === 0 && (
          <p className="text-sm text-zinc-500">{t("noNotifications")}</p>
        )}
        <ul className="flex max-h-80 flex-col gap-3 overflow-y-auto">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-start justify-between gap-3 border-b border-zinc-200 pb-3 last:border-0 dark:border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{notification.subject}</p>
                <p className="text-xs text-zinc-500">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
              {notification.status === "FAILED" && <Badge tone="danger">{t("notificationFailed")}</Badge>}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
