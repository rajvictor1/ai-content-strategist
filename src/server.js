import 'dotenv/config.js';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import keywordRoutes from './routes/keywords.js';
import pillarRoutes from './routes/pillars.js';
import topicRoutes from './routes/topics.js';
import articleRoutes from './routes/articles.js';
import competitorRoutes from './routes/competitors.js';
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

// Routes
app.use('/api/keywords', keywordRoutes);
app.use('/api/pillars', pillarRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/competitors', competitorRoutes);
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
