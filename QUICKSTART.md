# Quick Start - Phase 1: Keyword Discovery

## 1. Install (2 min)
```bash
npm install
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY=sk-ant-...
```

## 2. Setup Database (1 min)
```bash
npx prisma migrate dev --name init
```

## 3. Start Server (1 min)
```bash
npm run dev
```

## 4. Test API (5 min)

Discover keywords:
```bash
curl -X POST http://localhost:3000/api/keywords/search \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI agent development", "count": 25}'
```

Organize pillars:
```bash
curl -X POST http://localhost:3000/api/keywords/organize-pillars
```

Check progress:
```bash
curl http://localhost:3000/api/project/progress
```

Done! Your keyword discovery engine is working. 🚀
