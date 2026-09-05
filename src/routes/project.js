import express from 'express';
const router = express.Router();

router.get('/settings', async (req, res) => {
  const settings = await req.prisma.projectSettings.findUnique({ where: { id: 1 } });
  res.json({ success: true, settings });
});

router.put('/settings', async (req, res) => {
  const settings = await req.prisma.projectSettings.update({
    where: { id: 1 },
    data: req.body
  });
  res.json({ success: true, settings });
});

router.get('/progress', async (req, res) => {
  const settings = await req.prisma.projectSettings.findUnique({ where: { id: 1 } });
  const keywords = await req.prisma.keyword.count();
  const pillars = await req.prisma.pillar.count();
  const topics = await req.prisma.topic.count();
  const articles = await req.prisma.article.count();
  
  res.json({
    success: true,
    progress: {
      phase1: { keywords, tokensUsed: settings?.phase1TokensUsed || 0 },
      phase2: { pillars, tokensUsed: settings?.phase2TokensUsed || 0 },
      phase3: { topics, tokensUsed: settings?.phase3TokensUsed || 0 },
      phase4: { articles, tokensUsed: settings?.phase4TokensUsed || 0 }
    }
  });
});

export default router;
