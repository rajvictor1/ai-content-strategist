import express from 'express';
const router = express.Router();
router.get('/', async (req, res) => {
  const articles = await req.prisma.article.findMany({ include: { topic: true, pillar: true } });
  res.json({ success: true, articles });
});
export default router;
