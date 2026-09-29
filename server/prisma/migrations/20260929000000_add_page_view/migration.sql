-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" VARCHAR(200) NOT NULL,
    "referrerHost" VARCHAR(100),
    "visitorHash" CHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");
