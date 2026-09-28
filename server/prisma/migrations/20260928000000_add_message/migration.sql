-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('new', 'read', 'archived');

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "subject" VARCHAR(120),
    "body" VARCHAR(2000) NOT NULL,
    "ipHash" CHAR(64) NOT NULL,
    "userAgent" VARCHAR(500),
    "status" "MessageStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_status_createdAt_idx" ON "Message"("status", "createdAt" DESC);

