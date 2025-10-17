import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// Sample data arrays for generating realistic content
const sampleNames = [
  "John Doe",
  "Jane Smith",
  "Mike Wilson",
  "Sarah Johnson",
  "Alex Brown",
  "Emily Davis",
  "David Miller",
  "Lisa Anderson",
  "Chris Taylor",
  "Maria Garcia",
  "James Rodriguez",
  "Jennifer Martinez",
  "Robert Lee",
  "Amanda White",
  "Michael Harris",
  "Jessica Clark",
  "William Lewis",
  "Ashley Walker",
  "Christopher Hall",
  "Samantha Young",
  "Daniel King",
  "Nicole Wright",
  "Matthew Lopez",
  "Stephanie Hill",
  "Andrew Scott",
  "Rachel Green",
  "Joshua Adams",
  "Megan Baker",
  "Ryan Nelson",
  "Lauren Carter",
];

const sampleUsernames = [
  "johndoe",
  "janesmith",
  "mikewilson",
  "sarahjohnson",
  "alexbrown",
  "emilydavis",
  "davidmiller",
  "lisaanderson",
  "christaylor",
  "mariagarcia",
  "jamesrodriguez",
  "jennifermartinez",
  "robertlee",
  "amandawhite",
  "michaelharris",
  "jessicaclark",
  "williamlewis",
  "ashleywalker",
  "christopherhall",
  "samanthayoung",
  "danielking",
  "nicolewright",
  "matthewlopez",
  "stephaniehill",
  "andrewscott",
  "rachelgreen",
  "joshuadams",
  "meganbaker",
  "ryannelson",
  "laurencarter",
];

const sampleBios = [
  "Software developer passionate about web technologies",
  "UI/UX Designer creating beautiful digital experiences",
  "Full-stack developer and tech enthusiast",
  "Product Manager | Coffee lover ☕",
  "DevOps Engineer | Cloud computing enthusiast",
  "Data Scientist exploring AI and machine learning",
  "Frontend Developer | React enthusiast",
  "Backend Developer | Node.js and Python",
  "Mobile Developer | iOS and Android",
  "Designer | Creating user-centered experiences",
  "Tech Writer | Sharing knowledge with the community",
  "Open Source Contributor | Building the future",
  "Startup Founder | Disrupting industries",
  "Digital Marketer | Growth hacking expert",
  "Cybersecurity Analyst | Protecting digital assets",
];

const sampleTweets = [
  "Just finished building an amazing Twitter with Next.js! The development experience is incredible 🚀",
  "Beautiful day today! Sometimes you just need to step away from the computer and enjoy nature 🌅",
  "Working on a new project using TypeScript and Prisma. The type safety is incredible!",
  "Coffee break ☕ Perfect time to review code and plan the next features",
  "Deployed our app to production today! The CI/CD pipeline worked flawlessly 🎉",
  "Learning about microservices architecture. The scalability benefits are impressive!",
  "Design system components are game-changers for maintaining consistency across products",
  "Just discovered this amazing library for handling forms in React. Productivity level: 📈",
  "The future of web development is exciting! So many new technologies emerging every day",
  "Code review sessions are so valuable for learning and improving code quality",
  "Database optimization is an art form. Every query matters!",
  "User experience design is about empathy and understanding your audience",
  "Open source communities are amazing. So much knowledge sharing happening",
  "Testing is not optional - it's essential for building reliable software",
  "Performance optimization is a journey, not a destination",
  "Clean code is not just about syntax, it's about communication",
  "The best developers are those who never stop learning",
  "Documentation is code too - it deserves the same attention and care",
  "Accessibility should be built in from the start, not added as an afterthought",
  "Security is everyone's responsibility in software development",
  "Version control is a lifesaver. Git is truly a game-changer",
  "Code refactoring is like renovating a house - messy but necessary",
  "The best debugging tool is still a good night's sleep",
  "Pair programming is underrated. Two minds are better than one",
  "Code reviews should be constructive, not destructive",
  "The most important skill for a developer is problem-solving",
  "APIs are the backbone of modern applications",
  "Caching strategies can make or break application performance",
  "Monitoring and observability are crucial for production systems",
  "The cloud has revolutionized how we build and deploy applications",
];

const avatarUrls = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  console.log(
    "🌱 Seeding database with large dataset for infinite scroll testing..."
  );

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.retweet.deleteMany();
  await prisma.tweet.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleared existing data");

  // Create 50 users
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@example.com`,
        username: sampleUsernames[i] || `user${i + 1}`,
        name: sampleNames[i] || `User ${i + 1}`,
        bio: getRandomElement(sampleBios),
        avatar: getRandomElement(avatarUrls),
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users`);

  // Create follows (random following relationships)
  const follows = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const followingCount = Math.floor(Math.random() * 20) + 5; // 5-25 follows per user
    const followingUsers = getRandomElements(
      users.filter((u) => u.id !== user.id),
      followingCount
    );

    for (const followingUser of followingUsers) {
      try {
        const follow = await prisma.follow.create({
          data: {
            followerId: user.id,
            followingId: followingUser.id,
          },
        });
        follows.push(follow);
      } catch (error) {
        // Skip if follow relationship already exists
      }
    }
  }

  console.log(`✅ Created ${follows.length} follow relationships`);

  // Create 500 tweets with random timing
  const tweets = [];
  const now = new Date();

  for (let i = 0; i < 500; i++) {
    const author = getRandomElement(users);
    const createdAt = new Date(
      now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ); // Random time in last 30 days

    const tweet = await prisma.tweet.create({
      data: {
        content: getRandomElement(sampleTweets),
        authorId: author.id,
        createdAt,
      },
    });
    tweets.push(tweet);
  }

  console.log(`✅ Created ${tweets.length} tweets`);

  // Create likes (random likes on tweets)
  const likes = [];
  for (const tweet of tweets) {
    const likeCount = Math.floor(Math.random() * 50); // 0-50 likes per tweet
    const likingUsers = getRandomElements(users, likeCount);

    for (const user of likingUsers) {
      try {
        const like = await prisma.like.create({
          data: {
            userId: user.id,
            tweetId: tweet.id,
          },
        });
        likes.push(like);
      } catch (error) {
        // Skip if like already exists
      }
    }
  }

  console.log(`✅ Created ${likes.length} likes`);

  // Create retweets (random retweets)
  const retweets = [];
  for (const tweet of tweets) {
    const retweetCount = Math.floor(Math.random() * 20); // 0-20 retweets per tweet
    const retweetingUsers = getRandomElements(users, retweetCount);

    for (const user of retweetingUsers) {
      try {
        const retweet = await prisma.retweet.create({
          data: {
            userId: user.id,
            tweetId: tweet.id,
          },
        });
        retweets.push(retweet);
      } catch (error) {
        // Skip if retweet already exists
      }
    }
  }

  console.log(`✅ Created ${retweets.length} retweets`);

  // Create some replies
  const replies = [];
  const tweetsWithReplies = getRandomElements(tweets, 100); // 100 tweets will have replies

  for (const parentTweet of tweetsWithReplies) {
    const replyCount = Math.floor(Math.random() * 5) + 1; // 1-5 replies per tweet
    const replyingUsers = getRandomElements(users, replyCount);

    for (const user of replyingUsers) {
      const reply = await prisma.tweet.create({
        data: {
          content: `Reply to @${parentTweet.authorId}: ${getRandomElement(
            sampleTweets
          )}`,
          authorId: user.id,
          parentId: parentTweet.id,
          createdAt: new Date(
            parentTweet.createdAt.getTime() +
              Math.random() * 7 * 24 * 60 * 60 * 1000
          ), // Within a week of parent
        },
      });
      replies.push(reply);
    }
  }

  console.log(`✅ Created ${replies.length} replies`);

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- Users: ${users.length}`);
  console.log(`- Follows: ${follows.length}`);
  console.log(`- Tweets: ${tweets.length}`);
  console.log(`- Replies: ${replies.length}`);
  console.log(`- Likes: ${likes.length}`);
  console.log(`- Retweets: ${retweets.length}`);
  console.log(
    `- Total tweets (including replies): ${tweets.length + replies.length}`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
