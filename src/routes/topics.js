import express from 'express';
import { generateTopicsForKeyword } from '../utils/claude.js';

const router = express.Router();

router.post('/generate', async (req, res, next) => {
  try {
    const { keywordId } = req.body;
    if (!keywordId) return res.status(400).json({ error: 'keywordId required' });
    
    const keyword = await req.prisma.keyword.findUnique({ where: { id: keywordId }, include: { pillar: true } });
    if (!keyword) return res.status(404).json({ error: 'Keyword not found' });
    
    const { tofu, mofu, bofu, tokensUsed } = await generateTopicsForKeyword(req.claude, keyword.keyword, keyword.pillar?.title || 'General');
    
    const topics = [];
    for (const [stage, data] of Object.entries({ tofu, mofu, bofu })) {
      if (data) {
        const topic = await req.prisma.topic.create({
          data: {
            keywordId,
            pillarId: keyword.pillarId,
            stage: stage.toUpperCase(),
            title: data.title || `${keyword.keyword} - ${stage.toUpperCase()}`,
            outline: data.outline || JSON.stringify(data),
            metaDesc: data.metaDesc,
            tokens: tokensUsed / 3
          }
        });
        topics.push(topic);
      }
    }
    
    await req.prisma.project.update({ where: { id: 'default' }, data: { totalTokens: { increment: tokensUsed }, topicsGenerated: { increment: topics.length } } });
    res.json({ success: true, topicsCreated: topics.length, topics, tokensUsed, estimatedCost: (tokensUsed * 0.003) / 1000 });
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    const { pillarId, stage } = req.query;
    const where = {};
    if (pillarId) where.pillarId = pillarId;
    if (stage) where.stage = stage.toUpperCase();
    
    const topics = await req.prisma.topic.findMany({ where, include: { keyword: true, pillar: true }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, count: topics.length, topics });
  } catch (error) { next(error); }
});

export default router;
