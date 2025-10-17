import { FileText, Heart, MessageSquare, Repeat2 } from "lucide-react";
import { Button } from "../ui/button";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tweetCount: number;
  replyCount: number;
  likeCount: number;
  retweetCount: number;
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
  tweetCount,
  replyCount,
  likeCount,
  retweetCount,
}: ProfileTabsProps) {
  const tabs = [
    {
      id: "posts",
      label: "Posts",
      icon: FileText,
      count: tweetCount,
    },
    {
      id: "replies",
      label: "Replies",
      icon: MessageSquare,
      count: replyCount,
    },
    {
      id: "likes",
      label: "Likes",
      icon: Heart,
      count: likeCount,
    },
    {
      id: "retweets",
      label: "Retweets",
      icon: Repeat2,
      count: retweetCount,
    },
  ];

  return (
    <div className="border-b border-border">
      <div className="flex">
        {tabs.map((tab, key) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              variant="ghost"
              key={key}
              className={`flex-1 rounded-none border-b-2 py-5 ${
                isActive
                  ? "border-b-4 border-blue-400 text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                <span className="text-sm text-muted-foreground">
                  {tab.count}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
