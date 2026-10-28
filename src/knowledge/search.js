// Search relationships by stable security IDs, never fuzzy company-name joins.
export function searchKnowledge(k, companies, filters = {}) {
  const {q='', company='', industry='', index='', researcher='', date='', stance='', status=''} = filters;
  const needle=q.trim().toLowerCase();
  const companyMatch=c=>(!company||c.id===company)&&(!industry||c.chains.some(x=>x.id===industry))&&(!index||c.indices.some(x=>x.id===index));
  const views=k.perspectives.filter(p=>{
    const related=k.relationships.filter(e=>e.perspectiveId===p.id).map(e=>companies.find(c=>c.id===e.companyId)).filter(Boolean);
    const author=k.researchers.find(r=>r.id===p.researcherId);
    const text=[p.title,p.thesis,author?.name,author?.organization,...related.flatMap(c=>[c.id,c.name]),...p.industryIds].join(' ').toLowerCase();
    return (!researcher||p.researcherId===researcher)&&(!date||p.publishedAt===date)&&(!stance||p.stance===stance)&&(!status||p.state===status)&&(!industry||p.industryIds.includes(industry))&&(!(company||index)||related.some(companyMatch))&&(!needle||text.includes(needle));
  });
  const perspectiveFilter=Boolean(researcher||date||stance||status);
  const matchingCompanies=companies.filter(c=>companyMatch(c)&&(!perspectiveFilter||k.relationships.some(e=>e.companyId===c.id&&views.some(p=>p.id===e.perspectiveId)))&&(!needle||[c.name,c.id,...c.chains.map(x=>x.stage)].join(' ').toLowerCase().includes(needle)||views.some(p=>k.relationships.some(e=>e.companyId===c.id&&e.perspectiveId===p.id))));
  const hypotheses=k.hypotheses.filter(h=>(!company||h.companyIds.includes(company))&&(!industry||h.industryIds.includes(industry))&&(!index||h.companyIds.some(id=>companies.find(c=>c.id===id)?.indices.some(x=>x.id===index)))&&(!status||h.state===status)&&(!(researcher||date||stance))&&(!needle||[h.title,h.counter,...h.companyIds,...h.companyIds.map(id=>companies.find(c=>c.id===id)?.name)].join(' ').toLowerCase().includes(needle)));
  return {views,matchingCompanies,hypotheses};
}
