import Anthropic from '@anthropic-ai/sdk';

export async function discoverKeywords(client, topic, count = 25) {
  const prompt = `You are an SEO expert. Generate ${count} keywords for "${topic}". Return JSON array with: keyword, volume, difficulty, intent, description.`;
  const response = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
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
  const keywordList = keywords.map(k => k.keyword).join(', ');
  const prompt = `Organize into ${pillarCount} pillars: ${keywordList}. Return JSON array with: name, description, authority, keywords.`;
  const response = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
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
    pillars,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens
  };
}

export async function generateTopicsForKeyword(client, keyword, pillarTitle) {
  const prompt = `Create 3 outlines (TOFU, MOFU, BOFU) for "${keyword}". Return JSON.`;
  const response = await client.messages.create({
    model: 'claude-opus-4-1-20250805',
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
    model: 'claude-opus-4-1-20250805',
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
    model: 'claude-opus-4-1-20250805',
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
