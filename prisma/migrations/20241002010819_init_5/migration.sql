-- CreateTable
CREATE TABLE "User" (
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT DEFAULT 'default.jpg',
    "cover" TEXT DEFAULT 'default.jpg',
    "bio" TEXT,
    "link" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" SERIAL NOT NULL,
    "userSlug" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answerOf" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TweetLikes" (
    "id" SERIAL NOT NULL,
    "userSlug" TEXT NOT NULL,
    "tweetId" INTEGER NOT NULL,

    CONSTRAINT "TweetLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "user1Slug" TEXT NOT NULL,
    "user2Slug" TEXT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trend" (
    "id" SERIAL NOT NULL,
    "hastag" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_userSlug_fkey" FOREIGN KEY ("userSlug") REFERENCES "User"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetLikes" ADD CONSTRAINT "TweetLikes_userSlug_fkey" FOREIGN KEY ("userSlug") REFERENCES "User"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetLikes" ADD CONSTRAINT "TweetLikes_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
