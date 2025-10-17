"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface NotificationContextType {
  unreadCount: number;
  updateUnreadCount: (count: number) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  function updateUnreadCount(count: number) {
    setUnreadCount(count);
  }

  function markAllAsRead() {
    setUnreadCount(0);
  }

  return (
    <NotificationContext.Provider
      value={{ unreadCount, updateUnreadCount, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}
