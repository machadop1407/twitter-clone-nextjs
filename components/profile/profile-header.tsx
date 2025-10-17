"use client";

import { CldImage } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/get-initials";
import { Button } from "../ui/button";
import { Calendar, Edit } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./edit-profile-modal";
import toast from "react-hot-toast";
import { followUser } from "@/lib/actions/profile";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    username?: string | null;
    bio?: string | null;
    avatar?: string | null;
    image?: string | null;
    createdAt: Date;
    _count: {
      tweets: number;
      followers: number;
      following: number;
    };
  };
  currentUser: {
    id: string;
    name: string;
    username?: string | null;
  };
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

export default function ProfileHeader({
  user,
  currentUser,
  isFollowing,
  followerCount,
  followingCount,
}: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isFollowingState, setIsFollowingState] =
    useState<boolean>(isFollowing);

  const router = useRouter();

  function formatJoinDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  async function handleFollow() {
    try {
      const result = await followUser(user.id);
      if (result.success) {
        setIsFollowingState(result.action === "followed");
        router.refresh();
      }
    } catch (err) {
      toast.error("Error following account.");
    }
  }

  const isOwnProfile = currentUser.id === user.id;
  return (
    <div className="border-b border-border">
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        {user.image ? (
          <CldImage
            src={user.image}
            alt="Banner"
            width={800}
            height={192}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500" />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar ?? undefined} />
            <AvatarFallback> {getInitials(user.name)} </AvatarFallback>
          </Avatar>

          {isOwnProfile ? (
            <Button
              variant="outline"
              className="mt-4 z-2"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={isFollowingState ? "outline" : "default"}
              className="mt-4 z-2"
              onClick={handleFollow}
            >
              {isFollowingState ? " Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {/* User Details */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          {user.bio && <p className="text-foreground">{user.bio}</p>}

          <div className="flex items-center space-x-4 text-muted-foreground text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatJoinDate(new Date(user.createdAt))}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground">
                {followingCount}
              </span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground">
                {followerCount}
              </span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground">
                {user._count.tweets}
              </span>
              <span className="text-muted-foreground">Tweets</span>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
}
