"use server";
import { redirect } from "next/navigation";
import { getSession } from "../auth/auth-actions";
import { NotificationType } from "@prisma/client";
import { prisma } from "../prisma";
import { revalidateTag, unstable_cache } from "next/cache";

export const getCachedNotifications = unstable_cache(
  async (userId: string) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          recipientId: userId,
        },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          tweet: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { success: true, notifications };
    } catch (err) {
      console.error("Error fetching notifications:", err);
      return { success: false, error: "Failed to fetch notifications" };
    }
  },
  ["notifications"],
  { revalidate: 60, tags: ["notifications"] }
);

export async function getNotifications() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return getCachedNotifications(session.user.id);
}

export const getCachedUnreadNotificationCount = unstable_cache(
  async (userId: string) => {
    try {
      const count = await prisma.notification.count({
        where: {
          recipientId: userId,
          read: false,
        },
      });

      return { success: true, count };
    } catch (err) {
      console.error("Error fetching notifications count:", err);
      return { success: false, error: "Failed to fetch notifications count" };
    }
  },
  ["notification-count"],
  { revalidate: 30, tags: ["notification-count"] }
);

export async function getUnreadNotificationCount() {
  const session = await getSession();

  if (!session) {
    return { success: true, count: 0 };
  }

  return getCachedUnreadNotificationCount(session.user.id);
}

export async function createNotification(
  type: NotificationType,
  recipientId: string,
  actorId: string,
  tweetId?: string
) {
  try {
    if (actorId === recipientId) {
      return { success: true };
    }

    const existingNotification = await prisma.notification.findFirst({
      where: {
        type,
        recipientId,
        actorId,
        tweetId: tweetId || null,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingNotification) {
      return { success: true };
    }

    await prisma.notification.create({
      data: {
        type,
        recipientId,
        actorId,
        tweetId,
      },
    });

    // Revalidate cached data
    revalidateTag("notifications");
    revalidateTag("notification-count");

    return { success: true };
  } catch (err) {
    console.error("Error creating notification:", err);
    return { success: false, error: "Failed to create notification" };
  }
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  try {
    await prisma.notification.updateMany({
      where: {
        recipientId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    // Revalidate cached data
    revalidateTag("notifications");
    revalidateTag("notification-count");

    return { success: true };
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    return { success: false, error: "Failed to marking notifications as read" };
  }
}
