CREATE TYPE "BlogStatus" AS ENUM ('draft', 'published');

CREATE TABLE "ProjectBlog" (
    "id" TEXT NOT NULL,
    "projectSlug" VARCHAR(80) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "excerpt" VARCHAR(320) NOT NULL,
    "status" "BlogStatus" NOT NULL DEFAULT 'draft',
    "chapters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    CONSTRAINT "ProjectBlog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectBlog_slug_key" ON "ProjectBlog"("slug");
CREATE INDEX "ProjectBlog_projectSlug_status_publishedAt_idx" ON "ProjectBlog"("projectSlug", "status", "publishedAt" DESC);

CREATE TABLE "BlogFeedback" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "email" VARCHAR(254),
    "message" VARCHAR(1200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogFeedback_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BlogFeedback_blogId_createdAt_idx" ON "BlogFeedback"("blogId", "createdAt" DESC);
ALTER TABLE "BlogFeedback" ADD CONSTRAINT "BlogFeedback_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "ProjectBlog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
