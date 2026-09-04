import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import keywordRoutes from './routes/keywords.js';
import pillarRoutes from './routes/pillars.js';
import topicRoutes from './routes/topics.js';
import articleRoutes from './routes/articles.js';
import competitorRoutes from './routes/competitors.js';
import projectRoutes from './routes/project.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.prisma = prisma;
  req.claude = client;
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/keywords', keywordRoutes);
app.use('/api/pillars', pillarRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/project', projectRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await prisma.$executeRaw`SELECT 1`;
    console.log('✓ Database connected');
    const settings = await prisma.projectSettings.findUnique({
      where: { id: 'default' },
    });
    if (!settings) {
      await prisma.projectSettings.create({ data: { id: 'default' } });
      console.log('✓ Project settings initialized');
    }
    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

start();
