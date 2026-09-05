import express from 'express';
import { generateInterlinkingStrategy } from '../utils/claude.js';

const router = express.Router();

router.post('/generate', async (req, res, next) => {
  try {
    const { pillarId } = req.body;
    if (!pillarId) return res.status(400).json({ error: 'pillarId required' });
    
    const articles = await req.prisma.article.findMany({ where: { pillarId }, select: { id: true, title: true, slug: true } });
    if (articles.length < 2) return res.status(400).json({ error: 'Need at least 2 articles to create internal links' });
    
    const { links, tokensUsed } = await generateInterlinkingStrategy(req.claude, articles);
    
    const created = [];
    for (const link of links) {
      const sourceArticle = articles.find(a => a.slug === link.source || a.title === link.source);
      const targetArticle = articles.find(a => a.slug === link.target || a.title === link.target);
      
      if (sourceArticle && targetArticle) {
        const savedLink = await req.prisma.link.create({
          data: {
            sourceId: sourceArticle.id,
            targetId: targetArticle.id,
            anchorText: link.anchorText || 'Read more',
            type: 'internal'
          }
        }).catch(() => null);
        
        if (savedLink) created.push(savedLink);
      }
    }
    
    await req.prisma.project.update({ where: { id: 'default' }, data: { totalTokens: { increment: tokensUsed } } });
    res.json({ success: true, linksCreated: created.length, links: created, tokensUsed, estimatedCost: (tokensUsed * 0.003) / 1000 });
  } catch (error) { next(error); }
});

router.get('/by-article/:articleId', async (req, res, next) => {
  try {
    const outgoing = await req.prisma.link.findMany({ where: { sourceId: req.params.articleId }, include: { target: true } });
    const incoming = await req.prisma.link.findMany({ where: { targetId: req.params.articleId }, include: { source: true } });
    res.json({ success: true, outgoing, incoming });
  } catch (error) { next(error); }
});

export default router;
