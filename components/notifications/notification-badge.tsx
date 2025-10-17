"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "./notification-context";
import { Badge } from "../ui/badge";
import { useEffect } from "react";
import { getUnreadNotificationCount } from "@/lib/actions/notifications";

export function NotificationBadge() {
  const { unreadCount, updateUnreadCount } = useNotifications();

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const result = await getUnreadNotificationCount();
        if (result.success) {
          updateUnreadCount(result.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    }

    fetchUnreadCount();
  }, []);
  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </div>
  );
}
