import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with fake data...");

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "john.doe@example.com",
        username: "johndoe",
        name: "John Doe",
        bio: "Software developer passionate about web technologies",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        email: "jane.smith@example.com",
        username: "janesmith",
        name: "Jane Smith",
        bio: "UI/UX Designer creating beautiful digital experiences",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        email: "mike.wilson@example.com",
        username: "mikewilson",
        name: "Mike Wilson",
        bio: "Full-stack developer and tech enthusiast",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        email: "sarah.johnson@example.com",
        username: "sarahjohnson",
        name: "Sarah Johnson",
        bio: "Product Manager | Coffee lover ☕",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
    }),
    prisma.user.create({
      data: {
        email: "alex.brown@example.com",
        username: "alexbrown",
        name: "Alex Brown",
        bio: "DevOps Engineer | Cloud computing enthusiast",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create tweets
  const tweets = await Promise.all([
    prisma.tweet.create({
      data: {
        content:
          "Just finished building an amazing Twitter with Next.js! The development experience is incredible 🚀",
        authorId: users[0].id,
      },
    }),
    prisma.tweet.create({
      data: {
        content:
          "Beautiful day today! Sometimes you just need to step away from the computer and enjoy nature 🌅",
        authorId: users[1].id,
      },
    }),
    prisma.tweet.create({
      data: {
        content:
          "Working on a new project using TypeScript and Prisma. The type safety is incredible!",
        authorId: users[2].id,
      },
    }),
    prisma.tweet.create({
      data: {
        content:
          "Coffee break ☕ Perfect time to review code and plan the next features",
        authorId: users[3].id,
      },
    }),
    prisma.tweet.create({
      data: {
        content:
          "Deployed our app to production today! The CI/CD pipeline worked flawlessly 🎉",
        authorId: users[4].id,
      },
    }),
    prisma.tweet.create({
      data: {
        content:
          "Learning about microservices architecture. The scalability benefits are impressive!",
        authorId: users[0].id,
      },
    }),
    prisma.tweet.create({
      data: {
        content:
          "Design system components are game-changers for maintaining consistency across products",
        authorId: users[1].id,
      },
    }),
    prisma.tweet.create({
      data: {
        content:
          "Just discovered this amazing library for handling forms in React. Productivity level: 📈",
        authorId: users[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${tweets.length} tweets`);

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- Users: ${users.length}`);
  console.log(`- Tweets: ${tweets.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
