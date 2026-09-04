# Development Guide - Phases 2-6

## Architecture

Client → Express Route → Claude Utility → Prisma ORM → SQLite

## Phase 2: Pillar Mapping

Enhance pillar analysis with:
- Authority scores
- Content depth estimation
- Topical relevance

## Phase 3: Topic Generation

Generate outlines for:
- TOFU (awareness stage)
- MOFU (consideration stage)
- BOFU (decision stage)

## Phase 4: Article Generation

Generate 1500-2000 word articles:
- SEO optimized
- Keyword focused
- Batch processing

## Phase 5: Competitor Analysis

Analyze top 3 competitors:
- Identify strengths/weaknesses
- Create beat strategies

## Phase 6: Interlinking

Create internal linking:
- Pillar to children
- Cross-cluster links
- Publishing sequence

## Testing

```bash
npm test
npx prisma studio  # View database
```

## Deployment

Switch to PostgreSQL in .env:
npx prisma migrate deploy

npm run build

npm start

