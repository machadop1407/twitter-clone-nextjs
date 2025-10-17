"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Home, LogOut, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { NotificationBadge } from "./notifications/notification-badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/auth/auth-actions";

function getNavigation(username?: string) {
  return [
    { name: "Home", href: "/", icon: Home },
    { name: "Notifications", href: "/notifications", icon: "notifications" },
    { name: "Profile", href: `/profile/${username}`, icon: User },
  ];
}

export function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const session = authClient.useSession();
  const username = session.data?.user.username ?? "";
  const navigation = getNavigation(username);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="flex flex-col h-screen w-64 border-r border-border bg-background">
      <div className="p-4">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">𝕏</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item, key) => {
          const isActive =
            item.name === "Profile"
              ? pathname.startsWith("/profile")
              : pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={key} href={item.href} className="cursor-pointer">
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-12 px-4`}
              >
                {item.name === "Notifications" ? (
                  <NotificationBadge />
                ) : (
                  <Icon className="mr-4 h-5 w-5" />
                )}

                <span className="text-lg ml-4">{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-muted">
          <Link
            href={`/profile/${username}`}
            className="flex items-center space-x-3 flex-1 min-w-0"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.data?.user.avatar ?? ""} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session.data?.user.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                @{username}
              </p>
            </div>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <Button
              variant={"ghost"}
              className="p-1 rounded-full hover:bg-muted/50 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </Button>

            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                <Button
                  onClick={signOut}
                  variant={"ghost"}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-muted/50 flex items-center space-x-2"
                >
                  <LogOut />
                  <span>Log Out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
