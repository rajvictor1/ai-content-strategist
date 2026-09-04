export async function searchWebForKeywords(keyword) {
  return estimateKeywordMetrics(keyword);
}

export function estimateKeywordMetrics(keyword) {
  const keywords = keyword.split(' ');
  const length = keywords.length;
  let volume = 1000;
  let difficulty = 25;

  if (length === 1) {
    volume = Math.floor(Math.random() * 5000) + 1000;
    difficulty = Math.floor(Math.random() * 40) + 20;
  } else if (length === 2) {
    volume = Math.floor(Math.random() * 3000) + 500;
    difficulty = Math.floor(Math.random() * 35) + 15;
  } else {
    volume = Math.floor(Math.random() * 2000) + 100;
    difficulty = Math.floor(Math.random() * 30) + 10;
  }

  let intent = 'Informational';
  const buyerTerms = ['buy', 'price', 'cost', 'cheap', 'best', 'download', 'sign up'];
  if (buyerTerms.some(term => keyword.toLowerCase().includes(term))) {
    intent = 'Commercial';
  }

  return { keyword, volume, difficulty, intent, source: 'estimated' };
}

export async function getCompetitors(keyword) {
  return [
    { rank: 1, url: `https://example1.com/${keyword.replace(/\s+/g, '-')}`, title: `The Complete Guide to ${keyword}`, domain: 'example1.com', authority: 65, backlinks: 1240 },
    { rank: 2, url: `https://example2.com/${keyword.replace(/\s+/g, '-')}`, title: `${keyword} - Everything You Need to Know`, domain: 'example2.com', authority: 58, backlinks: 890 },
    { rank: 3, url: `https://example3.com/${keyword.replace(/\s+/g, '-')}`, title: `Best ${keyword} Tips and Tricks`, domain: 'example3.com', authority: 52, backlinks: 620 },
  ];
}
