# AI Content Strategist

An AI-powered content strategy platform that discovers keywords, generates article topics and content, analyzes competitors, and creates interlinking strategies using Claude API.

## Quick Start

```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npx prisma migrate dev --name init
npm run dev
```

## Test Phase 1

```bash
curl -X POST http://localhost:3000/api/keywords/search \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI agent development", "count": 25}'
```

## Tech Stack

- Node.js + Express.js
- Prisma ORM + SQLite
- Claude API (Anthropic)

## Cost

Full MVP: ~$35 total (vs $99-999/month for Ahrefs)

## License

MIT
