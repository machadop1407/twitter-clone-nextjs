"use server";
import { redirect } from "next/navigation";
import { getSession } from "../auth/auth-actions";
import { prisma } from "../prisma";
import { createNotification } from "./notifications";
import { revalidateTag, unstable_cache, revalidatePath } from "next/cache";

export async function createTweet(content: string, imageUrl?: string) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  try {
    const tweet = await prisma.tweet.create({
      data: {
        content,
        imageUrl,
        authorId: session.user.id,
      },
    });

    // Revalidate cached data
    revalidateTag("tweets");
    revalidateTag("paginated-tweets");
    revalidateTag("user-tweets");
    revalidatePath("/");

    return { success: true, tweet };
  } catch (err) {
    console.error("Error creating tweet:", err);
    return { success: false, error: "Failed to tweet" };
  }
}

export async function createReplyTweet(
  tweetId: string,
  content: string,
  imageUrl?: string
) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  try {
    const tweet = await prisma.tweet.create({
      data: {
        content,
        imageUrl,
        authorId: session.user.id,
        parentId: tweetId,
      },
    });

    // Create the notification
    const originalTweet = await prisma.tweet.findUnique({
      where: {
        id: tweetId,
      },
      select: {
        authorId: true,
      },
    });

    if (originalTweet) {
      await createNotification(
        "REPLY",
        originalTweet.authorId,
        session.user.id,
        tweetId
      );
    }

    // Revalidate cached data
    revalidateTag("tweets");
    revalidateTag("paginated-tweets");
    revalidateTag("user-tweets");
    revalidateTag(`tweet-${tweetId}`);
    revalidateTag(`tweet-replies-${tweetId}`);
    revalidatePath("/");

    return { success: true, tweet };
  } catch (err) {
    console.error("Error creating tweet:", err);
    return { success: false, error: "Failed to tweet" };
  }
}

export const getCachedTweetById = unstable_cache(
  async (tweetId: string) => {
    try {
      const tweet = await prisma.tweet.findUnique({
        where: {
          id: tweetId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          likes: true,
          retweets: true,
        },
      });

      if (!tweet) {
        return { success: false, error: "Tweet was not found" };
      }

      return { success: true, tweet };
    } catch (err) {
      console.error("Error getting tweets:", err);
      return { success: false, error: "Failed to fetch tweet" };
    }
  },
  ["tweet-detail"],
  { revalidate: 300, tags: ["tweet-detail"] }
);

export async function getTweetById(tweetId: string) {
  return getCachedTweetById(tweetId);
}

export async function likeTweet(tweetId: string) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  try {
    // check to see if user already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: {
          userId: session.user.id,
          tweetId,
        },
      },
    });

    if (existingLike) {
      // unlike the tweet
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Revalidate cached data
      revalidateTag("tweets");
      revalidateTag("paginated-tweets");
      revalidateTag("user-tweets");
      revalidateTag(`tweet-${tweetId}`);

      return { success: true, action: "unliked" };
    } else {
      // like the tweet
      await prisma.like.create({
        data: {
          userId: session.user.id,
          tweetId,
        },
      });

      // Create the notification
      const tweet = await prisma.tweet.findUnique({
        where: {
          id: tweetId,
        },
        select: {
          authorId: true,
        },
      });

      if (tweet) {
        await createNotification(
          "LIKE",
          tweet.authorId,
          session.user.id,
          tweetId
        );
      }

      // Revalidate cached data
      revalidateTag("tweets");
      revalidateTag("paginated-tweets");
      revalidateTag("user-tweets");
      revalidateTag(`tweet-${tweetId}`);

      return { success: true, action: "liked" };
    }
  } catch (err) {
    console.error("Error liking tweet:", err);
    return { success: false, error: "Failed to like tweet" };
  }
}

export async function retweetTweet(tweetId: string) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  try {
    // check to see if user already retweeted
    const existingRetweet = await prisma.retweet.findUnique({
      where: {
        userId_tweetId: {
          userId: session.user.id,
          tweetId,
        },
      },
    });

    if (existingRetweet) {
      // undo the retweet
      await prisma.retweet.delete({
        where: {
          id: existingRetweet.id,
        },
      });

      // Revalidate cached data
      revalidateTag("tweets");
      revalidateTag("paginated-tweets");
      revalidateTag("user-tweets");
      revalidateTag(`tweet-${tweetId}`);

      return { success: true, action: "undo-retweet" };
    } else {
      //  retweet tweet
      await prisma.retweet.create({
        data: {
          userId: session.user.id,
          tweetId,
        },
      });

      // Create the notification
      const tweet = await prisma.tweet.findUnique({
        where: {
          id: tweetId,
        },
        select: {
          authorId: true,
        },
      });

      if (tweet) {
        await createNotification(
          "RETWEET",
          tweet.authorId,
          session.user.id,
          tweetId
        );
      }

      // Revalidate cached data
      revalidateTag("tweets");
      revalidateTag("paginated-tweets");
      revalidateTag("user-tweets");
      revalidateTag(`tweet-${tweetId}`);

      return { success: true, action: "retweeted" };
    }
  } catch (err) {
    console.error("Error retweeting tweet:", err);
    return { success: false, error: "Failed to retweet tweet" };
  }
}

export const getCachedTweetReplies = unstable_cache(
  async (tweetId: string) => {
    try {
      const replies = await prisma.tweet.findMany({
        where: {
          parentId: tweetId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          likes: true,
          retweets: true,
        },
      });

      return { success: true, replies };
    } catch (err) {
      console.error("Error getting tweet replies:", err);
      return { success: false, error: "Failed to fetch tweet replies" };
    }
  },
  ["tweet-replies"],
  { revalidate: 300, tags: ["tweet-replies"] }
);

export async function getTweetReplies(tweetId: string) {
  return getCachedTweetReplies(tweetId);
}

// Removed getCachedTweets and getTweets to avoid 2MB cache limit
// Use getPaginatedTweets instead for better performance

export const getCachedPaginatedTweets = unstable_cache(
  async (page: number = 1, limit: number = 10) => {
    try {
      const skip = (page - 1) * limit;

      const [tweets, totalCount] = await Promise.all([
        prisma.tweet.findMany({
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
            likes: true,
            retweets: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.tweet.count(),
      ]);

      return {
        success: true,
        tweets,
        pagination: {
          page,
          limit,
          totalCount,
          hasMore: skip + tweets.length < totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (err) {
      console.error("Error fetching tweets:", err);
      return { success: false, error: "Failed to fetch tweets" };
    }
  },
  ["paginated-tweets"],
  { revalidate: 60, tags: ["tweets", "paginated-tweets"] }
);

// limit = 10
// page = 1
export async function getPaginatedTweets(page: number = 1, limit: number = 10) {
  return getCachedPaginatedTweets(page, limit);
}
