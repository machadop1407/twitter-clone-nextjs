"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Tweet from "../tweet";
import { getPaginatedTweets } from "@/lib/actions/tweets";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface TweetData {
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
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
}

interface TweetFeedProps {
  initialTweets: TweetData[];
  currentUserId: string;
  initialPagination: Pagination;
}

export default function TweetFeed({
  initialTweets,
  currentUserId,
  initialPagination,
}: TweetFeedProps) {
  const [tweets, setTweets] = useState<TweetData[]>(initialTweets);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const [isPending, startTransition] = useTransition();

  // Function to refresh the first page of tweets
  const refreshFirstPage = useCallback(async () => {
    try {
      const result = await getPaginatedTweets(1, pagination.limit);
      if (result.success && result.tweets) {
        setTweets(result.tweets);
        setPagination(result.pagination || pagination);
      }
    } catch (err) {
      console.error("Error refreshing tweets:", err);
    }
  }, [pagination.limit]);

  // Listen for custom events to refresh tweets
  useEffect(() => {
    const handleRefreshTweets = () => {
      refreshFirstPage();
    };

    window.addEventListener("refreshTweets", handleRefreshTweets);
    return () =>
      window.removeEventListener("refreshTweets", handleRefreshTweets);
  }, [refreshFirstPage]);

  const loadMoreTweets = useCallback(() => {
    if (isPending || !pagination.hasMore) return;
    try {
      startTransition(async () => {
        const result = await getPaginatedTweets(
          pagination.page + 1,
          pagination.limit
        );

        if (result.success) {
          setTweets((prev) => [...prev, ...(result.tweets || [])]);
          setPagination(result.pagination || pagination);
        } else {
          toast.error("Failed to load more tweets");
        }
      });
    } catch (err) {
      toast.error("Failed to load more tweets");
    }
  }, [isPending, pagination]);

  const handleScroll = useCallback(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    const { scrollTop, scrollHeight, clientHeight } = mainElement;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMoreTweets();
    }
  }, [loadMoreTweets]);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    mainElement.addEventListener("scroll", handleScroll);

    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="divide-y divide-border">
      {isPending && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {tweets.length > 0 ? (
        tweets.map((tweet, key) => (
          <Tweet key={key} tweet={tweet} currentUserId={currentUserId} />
        ))
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          <p>No tweets yet. Be the first to tweet!</p>
        </div>
      )}
    </div>
  );
}
