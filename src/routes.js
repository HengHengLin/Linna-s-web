export const pages = ['market-flow', 'home', 'knowledge', 'perspectives', 'industry', 'index-research', 'research', 'markets', 'english', 'portfolio'];
export function parseRoute(hash) {
  const segments = hash.replace(/^#\/?/, '').split('/');
  if (!segments[0]) return { page: 'home', id: null };
  if (!pages.includes(segments[0]) || segments.length > 2) return { page: 'not-found', id: null };
  try { return { page: segments[0], id: segments[1] ? decodeURIComponent(segments[1]) : null }; }
  catch { return { page: 'not-found', id: null }; }
}
export const routeUrl = (page, id) => `#/${page}${id ? `/${encodeURIComponent(id)}` : ''}`;
export const pageFor = kind => ['research', 'topic'].includes(kind) ? 'research' : kind === 'briefing' ? 'markets' : 'english';
export function filterEntries(entries, { query = '', category = '', date = '' } = {}) {
  const needle = query.trim().toLocaleLowerCase();
  return entries.filter(x => (!category || x.category === category || x.tags.includes(category)) &&
    (!date || x.date === date) && (!needle || `${x.title} ${x.summary} ${x.category} ${x.tags.join(' ')} ${x.body}`.toLocaleLowerCase().includes(needle)));
}

export const statusLabel = entry => entry.status === 'demo' ? '演示内容' : entry.status === 'curated' ? (entry.kind === 'topic' ? '研究选题' : entry.kind === 'briefing' ? '事实简报' : '视频与练习') : '研究文章';
