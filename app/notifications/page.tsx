import MainLayout from "@/components/main-layout";
import NotificationObserver from "@/components/notifications/notification-observer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNotifications } from "@/lib/actions/notifications";
import { formatTimeAgo } from "@/lib/format-tweet-date";
import { NotificationType } from "@prisma/client";
import { getInitials } from "@/lib/get-initials";
import { Heart, MessageCircle, Repeat2, UserPlus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Stay updated with all your notifications. See who liked, retweeted, replied to your tweets, or started following you.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotificationsPage() {
  const result = await getNotifications();

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load notifications</p>
      </div>
    );
  }

  const notifications = result.notifications;

  function getNotificationIcon(type: NotificationType) {
    switch (type) {
      case "LIKE":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "RETWEET":
        return <Repeat2 className="h-5 w-5 text-green-500" />;
      case "REPLY":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "FOLLOW":
        return <UserPlus className="h-5 w-5 text-purple-500" />;
      default:
        return <Heart className="h-5 w-5 text-red-500" />;
    }
  }

  function getNotificationText(type: NotificationType, actorName: string) {
    switch (type) {
      case "LIKE":
        return `${actorName} liked your tweet`;
      case "RETWEET":
        return `${actorName} retweeted your tweet`;
      case "REPLY":
        return `${actorName} replied your tweet`;
      case "FOLLOW":
        return `${actorName} started following you`;
      default:
        return `${actorName} liked your tweet`;
    }
  }

  return (
    <MainLayout>
      <NotificationObserver />
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4 z-55">
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      {notifications?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No notifications yet</h2>
          <p className="text-muted-foreground">
            When someone likes, retweets, or replies to your tweets, you&apos;ll
            see it here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications?.map((notification, key) => (
            <div
              key={key}
              className={`p-4 hover:bg-muted/50 transition-colors ${
                !notification.read ? "bg-blue-50/50dark" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.actor.avatar ?? ""} />
                      <AvatarFallback>
                        {getInitials(notification.actor.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="text-sm">
                        <Link
                          href={`/profile/${notification.actor.username}`}
                          className="font-semibold hover:underline"
                        >
                          {notification.actor.name}
                        </Link>{" "}
                        <span className="text-muted-foreground">
                          {getNotificationText(
                            notification.type,
                            notification.actor.name
                          )}
                        </span>
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(new Date(notification.createdAt))}
                      </p>
                    </div>
                  </div>

                  {notification.tweet && (
                    <div className="mt-3 ml-10">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={notification.tweet.author.avatar || ""}
                            />
                            <AvatarFallback>
                              {getInitials(notification.actor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <Link
                            href={`/profile/${notification.tweet.author.username}`}
                            className="text-sm font-semibold hover:underline"
                          >
                            {notification.tweet.author.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            @{notification.tweet.author.username}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {notification.tweet.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
