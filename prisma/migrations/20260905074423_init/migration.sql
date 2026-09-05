-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "name" TEXT NOT NULL DEFAULT 'AI Content Strategy',
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "targetKeywords" INTEGER NOT NULL DEFAULT 25,
    "targetArticles" INTEGER NOT NULL DEFAULT 75,
    "keywordsDiscovered" INTEGER NOT NULL DEFAULT 0,
    "keywordsAssigned" INTEGER NOT NULL DEFAULT 0,
    "topicsGenerated" INTEGER NOT NULL DEFAULT 0,
    "articlesGenerated" INTEGER NOT NULL DEFAULT 0,
    "preferredTimeline" TEXT NOT NULL DEFAULT 'sequential',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectedEnd" DATETIME,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "totalCost" REAL NOT NULL DEFAULT 0.0,
    "updated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyword" TEXT NOT NULL,
    "searchVolume" INTEGER NOT NULL DEFAULT 0,
    "difficulty" INTEGER NOT NULL DEFAULT 0,
    "intent" TEXT NOT NULL DEFAULT 'Informational',
    "pillarId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'claude_discovery',
    "discovered" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    CONSTRAINT "Keyword_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "Pillar" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pillar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "authority" INTEGER NOT NULL DEFAULT 0,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keywordId" TEXT NOT NULL,
    "pillarId" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'TOFU',
    "title" TEXT NOT NULL,
    "outline" TEXT NOT NULL,
    "metaDesc" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "errorMsg" TEXT,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    CONSTRAINT "Topic_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Topic_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "Pillar" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT,
    "pillarId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'TOFU',
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "metaDesc" TEXT,
    "focusKeyword" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "errorMsg" TEXT,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    CONSTRAINT "Article_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Article_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "Pillar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "domain" TEXT NOT NULL,
    "authority" INTEGER NOT NULL DEFAULT 0,
    "backlinks" INTEGER NOT NULL DEFAULT 0,
    "traffic" INTEGER NOT NULL DEFAULT 0,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "beats" TEXT NOT NULL,
    "analyzed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Competitor_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "anchorText" TEXT NOT NULL DEFAULT 'Read more',
    "type" TEXT NOT NULL DEFAULT 'internal',
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Link_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Link_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_keyword_key" ON "Keyword"("keyword");

-- CreateIndex
CREATE INDEX "Keyword_pillarId_idx" ON "Keyword"("pillarId");

-- CreateIndex
CREATE UNIQUE INDEX "Pillar_title_key" ON "Pillar"("title");

-- CreateIndex
CREATE INDEX "Topic_keywordId_idx" ON "Topic"("keywordId");

-- CreateIndex
CREATE INDEX "Topic_pillarId_idx" ON "Topic"("pillarId");

-- CreateIndex
CREATE INDEX "Article_pillarId_idx" ON "Article"("pillarId");

-- CreateIndex
CREATE INDEX "Article_topicId_idx" ON "Article"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_pillarId_slug_key" ON "Article"("pillarId", "slug");

-- CreateIndex
CREATE INDEX "Competitor_articleId_idx" ON "Competitor"("articleId");

-- CreateIndex
CREATE INDEX "Link_sourceId_idx" ON "Link"("sourceId");

-- CreateIndex
CREATE INDEX "Link_targetId_idx" ON "Link"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_sourceId_targetId_key" ON "Link"("sourceId", "targetId");
