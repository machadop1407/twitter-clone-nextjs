import { getPaginatedTweets } from "@/lib/actions/tweets";
import { Suspense } from "react";
import TweetFeed from "./tweet-feed";
import { Skeleton } from "../ui/skeleton";

async function TweetFeedServer({ currentUserId }: { currentUserId: string }) {
  const result = await getPaginatedTweets(1, 10);
  const tweets = result.success ? result.tweets || [] : [];

  if (!result.pagination) {
    return <></>;
  }

  return (
    <TweetFeed
      initialTweets={tweets}
      currentUserId={currentUserId}
      initialPagination={result.pagination}
    />
  );
}

function TweetFeedSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TweetFeedSuspense({
  currentUserId,
}: {
  currentUserId: string;
}) {
  return (
    <Suspense fallback={<TweetFeedSkeleton />}>
      <TweetFeedServer currentUserId={currentUserId} />
    </Suspense>
  );
}
