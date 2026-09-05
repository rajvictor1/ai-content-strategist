import express from 'express';
const router = express.Router();

router.get('/settings', async (req, res, next) => {
  try {
    const project = await req.prisma.project.findUnique({ where: { id: 'default' } });
    res.json({ success: true, settings: project });
  } catch (error) { next(error); }
});

router.put('/settings', async (req, res, next) => {
  try {
    const project = await req.prisma.project.update({
      where: { id: 'default' },
      data: req.body
    });
    res.json({ success: true, settings: project });
  } catch (error) { next(error); }
});

router.get('/progress', async (req, res, next) => {
  try {
    const project = await req.prisma.project.findUnique({ where: { id: 'default' } });
    const keywords = await req.prisma.keyword.count();
    const pillars = await req.prisma.pillar.count();
    const topics = await req.prisma.topic.count();
    const articles = await req.prisma.article.count();
    const competitors = await req.prisma.competitor.count();
    const links = await req.prisma.link.count();
    
    res.json({
      success: true,
      project,
      progress: {
        phase1: { name: 'Keyword Discovery', count: keywords },
        phase2: { name: 'Pillar Mapping', count: pillars },
        phase3: { name: 'Topic Generation', count: topics },
        phase4: { name: 'Article Generation', count: articles },
        phase5: { name: 'Competitor Analysis', count: competitors },
        phase6: { name: 'Interlinking Strategy', count: links }
      },
      totals: { keywords, pillars, topics, articles, competitors, links }
    });
  } catch (error) { next(error); }
});

export default router;
