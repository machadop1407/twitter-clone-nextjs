"use client";
import { Prisma } from "@/lib/generated/prisma";
import ProfileTabs from "./profile-tabs";
import { useState } from "react";
import {
  getUserLikes,
  getUserReplies,
  getUserRetweets,
} from "@/lib/actions/profile";
import toast from "react-hot-toast";
import Tweet from "../tweet";

type TweetWithRelations = Prisma.TweetGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        username: true;
        avatar: true;
      };
    };
    likes: true;
    retweets: true;
  };
}>;

interface ProfileContentProps {
  username: string;
  initialTweets: TweetWithRelations[];
  tweetCount: number;
  replyCount: number;
  likeCount: number;
  retweetCount: number;
  currentUserId?: string;
}

export default function ProfileContent({
  username,
  initialTweets,
  tweetCount,
  replyCount,
  likeCount,
  retweetCount,
  currentUserId,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(false);
  const [tweets, setTweets] = useState(initialTweets);

  async function handleTabChange(tab: string) {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setIsLoading(true);

    try {
      let result;
      switch (tab) {
        case "posts":
          setTweets(initialTweets);
          break;
        case "replies":
          result = await getUserReplies(username);
          setTweets(result.success ? result.tweets || [] : []);
          break;
        case "likes":
          result = await getUserLikes(username);
          setTweets(result.success ? result.tweets || [] : []);
          break;
        case "retweets":
          result = await getUserRetweets(username);
          setTweets(result.success ? result.tweets || [] : []);
          break;
        default:
          setTweets([]);
      }
    } catch (err) {
      toast.error("Error loading tweets.");
      setTweets([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tweetCount={tweetCount}
        replyCount={replyCount}
        likeCount={likeCount}
        retweetCount={retweetCount}
      />

      {/* Tweet Feed */}
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : tweets.length > 0 ? (
          tweets.map((tweet, key) => (
            <Tweet key={key} tweet={tweet} currentUserId={currentUserId} />
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>
              {activeTab === "posts" && "No posts yet."}
              {activeTab === "replies" && "No replies yet."}
              {activeTab === "likes" && "No likes yet."}
              {activeTab === "retweets" && "No retweets yet."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
