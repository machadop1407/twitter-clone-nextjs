"use client";

import { formatTimeAgo } from "@/lib/format-tweet-date";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { getInitials } from "@/lib/get-initials";
import { CldImage } from "next-cloudinary";
import TweetComposer from "./tweet/tweet-composer";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  createReplyTweet,
  likeTweet,
  retweetTweet,
} from "@/lib/actions/tweets";
import toast from "react-hot-toast";

interface TweetProps {
  tweet: {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      username?: string | null;
      avatar?: string | null;
    };
    likes: Array<{ id: string; userId: string }>;
    retweets: Array<{ id: string; userId: string }>;
  };

  currentUserId?: string;
}

export default function Tweet({ tweet, currentUserId }: TweetProps) {
  const [showReplyComposer, setShowReplyComposer] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState(
    currentUserId
      ? tweet.likes.some((like) => like.userId === currentUserId)
      : false
  );
  const [isRetweeted, setIsRetweeted] = useState(
    currentUserId
      ? tweet.retweets.some((retweet) => retweet.userId === currentUserId)
      : false
  );
  const [likesCount, setLikesCount] = useState(tweet.likes.length);
  const [retweetsCount, setRetweetsCount] = useState(tweet.retweets.length);

  const pathname = usePathname();
  const router = useRouter();

  async function handleReply() {
    if (pathname === "/") {
      router.push(`/tweet/${tweet.id}`);
    } else {
      setShowReplyComposer((prev) => !prev);
    }
  }

  async function handleCreateReply(content: string, imageUrl?: string) {
    try {
      const result = await createReplyTweet(tweet.id, content, imageUrl);
      if (result.success) {
        router.refresh();
        setShowReplyComposer(false);
      }
    } catch (err) {
      toast.error("Error replying to tweet.");
    }
  }

  async function handleLike() {
    try {
      // Optimistic update
      const wasLiked = isLiked;
      setIsLiked(!wasLiked);
      setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

      const result = await likeTweet(tweet.id);
      if (result.success) {
        // Keep the optimistic update
        router.refresh();
      } else {
        // Revert optimistic update on failure
        setIsLiked(wasLiked);
        setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        toast.error("Failed to like tweet");
      }
    } catch (err) {
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error("Error liking tweet:", err);
      toast.error("Failed to like tweet");
    }
  }

  async function handleRetweet() {
    try {
      // Optimistic update
      const wasRetweeted = isRetweeted;
      setIsRetweeted(!wasRetweeted);
      setRetweetsCount((prev) => (wasRetweeted ? prev - 1 : prev + 1));

      const result = await retweetTweet(tweet.id);
      if (result.success) {
        // Keep the optimistic update
        router.refresh();
      } else {
        // Revert optimistic update on failure
        setIsRetweeted(wasRetweeted);
        setRetweetsCount((prev) => (wasRetweeted ? prev + 1 : prev - 1));
        toast.error("Failed to retweet");
      }
    } catch (err) {
      // Revert optimistic update on error
      setIsRetweeted(!isRetweeted);
      setRetweetsCount((prev) => (isRetweeted ? prev + 1 : prev - 1));
      console.error("Error retweeting tweet:", err);
      toast.error("Failed to retweet");
    }
  }

  return (
    <>
      <div
        onClick={() => router.push(`/tweet/${tweet.id}`)}
        className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border"
      >
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tweet.author.avatar ?? undefined} />
            <AvatarFallback> {getInitials(tweet.author.name)} </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <button
                className="font-semibold hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${tweet.author.username}`);
                }}
              >
                {tweet.author.name}
              </button>
              <button
                className="text-muted-foreground hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${tweet.author.username}`);
                }}
              >
                @{tweet.author.username}
              </button>
              <span className="text-muted-foreground">.</span>
              <span className="text-muted-foreground">
                {formatTimeAgo(new Date(tweet.createdAt))}
              </span>
            </div>
            <p className="text-foreground whitespace-pre-wrap">
              {tweet.content}
            </p>

            {tweet.imageUrl && (
              <div className="mt-3">
                <CldImage
                  src={tweet.imageUrl}
                  alt="Tweet Image"
                  width={800}
                  height={600}
                  className="max-w-full max-h-96 rounded-lg object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="flex items-center space-x-6 text-muted-foreground">
              <Button
                variant={"ghost"}
                onClick={handleReply}
                className="flex items-center space-x-2 hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button
                variant={"ghost"}
                className="flex items-center space-x-2 hover:text-green-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetweet();
                }}
              >
                <Repeat2
                  className={`h-4 w-4 ${isRetweeted ? "text-green-500" : ""}`}
                />
                <span>{retweetsCount}</span>
              </Button>
              <Button
                variant={"ghost"}
                className="flex items-center space-x-2 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked ? "text-red-500 fill-red-500" : ""
                  }`}
                />{" "}
                <span>{likesCount}</span>
              </Button>
              <Button
                variant={"ghost"}
                className="flex items-center space-x-2 hover:text-primary"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Reply Composer */}
      {showReplyComposer && (
        <div className="p-4 border-b border-border">
          <TweetComposer
            placeholder="Tweet your reply..."
            onSubmit={handleCreateReply}
            onCancel={() => setShowReplyComposer(false)}
          />
        </div>
      )}
    </>
  );
}
