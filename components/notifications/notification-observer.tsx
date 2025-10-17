"use client";

import { useEffect } from "react";
import { useNotifications } from "./notification-context";
import { markAllNotificationsAsRead } from "@/lib/actions/notifications";
import toast from "react-hot-toast";

export default function NotificationObserver() {
  const { markAllAsRead } = useNotifications();
  useEffect(() => {
    async function markAsRead() {
      try {
        await markAllNotificationsAsRead();
        markAllAsRead();
      } catch (err) {
        toast.error("Failed to mark notifications as read");
      }
    }

    markAsRead();
  }, [markAllAsRead]);
  return <></>;
}
