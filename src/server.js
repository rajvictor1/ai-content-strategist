import 'dotenv/config.js';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import keywordRoutes from './routes/keywords.js';
import pillarRoutes from './routes/pillars.js';
import topicRoutes from './routes/topics.js';
import articleRoutes from './routes/articles.js';
import competitorRoutes from './routes/competitors.js';
import linkRoutes from './routes/links.js';
import projectRoutes from './routes/project.js';

const app = express();
const prisma = new PrismaClient();
const claude = new Anthropic();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inject Prisma and Claude into request
app.use((req, res, next) => {
  req.prisma = prisma;
  req.claude = claude;
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes - All 6 Phases
app.use('/api/keywords', keywordRoutes);      // Phase 1: Keyword Discovery
app.use('/api/pillars', pillarRoutes);        // Phase 2: Pillar Mapping
app.use('/api/topics', topicRoutes);          // Phase 3: Topic Generation
app.use('/api/articles', articleRoutes);      // Phase 4: Article Generation
app.use('/api/competitors', competitorRoutes);// Phase 5: Competitor Analysis
app.use('/api/links', linkRoutes);            // Phase 6: Interlinking Strategy
app.use('/api/project', projectRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Ensure database is initialized
    await prisma.$connect();
    console.log('✓ Database connected');

    // Initialize project settings if needed
    const projectExists = await prisma.project.findUnique({
      where: { id: 'default' },
    });

    if (!projectExists) {
      await prisma.project.create({
        data: {
          id: 'default',
          name: 'AI Content Strategy',
          description: 'AI-powered content strategy agent',
          status: 'active',
        },
      });
      console.log('✓ Project initialized');
    }

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ NODE_ENV: ${process.env.NODE_ENV}`);
      console.log('✓ All 6 phases active: Keyword Discovery → Pillar Mapping → Topic Generation → Article Generation → Competitor Analysis → Interlinking');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
