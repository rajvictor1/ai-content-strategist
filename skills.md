# Claude AI Capabilities & Usage

## Overview

The AI Content Strategist leverages Claude API for intelligent content generation and analysis across all 6 phases of the content strategy pipeline.

## Phase 1: Keyword Discovery

### Claude's Role
- Generate SEO keywords for a given topic
- Estimate search volume and difficulty
- Classify search intent (informational, commercial, transactional, navigational)
- Provide keyword descriptions and use cases

### Implementation
```javascript
const keywords = await discoverKeywords(client, 'AI agents', 25);
// Returns: Array of keywords with volume, difficulty, intent
```

### API Call Details
- **Model**: claude-haiku-4-5-20251001 (cost-effective for high volume)
- **Max Tokens**: 2000
- **Temperature**: 0.7 (balanced creativity and consistency)

### Prompt Engineering
- Provides domain context (AI agent development)
- Requests structured JSON output
- Includes fallback regex extraction for parsing

### Cost Estimation
- ~150 keywords per $0.01 USD
- Phase 1 (25 keywords): ~$0.002

## Phase 2: Pillar Structure Organization

### Claude's Role
- Group keywords into topical pillars
- Create pillar hierarchy (authority-level)
- Generate pillar descriptions

### Implementation
```javascript
const pillars = await createPillarStructure(client, keywords, 11);
// Returns: Organized pillar structure with title and description
```

### API Call Details
- **Model**: claude-haiku-4-5-20251001
- **Max Tokens**: 3000
- **Temperature**: 0.5 (structured output priority)

## Phase 3: Topic Generation

### Claude's Role
- Generate topic outlines for each keyword
- Create TOFU/MOFU/BOFU content stages
- Suggest complementary keywords

### Implementation
```javascript
const topics = await generateTopicsForKeyword(client, keyword, pillar);
// Returns: Outline with structure and key points
```

### API Call Details
- **Model**: claude-haiku-4-5-20251001
- **Max Tokens**: 2500
- **Temperature**: 0.6

## Phase 4: Article Generation

### Claude's Role
- Write full 1500-2000 word articles
- Include proper SEO metadata
- Maintain brand voice consistency

### Implementation
```javascript
const article = await generateArticleContent(client, topic, keyword, pillar);
// Returns: Complete article with metadata
```

### API Call Details
- **Model**: claude-haiku-4-5-20251001
- **Max Tokens**: 3000
- **Temperature**: 0.7

### Content Quality
- Unique, original content
- Proper heading hierarchy (H1, H2, H3)
- Internal linking opportunities identified
- Meta descriptions included

## Phase 5: Competitor Analysis

### Claude's Role
- Analyze competitor content
- Identify content gaps
- Suggest content improvements

### Implementation
```javascript
const analysis = await analyzeCompetitor(client, keyword, url, title);
// Returns: Detailed competitive analysis
```

### API Call Details
- **Model**: claude-haiku-4-5-20251001
- **Max Tokens**: 2000
- **Temperature**: 0.5

## Phase 6: Internal Linking Strategy

### Claude's Role
- Identify linking opportunities
- Create link context and anchor text
- Improve site topology

### Implementation
```javascript
// Analyze articles for linking opportunities
// Suggest anchor text and linking strategy
```

## Token Usage Tracking

### Token Counting
```javascript
const tokens = response.usage.output_tokens + response.usage.input_tokens;
await updateProjectTokens(tokens);
```

### Cost Calculation
- **Input Tokens**: $0.80 per 1M tokens (Haiku)
- **Output Tokens**: $4.00 per 1M tokens (Haiku)
- **Total**: Track and display in project dashboard

### Budget Management
- Set token budget limits per phase
- Alert on overages
- Optimize prompts to reduce token usage

## Error Handling

### API Errors
- **Rate Limits**: Implement exponential backoff
- **Invalid Model**: Fallback to claude-3-5-sonnet
- **Network Errors**: Retry up to 3 times
- **Parse Errors**: Extract data with fallback regex

### Response Validation
- Verify JSON structure
- Check for required fields
- Validate data types
- Log parsing errors

## Prompt Best Practices

### Structure
1. **Context**: What is the task domain?
2. **Instructions**: What exactly should be done?
3. **Format**: What format should the output be?
4. **Examples**: Show 1-2 examples (if complex)
5. **Constraints**: Any limitations or guidelines?

### Example Prompt
```
You are an expert SEO content strategist. Generate 10 high-quality 
keywords for the topic "AI agent development". For each keyword, 
provide a JSON object with:
- keyword: the keyword phrase
- searchVolume: estimated monthly searches
- difficulty: SEO difficulty (0-100)
- intent: search intent type
- description: brief description of the keyword

Return as valid JSON array. If you cannot parse properly, use regex 
to extract keyword|volume|difficulty|intent lines.
```

## Model Selection Guide

| Task | Model | Reason |
|------|-------|--------|
| Keyword Discovery | Haiku | Fast, cost-effective |
| Article Generation | Haiku | Sufficient quality, budget-friendly |
| Competitor Analysis | Haiku | Analysis capability, good value |
| Complex Topics | Sonnet | Better reasoning for nuanced topics |
| Editing/Review | Haiku | Simple comparison task |

## Future Enhancements

### Planned Improvements
- Vision API integration for image analysis
- Fine-tuning for brand-specific content
- Custom system prompts per client
- Multi-language content generation

### Research Areas
- Caching for repeated queries
- Batch processing for efficiency
- Real-time feedback loops
- Custom model fine-tuning

