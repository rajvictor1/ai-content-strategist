import express from 'express';
const router = express.Router();
router.get('/', async (req, res) => {
  const competitors = await req.prisma.competitor.findMany({ include: { article: true } });
  res.json({ success: true, competitors });
});
export default router;
