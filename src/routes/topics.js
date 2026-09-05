import express from 'express';
const router = express.Router();
router.get('/', async (req, res) => {
  const topics = await req.prisma.topic.findMany({ include: { keyword: true, pillar: true } });
  res.json({ success: true, topics });
});
export default router;
