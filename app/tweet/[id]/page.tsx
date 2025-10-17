import TweetDetail from "@/components/tweet/tweet-detail";
import { getTweetById, getTweetReplies } from "@/lib/actions/tweets";
import { getSession } from "@/lib/auth/auth-actions";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const paramsResolved = await params;
  const id = paramsResolved.id;

  const tweetResult = await getTweetById(id);

  if (!tweetResult.success || !tweetResult.tweet) {
    return {
      title: "Tweet Not Found",
      description:
        "The tweet you're looking for doesn't exist or has been deleted.",
    };
  }

  const tweet = tweetResult.tweet;
  const tweetContent =
    tweet.content.length > 160
      ? tweet.content.substring(0, 160) + "..."
      : tweet.content;

  const authorName = tweet.author.name;
  const authorUsername = tweet.author.username;

  return {
    title: `${authorName} (@${authorUsername})`,
    description: tweetContent,
    openGraph: {
      title: `${authorName} (@${authorUsername})`,
      description: tweetContent,
      type: "article",
      publishedTime: tweet.createdAt.toISOString(),
      authors: [authorName],
      images: tweet.imageUrl
        ? [
            {
              url: tweet.imageUrl,
              width: 800,
              height: 600,
              alt: `Tweet image by ${authorName}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: tweet.imageUrl ? "summary_large_image" : "summary",
      title: `${authorName} (@${authorUsername})`,
      description: tweetContent,
      images: tweet.imageUrl ? [tweet.imageUrl] : undefined,
      creator: `@${authorUsername}`,
    },
  };
}

export default async function TweetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const paramsResolved = await params;
  const id = paramsResolved.id;

  const tweetResult = await getTweetById(id);

  if (!tweetResult.success || !tweetResult.tweet) {
    redirect("/");
  }

  const repliesResult = await getTweetReplies(id);

  return (
    <TweetDetail
      tweet={tweetResult.tweet}
      replies={repliesResult.replies ?? []}
      currentUserId={session.user.id}
    />
  );
}
