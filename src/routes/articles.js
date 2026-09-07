import express from 'express';
import { generateArticleContent } from '../utils/claude.js';

const router = express.Router();

router.post('/generate', async (req, res, next) => {
  try {
    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ error: 'topicId required' });
    
    const topic = await req.prisma.topic.findUnique({ where: { id: topicId }, include: { keyword: true, pillar: true } });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    
    if (!topic.pillarId || !topic.pillar) {
      return res.status(400).json({ error: 'Topic is not assigned to a pillar. Run pillar mapping first.' });
    }

    const { content, wordCount, tokensUsed } = await generateArticleContent(req.claude, topic.title, topic.keyword.keyword, topic.pillar.title);
    
    const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const article = await req.prisma.article.create({
      data: {
        topicId,
        pillarId: topic.pillarId,
        title: topic.title,
        slug,
        content,
        stage: topic.stage,
        wordCount,
        focusKeyword: topic.keyword.keyword,
        tokens: tokensUsed,
        status: 'draft'
      }
    });
    
    await req.prisma.project.update({ where: { id: 'default' }, data: { totalTokens: { increment: tokensUsed }, articlesGenerated: { increment: 1 } } });
    res.json({ success: true, articleCreated: true, article, wordCount, tokensUsed, estimatedCost: (tokensUsed * 0.003) / 1000 });
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    const { pillarId, stage, status } = req.query;
    const where = {};
    if (pillarId) where.pillarId = pillarId;
    if (stage) where.stage = stage.toUpperCase();
    if (status) where.status = status;
    
    const articles = await req.prisma.article.findMany({ where, include: { pillar: true, topic: true }, orderBy: { created: 'desc' } });
    res.json({ success: true, count: articles.length, articles });
  } catch (error) { next(error); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { status, published } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (published !== undefined) {
      updates.published = published;
      if (published) updates.publishedAt = new Date();
    }
    
    const article = await req.prisma.article.update({ where: { id: req.params.id }, data: updates });
    res.json({ success: true, article });
  } catch (error) { next(error); }
});

export default router;
