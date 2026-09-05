import express from 'express';
const router = express.Router();
router.get('/', async (req, res) => {
  const pillars = await req.prisma.pillar.findMany({ include: { keywords: true } });
  res.json({ success: true, pillars });
});
router.get('/:id', async (req, res) => {
  const pillar = await req.prisma.pillar.findUnique({
    where: { id: req.params.id },
    include: { keywords: true, topics: true, articles: true }
  });
  res.json({ success: true, pillar });
});
export default router;
