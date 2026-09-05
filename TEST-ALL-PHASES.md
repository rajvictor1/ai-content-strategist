# AI Content Strategist - Complete Test Guide (All 6 Phases)

This guide walks through testing all 6 phases of the AI Content Strategy Agent.

## Prerequisites

1. Ensure the server is running: `npm run dev`
2. Base URL: `http://localhost:3000`

---

## Phase 1: Keyword Discovery

**Endpoint:** `POST /api/keywords/search`

Discover keywords for your topic:

```bash
curl -X POST http://localhost:3000/api/keywords/search \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI agents development",
    "count": 25
  }'
```

**Get all keywords:**

```bash
curl http://localhost:3000/api/keywords
```

**Get keyword statistics:**

```bash
curl http://localhost:3000/api/keywords/stats/summary
```

---

## Phase 2: Pillar Mapping

**Endpoint:** `POST /api/keywords/organize-pillars`

Organize discovered keywords into pillar clusters:

```bash
curl -X POST http://localhost:3000/api/keywords/organize-pillars \
  -H "Content-Type: application/json" \
  -d '{
    "pillarCount": 11
  }'
```

**Get all pillars:**

```bash
curl http://localhost:3000/api/pillars
```

**Get pillar details:**

```bash
curl http://localhost:3000/api/pillars/{pillarId}
```

---

## Phase 3: Topic Generation

**Endpoint:** `POST /api/topics/generate`

Generate TOFU/MOFU/BOFU topics for keywords:

```bash
curl -X POST http://localhost:3000/api/topics/generate \
  -H "Content-Type: application/json" \
  -d '{
    "keywordId": "{keywordId}"
  }'
```

**Get all topics:**

```bash
curl http://localhost:3000/api/topics
```

**Get topics by pillar:**

```bash
curl "http://localhost:3000/api/topics?pillarId={pillarId}"
```

**Get topics by stage (TOFU/MOFU/BOFU):**

```bash
curl "http://localhost:3000/api/topics?stage=tofu"
```

---

## Phase 4: Article Generation

**Endpoint:** `POST /api/articles/generate`

Generate SEO-optimized articles (1500-2000 words):

```bash
curl -X POST http://localhost:3000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "{topicId}"
  }'
```

**Get all articles:**

```bash
curl http://localhost:3000/api/articles
```

**Get articles by pillar:**

```bash
curl "http://localhost:3000/api/articles?pillarId={pillarId}"
```

**Update article status:**

```bash
curl -X PATCH http://localhost:3000/api/articles/{articleId} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "published": true
  }'
```

---

## Phase 5: Competitor Analysis

**Endpoint:** `POST /api/competitors/analyze`

Analyze competitor content for an article:

```bash
curl -X POST http://localhost:3000/api/competitors/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "{articleId}",
    "competitors": [
      {
        "url": "https://example.com/article-1",
        "title": "Example Article 1",
        "rank": 1
      },
      {
        "url": "https://example.com/article-2",
        "title": "Example Article 2",
        "rank": 2
      }
    ]
  }'
```

**Get competitors for article:**

```bash
curl http://localhost:3000/api/competitors/by-article/{articleId}
```

---

## Phase 6: Interlinking Strategy

**Endpoint:** `POST /api/links/generate`

Generate internal linking recommendations:

```bash
curl -X POST http://localhost:3000/api/links/generate \
  -H "Content-Type: application/json" \
  -d '{
    "pillarId": "{pillarId}"
  }'
```

**Get links for article:**

```bash
curl http://localhost:3000/api/links/by-article/{articleId}
```

---

## Project Progress & Metrics

**Get overall progress:**

```bash
curl http://localhost:3000/api/project/progress
```

**Get project settings:**

```bash
curl http://localhost:3000/api/project/settings
```

**Update project settings:**

```bash
curl -X PUT http://localhost:3000/api/project/settings \
  -H "Content-Type: application/json" \
  -d '{
    "targetKeywords": 50,
    "targetArticles": 100
  }'
```

---

## Complete Workflow Example

```bash
# 1. Start server
npm run dev

# 2. Phase 1: Discover keywords
curl -X POST http://localhost:3000/api/keywords/search \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI agents", "count": 15}'

# 3. Phase 2: Create pillars
curl -X POST http://localhost:3000/api/keywords/organize-pillars \
  -H "Content-Type: application/json" \
  -d '{"pillarCount": 11}'

# 4. Phase 3: Generate topics (replace keywordId)
curl -X POST http://localhost:3000/api/topics/generate \
  -H "Content-Type: application/json" \
  -d '{"keywordId": "YOUR_KEYWORD_ID"}'

# 5. Phase 4: Generate articles (replace topicId)
curl -X POST http://localhost:3000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{"topicId": "YOUR_TOPIC_ID"}'

# 6. Phase 5: Analyze competitors (replace articleId)
curl -X POST http://localhost:3000/api/competitors/analyze \
  -H "Content-Type: application/json" \
  -d '{"articleId": "YOUR_ARTICLE_ID", "competitors": [{"url": "https://example.com", "title": "Example", "rank": 1}]}'

# 7. Phase 6: Generate interlinking (replace pillarId)
curl -X POST http://localhost:3000/api/links/generate \
  -H "Content-Type: application/json" \
  -d '{"pillarId": "YOUR_PILLAR_ID"}'

# Check progress
curl http://localhost:3000/api/project/progress
```

---

## Notes

- Replace `{keywordId}`, `{topicId}`, `{articleId}`, `{pillarId}` with actual IDs from responses
- Token usage is tracked in API responses
- All operations support error handling with meaningful error messages
- Database schema supports relationships between all entities
