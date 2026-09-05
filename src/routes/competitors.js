import express from 'express';
import { analyzeCompetitor } from '../utils/claude.js';

const router = express.Router();

router.post('/analyze', async (req, res, next) => {
  try {
    const { articleId, competitors } = req.body;
    if (!articleId || !competitors || !Array.isArray(competitors)) {
      return res.status(400).json({ error: 'articleId and competitors array required' });
    }
    
    const article = await req.prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    
    const analyzed = [];
    let totalTokens = 0;
    
    for (const comp of competitors) {
      const { analysis, tokensUsed } = await analyzeCompetitor(req.claude, article.focusKeyword, comp.url, comp.title);
      totalTokens += tokensUsed;
      
      const competitor = await req.prisma.competitor.create({
        data: {
          articleId,
          url: comp.url,
          title: comp.title,
          domain: new URL(comp.url).hostname,
          rank: comp.rank || 0,
          authority: analysis.authority || 0,
          backlinks: analysis.backlinks || 0,
          traffic: analysis.traffic || 0,
          strengths: analysis.strengths || '',
          weaknesses: analysis.weaknesses || '',
          beats: analysis.beats || ''
        }
      });
      analyzed.push(competitor);
    }
    
    await req.prisma.project.update({ where: { id: 'default' }, data: { totalTokens: { increment: totalTokens } } });
    res.json({ success: true, analyzed: analyzed.length, competitors: analyzed, tokensUsed: totalTokens, estimatedCost: (totalTokens * 0.003) / 1000 });
  } catch (error) { next(error); }
});

router.get('/by-article/:articleId', async (req, res, next) => {
  try {
    const competitors = await req.prisma.competitor.findMany({ where: { articleId: req.params.articleId }, orderBy: { rank: 'asc' } });
    res.json({ success: true, count: competitors.length, competitors });
  } catch (error) { next(error); }
});

export default router;
