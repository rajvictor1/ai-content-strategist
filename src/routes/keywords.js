import express from 'express';
import { discoverKeywords, createPillarStructure } from '../utils/claude.js';

const router = express.Router();

router.post('/search', async (req, res, next) => {
  try {
    const { topic, count = 25 } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic required' });
    const { keywords, tokensUsed } = await discoverKeywords(req.claude, topic, count);
    const savedKeywords = await req.prisma.keyword.createMany({
      data: keywords.map(k => ({ keyword: k.keyword, searchVolume: k.volume, difficulty: k.difficulty, intent: k.intent }))
    });
    await req.prisma.project.update({ where: { id: 'default' }, data: { totalTokens: { increment: tokensUsed }, keywordsDiscovered: savedKeywords.count } });
    res.json({ success: true, keywordsCreated: savedKeywords.count, keywords, tokensUsed, estimatedCost: (tokensUsed * 0.003) / 1000 });
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    const keywords = await req.prisma.keyword.findMany({ include: { pillar: true }, orderBy: { discovered: 'desc' } });
    res.json({ success: true, count: keywords.length, keywords });
  } catch (error) { next(error); }
});

router.get('/stats/summary', async (req, res, next) => {
  try {
    const keywords = await req.prisma.keyword.findMany();
    const stats = {
      totalKeywords: keywords.length,
      byIntent: { informational: keywords.filter(k => k.intent === 'Informational').length, commercial: keywords.filter(k => k.intent === 'Commercial').length, transactional: keywords.filter(k => k.intent === 'Transactional').length },
      byDifficulty: { easy: keywords.filter(k => k.difficulty < 30).length, medium: keywords.filter(k => k.difficulty >= 30 && k.difficulty < 70).length, hard: keywords.filter(k => k.difficulty >= 70).length },
      avgVolume: Math.round(keywords.reduce((sum, k) => sum + (k.searchVolume || 0), 0) / keywords.length),
      avgDifficulty: Math.round(keywords.reduce((sum, k) => sum + (k.difficulty || 0), 0) / keywords.length)
    };
    res.json({ success: true, stats });
  } catch (error) { next(error); }
});

router.post('/organize-pillars', async (req, res, next) => {
  try {
    const { pillarCount = 11 } = req.body;
    const keywords = await req.prisma.keyword.findMany();
    if (keywords.length === 0) return res.status(400).json({ error: 'No keywords found. Run keyword discovery first.' });
    const { pillars, tokensUsed } = await createPillarStructure(req.claude, keywords, pillarCount);
    const savedPillars = [];
    for (const pillar of pillars) {
      const existing = await req.prisma.pillar.findUnique({ where: { title: pillar.name } });
      let saved;
      if (existing) {
        saved = await req.prisma.pillar.update({
          where: { id: existing.id },
          data: { description: pillar.description, authority: pillar.authority || 0 }
        });
      } else {
        saved = await req.prisma.pillar.create({ data: { title: pillar.name, description: pillar.description, authority: pillar.authority || 0 } });
      }
      const keywordIds = (pillar.keywordIds || pillar.keywords || []).filter(Boolean);
      if (keywordIds.length > 0) {
        await req.prisma.keyword.updateMany({ where: { id: { in: keywordIds } }, data: { pillarId: saved.id } });
      }
      savedPillars.push(saved);
    }
    await req.prisma.project.update({ where: { id: 'default' }, data: { totalTokens: { increment: tokensUsed }, keywordsAssigned: { increment: pillars.reduce((sum, p) => sum + (p.keywords?.length || 0), 0) } } });
    res.json({ success: true, pillarsCreated: savedPillars.length, pillars: savedPillars, tokensUsed, estimatedCost: (tokensUsed * 0.003) / 1000 });
  } catch (error) { next(error); }
});

export default router;
