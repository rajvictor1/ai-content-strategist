import express from 'express';
import { discoverKeywords, createPillarStructure } from '../utils/claude.js';

const router = express.Router();

router.post('/search', async (req, res, next) => {
  try {
    const { topic, count = 25 } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });
    
    console.log(`\n🔍 Discovering keywords for: "${topic}" (target: ${count})`);
    const { keywords, tokensUsed } = await discoverKeywords(req.claude, topic, count);
    console.log(`✓ Found ${keywords.length} keywords`);
    
    const savedKeywords = [];
    for (const kw of keywords) {
      const existing = await req.prisma.keyword.findUnique({
        where: { keyword: kw.keyword },
      });
      if (!existing) {
        const saved = await req.prisma.keyword.create({
          data: {
            keyword: kw.keyword,
            searchVolume: parseVolume(kw.estimatedVolume),
            difficulty: parseDifficulty(kw.estimatedDifficulty),
            intent: kw.intent,
            source: 'claude_discovery',
          },
        });
        savedKeywords.push(saved);
      } else {
        savedKeywords.push(existing);
      }
    }
    
    await req.prisma.projectSettings.update({
      where: { id: 'default' },
      data: {
        keywordsDiscovered: { increment: savedKeywords.length },
        totalTokens: { increment: tokensUsed },
      },
    });

    res.json({
      success: true,
      keywordsFound: savedKeywords.length,
      keywords: savedKeywords,
      tokensUsed,
      estimatedCost: (tokensUsed * 0.003) / 1000,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const keywords = await req.prisma.keyword.findMany({
      orderBy: { discovered: 'desc' },
      include: { topics: true, pillar: true },
    });
    res.json(keywords);
  } catch (error) {
    next(error);
  }
});

router.get('/stats/summary', async (req, res, next) => {
  try {
    const keywords = await req.prisma.keyword.findMany();
    const assigned = keywords.filter(k => k.pillarId).length;
    const stats = {
      totalDiscovered: keywords.length,
      totalAssigned: assigned,
      avgDifficulty: keywords.length > 0 ? Math.round(keywords.reduce((sum, k) => sum + k.difficulty, 0) / keywords.length) : 0,
      totalVolume: keywords.reduce((sum, k) => sum + k.searchVolume, 0),
      byIntent: {
        informational: keywords.filter(k => k.intent === 'Informational').length,
        commercial: keywords.filter(k => k.intent === 'Commercial').length,
        transactional: keywords.filter(k => k.intent === 'Transactional').length,
      },
    };
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.post('/organize-pillars', async (req, res, next) => {
  try {
    const { pillarCount = 11 } = req.body;
    const keywords = await req.prisma.keyword.findMany();
    if (keywords.length === 0) {
      return res.status(400).json({ error: 'No keywords found. Run keyword discovery first.' });
    }
    console.log(`\n🏛️  Organizing ${keywords.length} keywords into ${pillarCount} pillars`);
    const { pillars, tokensUsed } = await createPillarStructure(req.claude, keywords.map(k => ({ keyword: k.keyword, intent: k.intent })), pillarCount);
    console.log(`✓ Created ${pillars.length} pillars`);
    
    const savedPillars = [];
    for (const pillarData of pillars) {
      const pillar = await req.prisma.pillar.create({ data: { title: pillarData.title, description: pillarData.description } });
      for (const keywordText of pillarData.keywords) {
        await req.prisma.keyword.updateMany({ where: { keyword: keywordText }, data: { pillarId: pillar.id } });
      }
      savedPillars.push({ ...pillar, keywords: pillarData.keywords });
    }
    
    await req.prisma.projectSettings.update({
      where: { id: 'default' },
      data: { keywordsAssigned: keywords.length, totalTokens: { increment: tokensUsed } },
    });

    res.json({ success: true, pillarsCreated: savedPillars.length, pillars: savedPillars, tokensUsed, estimatedCost: (tokensUsed * 0.003) / 1000 });
  } catch (error) {
    next(error);
  }
});

function
cat > src/utils/claude.js << 'EOF'
export async function discoverKeywords(client, topic, count = 25) {
  const prompt = `You are a keyword research expert. Generate ${count} highly relevant keywords for the topic: "${topic}"

Include head terms, long-tail variations, question-based keywords, commercial modifiers, and different buyer stages.

For each keyword, estimate:
- Search Intent: Informational | Commercial | Transactional
- Estimated Volume: Low (100-500) | Medium (500-2000) | High (2000+)
- Estimated Difficulty: Low (0-30) | Medium (30-60) | High (60-100)

Return as JSON array: { keyword, intent, estimatedVolume, estimatedDifficulty }`;

  const response = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Failed to parse keywords from Claude response');

  const keywords = JSON.parse(jsonMatch[0]);
  return { keywords, tokensUsed: response.usage.input_tokens + response.usage.output_tokens };
}

export async function createPillarStructure(client, keywords, pillarCount = 11) {
  const keywordList = keywords.map(k => k.keyword).join(', ');
  const prompt = `You are a content strategist. Organize these ${keywords.length} keywords into ${pillarCount} pillar clusters.

Keywords: ${keywordList}

For each pillar create a title, description, and assign 7-10 keywords as child topics.

Return as JSON: { pillars: [{ title, description, keywords: [...] }] }`;

  const response = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse pillar structure from Claude response');

  const structure = JSON.parse(jsonMatch[0]);
  return { pillars: structure.pillars, tokensUsed: response.usage.input_tokens + response.usage.output_tokens };
}

export async function generateTopicsForKeyword(client, keyword, pillarTitle) {
  const prompt = `You are a content strategist for the pillar "${pillarTitle}".
Create 3 article topic outlines for the keyword: "${keyword}"
One each for TOFU (awareness), MOFU (consideration), BOFU (decision).
Include title, meta description, and 6-8 section outline.
Return JSON: { tofu: {...}, mofu: {...}, bofu: {...} }`;

  const response = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse topics from Claude response');

  const topics = JSON.parse(jsonMatch[0]);
  return { tofu: topics.tofu, mofu: topics.mofu, bofu: topics.bofu, tokensUsed: response.usage.input_tokens + response.usage.output_tokens };
}

export async function generateArticleContent(client, topic, keyword, pillarTitle) {
  const prompt = `Write a comprehensive, SEO-optimized article:
Title: ${topic.title}
Keyword: ${keyword}
Meta: ${topic.metaDesc}
Sections: ${topic.sections.join(', ')}

Requirements: 1500-2000 words, markdown format, use keyword 3-5 times, practical examples, actionable advice.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0].text;
  const wordCount = content.split(/\s+/).length;
  return { content, wordCount, tokensUsed: response.usage.input_tokens + response.usage.output_tokens };
}

export async function analyzeCompetitor(client, keyword, competitorUrl, competitorTitle) {
  const prompt = `Analyze this competitor article for keyword: "${keyword}"
URL: ${competitorUrl}
Title: ${competitorTitle}

Identify: strengths, weaknesses, how we can beat them.
Return JSON: { strengths: [...], weaknesses: [...], beats: [...], confidenceLevel: "easy|medium|hard" }`;

  const response = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse competitor analysis from Claude response');

  const analysis = JSON.parse(jsonMatch[0]);
  return { analysis, tokensUsed: response.usage.input_tokens + response.usage.output_tokens };
}
