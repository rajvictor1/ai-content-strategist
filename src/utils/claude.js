import Anthropic from '@anthropic-ai/sdk';

export async function discoverKeywords(client, topic, count = 25) {
  const prompt = `You are an SEO expert. Generate ${count} keywords for "${topic}". Return JSON array with: keyword, volume, difficulty, intent, description.`;
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });
  let keywords = [];
  try {
    keywords = JSON.parse(response.content[0].text);
  } catch (e) {
    const m = response.content[0].text.match(/\[[\s\S]*\]/);
    if (m) keywords = JSON.parse(m[0]);
  }
  return {
    keywords,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens
  };
}

export async function createPillarStructure(client, keywords, pillarCount = 11) {
  const keywordList = keywords.map(k => ({ id: k.id, keyword: k.keyword }));
  const prompt = `Organize these keywords into ${pillarCount} pillars. Return JSON array with: name, description, authority (number 0-100), keywordIds (array of keyword IDs from the input). Input keywords:\n${JSON.stringify(keywordList)}`;
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });
  let pillars = [];
  try {
    pillars = JSON.parse(response.content[0].text);
  } catch (e) {
    const m = response.content[0].text.match(/\[[\s\S]*\]/);
    if (m) pillars = JSON.parse(m[0]);
  }
  return {
    pillars: pillars.map(p => ({ ...p, authority: Number(p.authority) || 0 })),
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens
  };
}

export async function generateTopicsForKeyword(client, keyword, pillarTitle) {
  const prompt = `Create 3 outlines (TOFU, MOFU, BOFU) for "${keyword}". Return JSON.`;
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });
  let topics = {};
  try {
    topics = JSON.parse(response.content[0].text);
  } catch (e) {
    const m = response.content[0].text.match(/\{[\s\S]*\}/);
    if (m) topics = JSON.parse(m[0]);
  }
  return {
    ...topics,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens
  };
}

export async function generateArticleContent(client, topic, keyword, pillarTitle) {
  const prompt = `Write 1500-2000 word article on "${topic}". Use markdown.`;
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }]
  });
  const content = response.content[0].text;
  return {
    content,
    wordCount: content.split(/\s+/).length,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens
  };
}

export async function analyzeCompetitor(client, keyword, url, title) {
  const prompt = `Analyze "${title}". Return JSON with: strengths, weaknesses, beats, confidenceScore.`;
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });
  let analysis = {};
  try {
    analysis = JSON.parse(response.content[0].text);
  } catch (e) {
    const m = response.content[0].text.match(/\{[\s\S]*\}/);
    if (m) analysis = JSON.parse(m[0]);
  }
  return {
    analysis,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens
  };
}

export async function generateInterlinkingStrategy(client, articles) {
  const articleList = articles.map(a => `${a.title} (${a.slug})`).join('\n');
  const prompt = `Suggest internal links between these articles:\n${articleList}\nReturn JSON array with: source, target, anchorText, reason. Suggest max 3 links per article.`;
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });
  let links = [];
  try {
    links = JSON.parse(response.content[0].text);
  } catch (e) {
    const m = response.content[0].text.match(/\[[\s\S]*\]/);
    if (m) links = JSON.parse(m[0]);
  }
  return {
    links,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens
  };
}
