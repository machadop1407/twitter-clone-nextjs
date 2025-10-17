import MainLayout from "@/components/main-layout";
import TweetComposer from "@/components/tweet/tweet-composer";
import TweetFeedSuspense from "@/components/tweet/tweet-feed-suspense";
import { getSession } from "@/lib/auth/auth-actions";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Stay updated with the latest tweets and conversations. Share your thoughts and connect with others on Twitter.",
  openGraph: {
    title: "Home | Twitter",
    description:
      "Stay updated with the latest tweets and conversations. Share your thoughts and connect with others on Twitter.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Home | Twitter",
    description:
      "Stay updated with the latest tweets and conversations. Share your thoughts and connect with others on Twitter.",
  },
};

export default async function Home() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <MainLayout>
      <div className="border-b border-border">
        <div className="p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
      </div>

      {/* Tweet Composer */}
      <TweetComposer user={session?.user} />

      {/* Tweet Feed */}
      <TweetFeedSuspense currentUserId={session.user.id} />
    </MainLayout>
  );
}
