import MainLayout from "@/components/main-layout";
import ProfileContent from "@/components/profile/profile-content";
import ProfileHeader from "@/components/profile/profile-header";
import {
  checkFollowStatus,
  getCachedUserProfile,
  getUserTweets,
} from "@/lib/actions/profile";
import { getSession } from "@/lib/auth/auth-actions";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const username = decodeURIComponent(resolvedParams.username);

  const profileResult = await getCachedUserProfile(username);

  if (!profileResult.success || !profileResult.user) {
    return {
      title: "User Not Found",
      description: "The user you're looking for doesn't exist.",
    };
  }

  const user = profileResult.user;
  const bio = user.bio || `Follow ${user.name} (@${user.username}) on Twitter`;
  const followerCount = user._count.followers;
  const followingCount = user._count.following;
  const tweetCount = user.postsCount;

  return {
    title: `${user.name} (@${user.username})`,
    description: bio,
    openGraph: {
      title: `${user.name} (@${user.username})`,
      description: bio,
      type: "profile",
      images: user.avatar
        ? [
            {
              url: user.avatar,
              width: 400,
              height: 400,
              alt: `Profile picture of ${user.name}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary",
      title: `${user.name} (@${user.username})`,
      description: bio,
      images: user.avatar ? [user.avatar] : undefined,
      creator: `@${user.username}`,
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const username = decodeURIComponent(resolvedParams.username);

  const [profileResult, tweetsResult] = await Promise.all([
    getCachedUserProfile(username).then(async (result) => {
      if (result.success && result.user) {
        const followStatus = await checkFollowStatus(result.user.id);
        return { ...result, isFollowing: followStatus.isFollowing };
      }

      return { success: false, isFollowing: false, user: null };
    }),
    getUserTweets(username),
  ]);

  const user = profileResult.user;
  const isFollowing = profileResult.isFollowing;
  const tweets = tweetsResult.success ? tweetsResult.tweets || [] : [];

  if (!profileResult.success || !user) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">User not found</h1>
          <p className="text-muted-foreground mt-2">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ProfileHeader
        user={user}
        currentUser={session.user}
        isFollowing={isFollowing}
        followerCount={user._count.following}
        followingCount={user._count.followers}
      />
      <ProfileContent
        username={username}
        initialTweets={tweets}
        tweetCount={user.postsCount}
        replyCount={user.repliesCount}
        likeCount={user._count.likes}
        retweetCount={user._count.retweets}
        currentUserId={session.user?.id}
      />
    </MainLayout>
  );
}
