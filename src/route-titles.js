// Detail routes are local research entities, not public-content article IDs.
export function researchRouteTitle({page, id}) {
  if (page === 'market-flow') return id === 'btc' ? '美国现货 BTC ETF 资金监测' : '市场资金监测';
  if (page === 'industry') return ({aerospace:'航空航天产业链研究',biopharma:'创新药产业链研究','embodied-ai':'AI 与具身智能产业链研究'})[id] || null;
  if (page === 'knowledge') return id?.startsWith('hypothesis:') ? '研究假设档案' : '研究知识网络';
  if (page === 'perspectives') return id ? '研究者观点档案' : '研究者观点库';
  if (page === 'index-research') return '指数与产业链研究';
  return null;
}
