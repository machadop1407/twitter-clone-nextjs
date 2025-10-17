-- CreateIndex
CREATE INDEX "follows_followingId_idx" ON "follows"("followingId");

-- CreateIndex
CREATE INDEX "follows_followerId_idx" ON "follows"("followerId");

-- CreateIndex
CREATE INDEX "likes_tweetId_idx" ON "likes"("tweetId");

-- CreateIndex
CREATE INDEX "likes_userId_idx" ON "likes"("userId");

-- CreateIndex
CREATE INDEX "likes_userId_createdAt_idx" ON "likes"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_recipientId_idx" ON "notifications"("recipientId");

-- CreateIndex
CREATE INDEX "notifications_recipientId_read_idx" ON "notifications"("recipientId", "read");

-- CreateIndex
CREATE INDEX "notifications_recipientId_createdAt_idx" ON "notifications"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "retweets_tweetId_idx" ON "retweets"("tweetId");

-- CreateIndex
CREATE INDEX "retweets_userId_idx" ON "retweets"("userId");

-- CreateIndex
CREATE INDEX "retweets_userId_createdAt_idx" ON "retweets"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "tweets_createdAt_idx" ON "tweets"("createdAt");

-- CreateIndex
CREATE INDEX "tweets_authorId_idx" ON "tweets"("authorId");

-- CreateIndex
CREATE INDEX "tweets_parentId_idx" ON "tweets"("parentId");

-- CreateIndex
CREATE INDEX "tweets_authorId_createdAt_idx" ON "tweets"("authorId", "createdAt");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "user"("username");
